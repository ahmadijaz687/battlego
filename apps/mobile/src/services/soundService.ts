type SoundName =
  | 'setComplete'
  | 'pr'
  | 'restTimerEnd'
  | 'battleWin'
  | 'achievement'
  | 'buttonTap'
  | 'error'
  | 'notification'
  | 'levelUp'
  | 'tabSwitch'
  | 'pullRefresh';

const VOLUME_MAP: Record<SoundName, number> = {
  setComplete: 0.5,
  pr: 0.65,
  restTimerEnd: 0.5,
  battleWin: 0.7,
  achievement: 0.55,
  buttonTap: 0.2,
  error: 0.4,
  notification: 0.35,
  levelUp: 0.6,
  tabSwitch: 0.15,
  pullRefresh: 0.2,
};

let Audio: any = null;
let sounds: Map<SoundName, any> = new Map();
let soundEnabled = true;
let initialized = false;

export async function initSounds() {
  if (initialized) return;
  try {
    // @ts-ignore — expo-av is optional, resolved at runtime
    Audio = (await import('expo-av')).Audio;
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: false });
    initialized = true;
  } catch {
    Audio = null;
  }
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

async function play(_name: SoundName) {
  if (!soundEnabled || !Audio) return;
  const sound = sounds.get(_name);
  if (!sound) return;
  try {
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch {
    // Playback error — silent
  }
}

async function loadSound(name: SoundName, asset: any) {
  if (!Audio || !initialized) return;
  try {
    const volume = VOLUME_MAP[name] ?? 0.4;
    const { sound } = await Audio.Sound.createAsync(asset, { volume });
    sounds.set(name, sound);
  } catch {
    // Load failed — skip
  }
}

export async function loadSoundsFromAssets(assets: Partial<Record<SoundName, any>>) {
  if (!Audio || !initialized) return;
  for (const [name, asset] of Object.entries(assets)) {
    if (asset) {
      await loadSound(name as SoundName, asset);
    }
  }
}

export const sound = {
  playSetComplete: () => play('setComplete'),
  playPR: () => play('pr'),
  playRestTimerEnd: () => play('restTimerEnd'),
  playBattleWin: () => play('battleWin'),
  playAchievement: () => play('achievement'),
  playButtonTap: () => play('buttonTap'),
  playError: () => play('error'),
  playNotification: () => play('notification'),
  playLevelUp: () => play('levelUp'),
  playTabSwitch: () => play('tabSwitch'),
  playPullRefresh: () => play('pullRefresh'),
};

export async function unloadSounds() {
  for (const [, audio] of sounds) {
    try {
      await audio.unloadAsync();
    } catch {
      // ignore
    }
  }
  sounds.clear();
  initialized = false;
}
