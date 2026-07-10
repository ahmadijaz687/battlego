import { Platform } from 'react-native';

const isNative = Platform.OS !== 'web';

export type SocialProvider = 'google';

export interface SocialAuthResult {
  uid: string;
  email: string | null;
  displayName: string | null;
  idToken: string;
  accessToken?: string;
}

export async function signInWithProvider(
  _provider: SocialProvider,
): Promise<SocialAuthResult> {
  if (!isNative) {
    throw new Error('Social sign-in is not available on web');
  }

  // Dynamic imports to avoid native module resolution on web
  const auth = (await import('@react-native-firebase/auth')).default;
  const { GoogleAuthProvider } = await import('@react-native-firebase/auth');
  const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
  const { GOOGLE_WEB_CLIENT_ID } = await import('../config/firebase');

  async function signInWithGoogle(): Promise<SocialAuthResult> {
    GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (response.type !== 'success' || !response.data.idToken) {
      throw new Error('Google sign-in failed to return an ID token');
    }
    const data = response.data as { idToken: string; accessToken?: string };
    const credential = GoogleAuthProvider.credential(data.idToken);
    const userCredential = await auth().signInWithCredential(credential);
    const idToken = await userCredential.user.getIdToken();
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      idToken,
      accessToken: data.accessToken,
    };
  }

  return signInWithGoogle();
}
