import { insertRow } from './helpers';
import type { DB } from './index';

interface ArticleData {
  title: string;
  category: string;
  summary: string;
  content: string;
  tags: string[];
  difficulty: string;
  evidence_level?: string;
}

const FORM_ARTICLES: ArticleData[] = [
  {
    title: 'Barbell Back Squat Form',
    category: 'form',
    summary: 'Complete guide to proper barbell back squat technique for safety and effectiveness.',
    content: JSON.stringify({
      cues: [
        'Place bar on upper traps (high bar) or rear delts (low bar)',
        'Feet shoulder-width apart, toes pointed out 15-30 degrees',
        'Brace core hard — take a big breath and hold it',
        'Break at hips and knees simultaneously',
        'Push knees out — track them over your toes',
        'Descend to parallel or below (hip crease below knee)',
        'Drive through mid-foot to stand back up',
        'Keep chest up throughout the entire movement',
        'Exhale at the top, re-brace for next rep'
      ],
      common_mistakes: [
        'Knees caving inward (valgus collapse)',
        'Butt wink (excessive pelvis tuck at bottom)',
        'Heels lifting off the ground',
        'Chest dropping forward (good-morning squat)',
        'Not reaching depth (above parallel)'
      ],
      tips: [
        'Start with goblet squats to learn the pattern',
        'Use weightlifting shoes if ankle mobility is limited',
        'Film yourself from the side to check depth',
        'Warm up with 2-3 progressive warm-up sets'
      ],
      muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
      equipment: ['Barbell', 'Squat Rack']
    }),
    tags: ['squat', 'barbell', 'legs', 'compound', 'strength', 'quadriceps', 'glutes'],
    difficulty: 'beginner',
    evidence_level: 'established',
  },
  {
    title: 'Conventional Deadlift Form',
    category: 'form',
    summary: 'Master the deadlift with proper setup, pull, and lockout technique.',
    content: JSON.stringify({
      cues: [
        'Bar over mid-foot — shins 1 inch from the bar',
        'Bend down and grip bar just outside your knees',
        'Shins touch the bar without pushing it forward',
        'Chest up, back flat, shoulders slightly over the bar',
        'Pull the slack out of the bar before lifting',
        'Push the floor away with your feet (leg press the floor)',
        'Keep bar close to body — drag it up your shins',
        'As bar passes knees, drive hips forward to lockout',
        'Lock out with glutes — do not hyperextend the lower back',
        'Lower by hinging hips back, bending knees once bar clears them'
      ],
      common_mistakes: [
        'Rounding the lower back (lumbar flexion)',
        'Bar drifting away from the body',
        'Hyperextending at lockout',
        'Jerking the bar off the floor',
        'Starting with hips too high (stiff-legging it)'
      ],
      tips: [
        'Use chalk or straps if grip is the limiting factor',
        'Pull the slack out — hear the "click" before you lift',
        'Wear socks or use shin guards to protect shins',
        'Breathe and brace before each rep — do not breathe mid-rep'
      ],
      muscles: ['Back', 'Hamstrings', 'Glutes', 'Forearms', 'Core'],
      equipment: ['Barbell']
    }),
    tags: ['deadlift', 'barbell', 'back', 'compound', 'strength', 'hamstrings', 'glutes'],
    difficulty: 'intermediate',
    evidence_level: 'established',
  },
  {
    title: 'Barbell Bench Press Form',
    category: 'form',
    summary: 'Everything you need to know about proper bench press technique.',
    content: JSON.stringify({
      cues: [
        'Lie on bench, eyes directly under the bar',
        'Retract and depress shoulder blades — pinch them together and down',
        'Grip bar slightly wider than shoulder width',
        'Drive feet into the floor for leg drive',
        'Unrack by pressing bar up, not pulling it forward',
        'Lower bar to mid-chest (nipple line) with control',
        'Elbows at roughly 75 degrees from body (not flared at 90)',
        'Touch chest, then drive bar back and slightly toward your face',
        'Keep wrists neutral — stacked over elbows'
      ],
      common_mistakes: [
        'Flaring elbows at 90 degrees (shoulder injury risk)',
        'Bouncing bar off the chest',
        'Lifting butt off the bench',
        'Uneven bar path or lockout',
        'Losing scapular retraction mid-set'
      ],
      tips: [
        'Think about "bending the bar" to keep elbows at proper angle',
        'Use a slight arch — not flat-backed, not exaggerated',
        'Keep full-body tightness from set-up through the last rep',
        'Have a spotter for heavy sets or use a power rack'
      ],
      muscles: ['Chest', 'Triceps', 'Shoulders'],
      equipment: ['Barbell', 'Bench']
    }),
    tags: ['bench-press', 'barbell', 'chest', 'compound', 'strength', 'triceps', 'shoulders'],
    difficulty: 'beginner',
    evidence_level: 'established',
  },
  {
    title: 'Overhead Press Form',
    category: 'form',
    summary: 'Build strong shoulders with proper overhead press technique.',
    content: JSON.stringify({
      cues: [
        'Start with bar on front delts (rack position)',
        'Grip shoulder-width, elbows slightly forward of the bar',
        'Feet hip-width apart, brace core, squeeze glutes',
        'Press bar straight up while moving head back slightly',
        'Bar path goes around your face — not straight up',
        'Lock out with bar directly overhead, biceps near ears',
        'Lower bar back to front delts with control',
        'Keep forearms vertical throughout the movement'
      ],
      common_mistakes: [
        'Excessive lower back arch',
        'Bar too far forward at lockout',
        'Not moving head out of the way',
        'Pressing from a soft rack position',
        'Lifting heels or shifting weight'
      ],
      tips: [
        'Squeeze glutes hard to protect lower back',
        'Work on thoracic mobility if you struggle with lockout',
        'Start with dumbbell presses if barbell OHP is too challenging',
        'Practice in a power rack with safety pins set high'
      ],
      muscles: ['Shoulders', 'Triceps', 'Core'],
      equipment: ['Barbell']
    }),
    tags: ['overhead-press', 'barbell', 'shoulders', 'compound', 'strength', 'triceps'],
    difficulty: 'intermediate',
    evidence_level: 'established',
  },
  {
    title: 'Barbell Row Form',
    category: 'form',
    summary: 'Build a thick back with proper barbell row technique.',
    content: JSON.stringify({
      cues: [
        'Hinge at hips until torso is roughly 45 degrees',
        'Grip bar slightly wider than shoulder width',
        'Pull bar toward your lower chest / upper abdomen',
        'Squeeze shoulder blades together at the top',
        'Lower the bar with control — no dropping',
        'Keep core braced and spine neutral throughout',
        'Drive elbows back, not up — think about pulling with your back',
        'Avoid using momentum or excessive body English'
      ],
      common_mistakes: [
        'Standing too upright (turns into a shrug)',
        'Using too much momentum / body swing',
        'Not squeezing at the top',
        'Rounding the lower back',
        'Pulling to the wrong spot on the torso'
      ],
      tips: [
        'Start with a lighter weight to nail the pattern',
        'Use an overhand grip for upper back, underhand for lats',
        'Pause at the top for 1 second to reinforce squeeze',
        'Pendlay rows (from floor each rep) are a strict variation'
      ],
      muscles: ['Back', 'Biceps', 'Forearms'],
      equipment: ['Barbell']
    }),
    tags: ['barbell-row', 'barbell', 'back', 'compound', 'strength', 'biceps'],
    difficulty: 'intermediate',
    evidence_level: 'established',
  },
  {
    title: 'Pull-up Form',
    category: 'form',
    summary: 'Master the pull-up with proper technique and progression.',
    content: JSON.stringify({
      cues: [
        'Grip bar slightly wider than shoulder width, overhand grip',
        'Hang with arms fully extended (dead hang)',
        'Engage lats by pulling shoulder blades down first',
        'Pull chin over bar by driving elbows down and back',
        'Control the descent — lower fully to dead hang',
        'Avoid kipping or swinging for momentum',
        'Keep core braced and body in a straight line',
        'Exhale on the way up, inhale on the way down'
      ],
      common_mistakes: [
        'Half reps (not going to full dead hang)',
        'Kipping before strict strength is developed',
        'Gripping too narrow or too wide',
        'Shrugging shoulders to ears instead of engaging lats',
        'Crossing legs and swinging'
      ],
      tips: [
        'Start with negative reps (jump up, lower slowly for 5 seconds)',
        'Use resistance bands for assisted pull-ups',
        'Scapular pull-ups build lat engagement',
        'Grease the groove: do a few reps throughout the day'
      ],
      muscles: ['Latissimus Dorsi', 'Biceps', 'Forearms'],
      equipment: ['Pull-up Bar']
    }),
    tags: ['pull-ups', 'bodyweight', 'back', 'compound', 'strength', 'biceps'],
    difficulty: 'intermediate',
    evidence_level: 'established',
  },
  {
    title: 'Push-up Form',
    category: 'form',
    summary: 'Perfect your push-up with proper body alignment and technique.',
    content: JSON.stringify({
      cues: [
        'Hands slightly wider than shoulder width, fingers spread',
        'Body in a straight line from head to heels',
        'Brace core — squeeze glutes and quads',
        'Lower chest to within 1 inch of the floor',
        'Elbows at 45-degree angle from body (not flared at 90)',
        'Push through palms to full lockout',
        'Maintain rigid plank position throughout',
        'Breathe in on the way down, out on the way up'
      ],
      common_mistakes: [
        'Hips sagging (anterior pelvic tilt)',
        'Hips piked up too high',
        'Elbows flaring to 90 degrees',
        'Neck craning forward',
        'Not going through full range of motion'
      ],
      tips: [
        'Film yourself from the side to check body alignment',
        'Scale with knee push-ups or incline push-ups if needed',
        'Think about "pushing the floor away" not just extending arms',
        'Protract shoulder blades at the top for full range'
      ],
      muscles: ['Chest', 'Triceps', 'Shoulders', 'Core'],
      equipment: ['Bodyweight']
    }),
    tags: ['push-ups', 'bodyweight', 'chest', 'compound', 'triceps', 'shoulders'],
    difficulty: 'beginner',
    evidence_level: 'established',
  },
  {
    title: 'Dumbbell Lateral Raise Form',
    category: 'form',
    summary: 'Build wide shoulders with proper lateral raise technique.',
    content: JSON.stringify({
      cues: [
        'Stand with dumbbells at your sides, slight bend in elbows',
        'Raise arms out to the sides until parallel with floor',
        'Lead with elbows, not hands — think about pouring water',
        'Slight forward lean (5-10 degrees) to target medial delt',
        'Lower with control — resist gravity on the eccentric',
        'Stop at shoulder height — going higher recruits traps',
        'Keep wrists neutral — slightly below or in line with elbows',
        'Squeeze at the top for 1 second'
      ],
      common_mistakes: [
        'Using too much weight (compensating with momentum)',
        'Swinging the weight up',
        'Shrugging traps into the movement',
        'Raising arms too high (above parallel)',
        'Leaning back excessively'
      ],
      tips: [
        'Use light weight — 5-15 lbs is enough for most people',
        'Perform in front of a mirror to check form',
        'Try cable lateral raises for constant tension',
        'Partial reps at the top can increase time under tension'
      ],
      muscles: ['Shoulders'],
      equipment: ['Dumbbell']
    }),
    tags: ['lateral-raise', 'dumbbell', 'shoulders', 'isolation', 'hypertrophy'],
    difficulty: 'beginner',
    evidence_level: 'established',
  },
  {
    title: 'Bicep Curl Form',
    category: 'form',
    summary: 'Maximize bicep growth with proper curling technique.',
    content: JSON.stringify({
      cues: [
        'Stand tall with dumbbells at sides, palms facing forward',
        'Keep elbows pinned to your sides throughout',
        'Curl the weight up by flexing the biceps',
        'Squeeze at the top for 1 second',
        'Lower slowly — 2-3 second eccentric',
        'Full range of motion: full extension to full contraction',
        'Keep wrists neutral — don\'t curl the wrists',
        'Avoid swinging or using body momentum'
      ],
      common_mistakes: [
        'Swinging the dumbbells (momentum curl)',
        'Elbows drifting forward during the curl',
        'Not fully extending at the bottom',
        'Using too much weight',
        'Rushing the eccentric phase'
      ],
      tips: [
        'Try concentration curls for peak contraction',
        'Incline dumbbell curls stretch the long head more',
        'Preacher curls prevent cheating',
        'Slow the eccentric for maximum hypertrophy stimulus'
      ],
      muscles: ['Biceps'],
      equipment: ['Dumbbell']
    }),
    tags: ['bicep-curl', 'dumbbell', 'biceps', 'isolation', 'hypertrophy', 'arms'],
    difficulty: 'beginner',
    evidence_level: 'established',
  },
  {
    title: 'Tricep Dip Form',
    category: 'form',
    summary: 'Build triceps and chest with proper dip technique.',
    content: JSON.stringify({
      cues: [
        'Grip parallel bars, jump or press to support position',
        'Lean slightly forward to engage chest more',
        'Keep elbows close to body for tricep emphasis',
        'Lower until upper arms are parallel to floor (or below)',
        'Press back up to full lockout',
        'Keep shoulders down — don\'t shrug',
        'Core braced, legs still (no swinging)',
        'Control the descent — no dropping'
      ],
      common_mistakes: [
        'Going too deep (excessive shoulder extension)',
        'Shrugging shoulders to ears',
        'Using momentum / kipping',
        'Flaring elbows excessively',
        'Bouncing at the bottom'
      ],
      tips: [
        'For triceps: stay upright, elbows close',
        'For chest: lean forward more, wider elbow angle',
        'Start with bench dips if full dips are too hard',
        'Add weight only when you can do 12+ clean reps'
      ],
      muscles: ['Triceps', 'Chest', 'Shoulders'],
      equipment: ['Dip Station']
    }),
    tags: ['dips', 'bodyweight', 'triceps', 'compound', 'chest', 'shoulders'],
    difficulty: 'intermediate',
    evidence_level: 'established',
  },
  {
    title: 'Romanian Deadlift Form',
    category: 'form',
    summary: 'Target hamstrings and glutes with proper RDL technique.',
    content: JSON.stringify({
      cues: [
        'Start standing with bar at hip level (or from rack)',
        'Soft bend in knees — locked throughout the movement',
        'Hinge at hips, pushing them back as far as possible',
        'Lower bar along your thighs and shins',
        'Feel a deep stretch in hamstrings at the bottom',
        'Drive hips forward to return to standing',
        'Squeeze glutes hard at the top',
        'Keep bar close to body the entire time'
      ],
      common_mistakes: [
        'Rounding the back (spinal flexion)',
        'Squatting the weight instead of hinging',
        'Bending knees too much',
        'Bar drifting away from body',
        'Not hinging far enough to feel hamstrings'
      ],
      tips: [
        'Think "push hips to the wall behind you"',
        'Stop when hamstrings are fully stretched (don\'t force depth)',
        'Use a slight pause at the bottom to feel the stretch',
        'Dumbbell RDLs are great for learning the pattern'
      ],
      muscles: ['Hamstrings', 'Glutes', 'Back'],
      equipment: ['Barbell']
    }),
    tags: ['romanian-deadlift', 'barbell', 'hamstrings', 'glutes', 'compound', 'strength'],
    difficulty: 'intermediate',
    evidence_level: 'established',
  },
  {
    title: 'Leg Press Form',
    category: 'form',
    summary: 'Build strong legs safely on the leg press machine.',
    content: JSON.stringify({
      cues: [
        'Sit with back flat against pad, feet shoulder-width on platform',
        'Position feet high for glutes/hamstrings, low for quads',
        'Release safety locks and lower the platform with control',
        'Lower until knees are at roughly 90 degrees',
        'Do NOT let lower back round off the pad at the bottom',
        'Press through your whole foot to extend legs',
        'Stop just short of full knee lockout (keep slight bend)',
        'Re-engage safety locks when done'
      ],
      common_mistakes: [
        'Lowering too deep (lower back rounds off pad)',
        'Locking out knees at the top',
        'Placing hands on knees to push (cheating)',
        'Not using full range of motion',
        'Letting hips lift off the seat'
      ],
      tips: [
        'Foot placement changes muscle emphasis',
        'One leg at a time can address imbalances',
        'Don\'t ego lift — the machine does some of the stabilization',
        'Control the negative — don\'t let it drop'
      ],
      muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
      equipment: ['Leg Press Machine']
    }),
    tags: ['leg-press', 'machine', 'quadriceps', 'glutes', 'compound', 'strength'],
    difficulty: 'beginner',
    evidence_level: 'established',
  },
  {
    title: 'Cable Fly Form',
    category: 'form',
    summary: 'Isolate your chest with proper cable fly technique.',
    content: JSON.stringify({
      cues: [
        'Set cables at appropriate height (high for lower chest, low for upper)',
        'Stand in the center with a slight forward lean',
        'Start with arms wide, slight bend in elbows',
        'Bring hands together in front of chest in a hugging motion',
        'Squeeze chest muscles at the center — hold for 1 second',
        'Slowly return to starting position, feeling the stretch',
        'Keep the same elbow angle throughout',
        'Control the weight — no momentum'
      ],
      common_mistakes: [
        'Turning it into a press (bending elbows too much)',
        'Using too much weight',
        'Standing too upright',
        'Not controlling the eccentric',
        'Rounding shoulders forward excessively'
      ],
      tips: [
        'Light weight and high reps work best for flies',
        'Focus on the squeeze — imagine hugging a tree',
        'Different cable heights target different areas of the chest',
        'Single-arm flies can help address imbalances'
      ],
      muscles: ['Chest', 'Shoulders'],
      equipment: ['Cable Machine']
    }),
    tags: ['cable-fly', 'cable', 'chest', 'isolation', 'hypertrophy'],
    difficulty: 'intermediate',
    evidence_level: 'established',
  },
  {
    title: 'Face Pull Form',
    category: 'form',
    summary: 'Protect your shoulders and build rear delts with face pulls.',
    content: JSON.stringify({
      cues: [
        'Set cable at face height with rope attachment',
        'Grip rope with thumbs pointing back',
        'Step back until arms are fully extended',
        'Pull rope toward your face, splitting the ends apart',
        'Drive elbows back and squeeze rear delts',
        'End position: hands beside ears, elbows at 90 degrees',
        'Hold the contraction for 1-2 seconds',
        'Return slowly to starting position'
      ],
      common_mistakes: [
        'Pulling too low (toward chest instead of face)',
        'Using too much weight (compensating with body lean)',
        'Not pulling the rope apart at the end',
        'Rushing through the reps',
        'Standing too far from the cable'
      ],
      tips: [
        'Use light weight — 15-25 lbs is plenty for most people',
        'This is a corrective exercise — treat it like prehab',
        'Perform 2-3 sets of 15-20 reps',
        'Add to every push day to maintain shoulder health'
      ],
      muscles: ['Shoulders', 'Back'],
      equipment: ['Cable Machine']
    }),
    tags: ['face-pull', 'cable', 'shoulders', 'rear-delt', 'corrective', 'health'],
    difficulty: 'beginner',
    evidence_level: 'established',
  },
  {
    title: 'Kettlebell Swing Form',
    category: 'form',
    summary: 'Build explosive hip power with proper kettlebell swing technique.',
    content: JSON.stringify({
      cues: [
        'Feet shoulder-width apart, kettlebell in front of you',
        'Hinge at hips to grab the bell (flat back)',
        'Hike the bell back between your legs like a football snap',
        'Explosively drive hips forward to swing the bell up',
        'Arms stay straight — the power comes from your hips',
        'Bell reaches chest or eye level at the top',
        'Squeeze glutes at the top — full hip extension',
        'Let the bell swing back between legs and repeat'
      ],
      common_mistakes: [
        'Squatting instead of hinging',
        'Using arms to lift the bell (reverse curl)',
        'Rounding the back at the bottom',
        'Hyperextending at the top',
        'Starting with too heavy a bell'
      ],
      tips: [
        'Practice the hip hinge without a bell first',
        'Think "snap your hips shut" at the top',
        'Start with a light bell (8-12 kg for most beginners)',
        'Breathe: sharp exhale at the top, inhale on the way back'
      ],
      muscles: ['Glutes', 'Hamstrings', 'Back', 'Shoulders', 'Core'],
      equipment: ['Kettlebell']
    }),
    tags: ['kettlebell-swing', 'kettlebell', 'glutes', 'hamstrings', 'power', 'cardio'],
    difficulty: 'intermediate',
    evidence_level: 'established',
  },
  {
    title: 'Lunge Form',
    category: 'form',
    summary: 'Build single-leg strength with proper lunge technique.',
    content: JSON.stringify({
      cues: [
        'Stand tall with dumbbells at sides (or bodyweight)',
        'Step forward one leg length',
        'Lower back knee toward the ground — both knees at 90 degrees',
        'Front knee tracks over toes but not past them',
        'Keep torso upright — don\'t lean forward',
        'Push through the front heel to return to standing',
        'Keep core braced throughout',
        'Alternate legs or complete all reps on one side first'
      ],
      common_mistakes: [
        'Front knee collapsing inward',
        'Leaning too far forward',
        'Taking too short a step (knee past toes excessively)',
        'Wobbling side to side',
        'Not reaching full depth'
      ],
      tips: [
        'Start with bodyweight lunges to master the pattern',
        'Walking lunges are great for conditioning',
        'Reverse lunges are easier on the knees',
        'Hold dumbbells at sides or barbell on back for load'
      ],
      muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
      equipment: ['Dumbbell']
    }),
    tags: ['lunges', 'dumbbell', 'quadriceps', 'glutes', 'compound', 'strength', 'legs'],
    difficulty: 'beginner',
    evidence_level: 'established',
  },
  {
    title: 'Plank Form',
    category: 'form',
    summary: 'Build core stability with a perfect plank hold.',
    content: JSON.stringify({
      cues: [
        'Forearms on the ground, elbows under shoulders',
        'Body in a straight line from head to heels',
        'Engage core — pull belly button toward spine',
        'Squeeze glutes and quads',
        'Keep neck neutral — look at the floor between your hands',
        'Don\'t let hips sag or pike up',
        'Breathe normally — don\'t hold your breath',
        'Hold for time (aim for 30-60 seconds)'
      ],
      common_mistakes: [
        'Hips sagging toward the floor',
        'Hips piked too high',
        'Holding breath',
        'Looking up (straining neck)',
        'Only holding for a few seconds with poor form'
      ],
      tips: [
        'Quality over quantity — stop when form breaks',
        'Start with 3 sets of 20 seconds and build up',
        'Side planks and plank variations add challenge',
        'Plank with shoulder taps adds anti-rotation work'
      ],
      muscles: ['Abdominals', 'Shoulders', 'Core'],
      equipment: ['Bodyweight']
    }),
    tags: ['plank', 'bodyweight', 'core', 'abdominals', 'stability', 'isometric'],
    difficulty: 'beginner',
    evidence_level: 'established',
  },
  {
    title: 'Russian Twist Form',
    category: 'form',
    summary: 'Target obliques with proper Russian twist technique.',
    content: JSON.stringify({
      cues: [
        'Sit on floor, knees bent, feet off the ground',
        'Lean back to about 45 degrees, keeping spine straight',
        'Hold weight or medicine ball at chest level',
        'Rotate torso to one side, touching weight beside hip',
        'Rotate to the other side in a controlled motion',
        'Keep core braced throughout — don\'t relax',
        'Move from the thoracic spine, not just the arms',
        'Breathe naturally — exhale on each rotation'
      ],
      common_mistakes: [
        'Rounding the lower back',
        'Moving only the arms, not the torso',
        'Going too fast (using momentum)',
        'Using too heavy a weight',
        'Not maintaining the lean-back angle'
      ],
      tips: [
        'Start with no weight to master the movement',
        'Feet on the ground is an easier variation',
        'Slow and controlled is better than fast reps',
        'Try with a medicine ball for better grip'
      ],
      muscles: ['Abdominals', 'Obliques', 'Core'],
      equipment: ['Medicine Ball']
    }),
    tags: ['russian-twist', 'bodyweight', 'core', 'abdominals', 'obliques', 'core'],
    difficulty: 'beginner',
    evidence_level: 'established',
  },
  {
    title: 'Leg Curl Form',
    category: 'form',
    summary: 'Isolate hamstrings with proper leg curl technique.',
    content: JSON.stringify({
      cues: [
        'Lie face down on the leg curl machine',
        'Position pad just above your heels',
        'Grab the handles for stability',
        'Curl the weight up by flexing your hamstrings',
        'Bring heels as close to glutes as possible',
        'Squeeze hamstrings at the top for 1 second',
        'Lower the weight slowly — 3 second eccentric',
        'Don\'t lift hips off the pad'
      ],
      common_mistakes: [
        'Lifting hips off the pad (using lower back)',
        'Using momentum to swing the weight',
        'Not going through full range of motion',
        'Rushing the negative phase',
        'Using too much weight'
      ],
      tips: [
        'Point toes to emphasize hamstrings',
        'Try single-leg curls to address imbalances',
        'Slow the eccentric for maximum stimulus',
        'Great accessory for squat and deadlift strength'
      ],
      muscles: ['Hamstrings'],
      equipment: ['Leg Curl Machine']
    }),
    tags: ['leg-curl', 'machine', 'hamstrings', 'isolation', 'strength'],
    difficulty: 'beginner',
    evidence_level: 'established',
  },
  {
    title: 'Calf Raise Form',
    category: 'form',
    summary: 'Build strong calves with proper calf raise technique.',
    content: JSON.stringify({
      cues: [
        'Stand on edge of step or calf raise machine',
        'Balls of feet on the edge, heels hanging off',
        'Lower heels below the step for full stretch',
        'Rise up onto toes as high as possible',
        'Squeeze calves at the top for 1-2 seconds',
        'Lower slowly — control the full eccentric',
        'Keep legs straight for gastrocnemius (outer calf)',
        'Bend knees slightly for soleus (inner calf)'
      ],
      common_mistakes: [
        'Bouncing at the bottom',
        'Not going through full range of motion',
        'Going too heavy and using momentum',
        'Rushing through reps',
        'Not pausing at the top'
      ],
      tips: [
        'Calves respond to high reps (15-25)',
        'Train them 2-3 times per week for growth',
        'Full range of motion is crucial — stretch at bottom',
        'Both straight-leg and bent-knee variations are needed'
      ],
      muscles: ['Calves'],
      equipment: ['Bodyweight', 'Calf Raise Machine']
    }),
    tags: ['calf-raise', 'bodyweight', 'calves', 'isolation', 'strength'],
    difficulty: 'beginner',
    evidence_level: 'established',
  },
  {
    title: 'Barbell Hip Thrust Form',
    category: 'form',
    summary: 'Build powerful glutes with proper hip thrust technique.',
    content: JSON.stringify({
      cues: [
        'Sit on floor with upper back against a bench',
        'Roll bar over legs to hip crease (use a pad)',
        'Feet flat on floor, shoulder-width apart',
        'Drive hips up by squeezing glutes forcefully',
        'Lock out at the top — hips, knees, shoulders in line',
        'Hold the lockout for 1-2 seconds',
        'Lower hips with control back to starting position',
        'Keep chin tucked — look forward, not up'
      ],
      common_mistakes: [
        'Hyperextending the lower back at the top',
        'Feet too far forward (engages hamstrings more)',
        'Not achieving full hip extension',
        'Rushing through reps',
        'Using too much weight and losing form'
      ],
      tips: [
        'Chin tuck helps prevent lumbar hyperextension',
        'Single-leg hip thrusts address imbalances',
        'Start with bodyweight, then add barbell',
        'The hip thrust is the king of glute exercises'
      ],
      muscles: ['Glutes', 'Hamstrings'],
      equipment: ['Barbell', 'Bench']
    }),
    tags: ['hip-thrust', 'barbell', 'glutes', 'compound', 'strength', 'hypertrophy'],
    difficulty: 'intermediate',
    evidence_level: 'established',
  },
  {
    title: 'Incline Dumbbell Press Form',
    category: 'form',
    summary: 'Target upper chest with proper incline dumbbell press technique.',
    content: JSON.stringify({
      cues: ['Set bench to 30-45 degree angle', 'Hold dumbbells at chest level, palms forward', 'Press up and slightly inward', 'Lock out at top without banging dumbbells', 'Lower with control to chest level', 'Keep shoulder blades pinned to bench'],
      common_mistakes: ['Bench too upright (becomes shoulder press)', 'Flaring elbows too wide', 'Bouncing dumbbells at the bottom'],
      tips: ['30-degree incline best targets upper chest', 'Use a spotter for heavy sets', 'Control the negative for maximum growth'],
      muscles: ['Chest', 'Shoulders', 'Triceps'],
      equipment: ['Dumbbell', 'Bench']
    }),
    tags: ['incline-press', 'dumbbell', 'chest', 'compound', 'strength', 'shoulders'],
    difficulty: 'intermediate',
  },
  {
    title: 'Dumbbell Shoulder Press Form',
    category: 'form',
    summary: 'Build balanced shoulders with proper dumbbell press technique.',
    content: JSON.stringify({
      cues: ['Sit on bench with back support', 'Hold dumbbells at shoulder height, palms forward', 'Press up and slightly inward', 'Lock out with dumbbells touching lightly', 'Lower to ear level with control', 'Keep core braced throughout'],
      common_mistakes: ['Using too much weight and arching back', 'Pressing too far forward', 'Not going through full range'],
      tips: ['Seated variation isolates shoulders more', 'Start lighter than barbell OHP', 'Great for addressing strength imbalances'],
      muscles: ['Shoulders', 'Triceps'],
      equipment: ['Dumbbell', 'Bench']
    }),
    tags: ['shoulder-press', 'dumbbell', 'shoulders', 'compound', 'strength'],
    difficulty: 'beginner',
  },
  {
    title: 'Cable Lateral Raise Form',
    category: 'form',
    summary: 'Get constant tension on medial delts with cable lateral raises.',
    content: JSON.stringify({
      cues: ['Stand sideways to cable machine', 'Grip handle with far hand', 'Raise arm out to side until parallel with floor', 'Slight lean away from machine for more range', 'Lower slowly — 2-3 seconds', 'Keep elbow slightly bent throughout'],
      common_mistakes: ['Using too much weight', 'Swinging the weight up', 'Standing too upright (no lean)'],
      tips: ['Cables provide constant tension unlike dumbbells', 'Do 12-20 reps per set', 'Great finisher for shoulder day'],
      muscles: ['Shoulders'],
      equipment: ['Cable Machine']
    }),
    tags: ['cable-lateral-raise', 'cable', 'shoulders', 'isolation', 'hypertrophy'],
    difficulty: 'beginner',
  },
  {
    title: 'Preacher Curl Form',
    category: 'form',
    summary: 'Isolate biceps and prevent cheating with preacher curls.',
    content: JSON.stringify({
      cues: ['Adjust pad so armpits rest on top', 'Grip bar or dumbbell with underhand grip', 'Lower weight until arms are fully extended', 'Curl up by squeezing biceps', 'Squeeze at the top for 1 second', 'Lower slowly — 3 seconds'],
      common_mistakes: ['Using too much weight', 'Lifting elbows off pad', 'Not going through full extension'],
      tips: ['Eliminates momentum and cheating', 'EZ curl bar is more wrist-friendly', 'Great for peak contraction'],
      muscles: ['Biceps'],
      equipment: ['EZ Curl Bar', 'Preacher Bench']
    }),
    tags: ['preacher-curl', 'barbell', 'biceps', 'isolation', 'hypertrophy'],
    difficulty: 'beginner',
  },
  {
    title: 'Skull Crusher Form',
    category: 'form',
    summary: 'Build triceps mass with proper skull crusher technique.',
    content: JSON.stringify({
      cues: ['Lie on bench, hold EZ bar above chest', 'Upper arms stay perpendicular to floor', 'Lower bar toward forehead by bending elbows', 'Stop just before bar touches forehead', 'Extend elbows to lockout', 'Squeeze triceps at the top'],
      common_mistakes: ['Moving upper arms (turns into press)', 'Lowering too close to face', 'Flaring elbows'],
      tips: ['Use EZ bar for wrist comfort', 'Try skull crushers to forehead, temples, or behind head', 'Dumbbell variation helps address imbalances'],
      muscles: ['Triceps'],
      equipment: ['EZ Curl Bar', 'Bench']
    }),
    tags: ['skull-crusher', 'ez-bar', 'triceps', 'isolation', 'hypertrophy'],
    difficulty: 'intermediate',
  },
  {
    title: 'Tricep Pushdown Form',
    category: 'form',
    summary: 'Isolate triceps with proper cable pushdown technique.',
    content: JSON.stringify({
      cues: ['Stand facing cable machine with rope or bar attachment', 'Upper arms pinned to sides', 'Push down by extending elbows', 'Lock out fully at the bottom', 'Squeeze triceps for 1 second', 'Return to 90-degree elbow bend with control'],
      common_mistakes: ['Leaning too far forward', 'Moving upper arms', 'Not fully extending at bottom'],
      tips: ['Rope pushdowns allow more range of motion', 'V-bar is great for heavier weights', 'Do 10-15 reps for best results'],
      muscles: ['Triceps'],
      equipment: ['Cable Machine']
    }),
    tags: ['tricep-pushdown', 'cable', 'triceps', 'isolation', 'hypertrophy'],
    difficulty: 'beginner',
  },
  {
    title: 'Chest Dip Form',
    category: 'form',
    summary: 'Target lower chest with proper chest dip technique.',
    content: JSON.stringify({
      cues: ['Grip parallel bars, jump to support', 'Lean torso forward significantly (30-45 degrees)', 'Lower until upper arms are parallel to floor', 'Feel the stretch in your chest', 'Press back up with chest focus', 'Keep core tight, avoid swinging'],
      common_mistakes: ['Standing too upright (becomes tricep dip)', 'Going too deep (shoulder risk)', 'Using momentum'],
      tips: ['More lean = more chest emphasis', 'Add weight once you can do 15+ reps', 'Great compound chest exercise'],
      muscles: ['Chest', 'Triceps', 'Shoulders'],
      equipment: ['Dip Station']
    }),
    tags: ['chest-dip', 'bodyweight', 'chest', 'compound', 'triceps'],
    difficulty: 'intermediate',
  },
  {
    title: 'Cable Crossover Form',
    category: 'form',
    summary: 'Hit inner chest with proper cable crossover technique.',
    content: JSON.stringify({
      cues: ['Set cables at high position', 'Step forward for a stretch', 'Arms slightly bent, fixed angle', 'Bring hands together in front of chest', 'Cross hands slightly for extra contraction', 'Return slowly to starting stretch position'],
      common_mistakes: ['Using too much weight', 'Turning into a press', 'Not controlling the eccentric'],
      tips: ['High-to-low hits lower chest', 'Low-to-high hits upper chest', 'Light weight and high reps work best'],
      muscles: ['Chest', 'Shoulders'],
      equipment: ['Cable Machine']
    }),
    tags: ['cable-crossover', 'cable', 'chest', 'isolation', 'hypertrophy'],
    difficulty: 'intermediate',
  },
  {
    title: 'Dumbbell Row Form',
    category: 'form',
    summary: 'Build a thick back with single-arm dumbbell row technique.',
    content: JSON.stringify({
      cues: ['Place one knee and hand on bench for support', 'Hold dumbbell in free hand, arm hanging', 'Pull dumbbell toward hip by driving elbow back', 'Squeeze shoulder blade at top', 'Lower slowly with control', 'Keep torso parallel to floor'],
      common_mistakes: ['Rotating torso to swing weight', 'Pulling to chest instead of hip', 'Rounding the back'],
      tips: ['Great for addressing muscle imbalances', 'Pull to hip for maximum lat activation', 'Use a neutral grip for shoulder comfort'],
      muscles: ['Back', 'Biceps'],
      equipment: ['Dumbbell', 'Bench']
    }),
    tags: ['dumbbell-row', 'dumbbell', 'back', 'compound', 'strength'],
    difficulty: 'beginner',
  },
  {
    title: 'Chest-Supported Row Form',
    category: 'form',
    summary: 'Isolate your back without lower back fatigue using chest-supported rows.',
    content: JSON.stringify({
      cues: ['Set incline bench to 30-45 degrees', 'Lie face down on bench', 'Grip dumbbells or use machine', 'Pull weight toward chest by squeezing back', 'Hold the squeeze for 1-2 seconds', 'Lower slowly with full control'],
      common_mistakes: ['Lifting chest off bench', 'Using too much weight', 'Not squeezing at the top'],
      tips: ['Eliminates lower back fatigue', 'Great for volume back training', 'T-bar version is excellent'],
      muscles: ['Back', 'Biceps', 'Rear Delts'],
      equipment: ['Dumbbell', 'Bench']
    }),
    tags: ['chest-supported-row', 'dumbbell', 'back', 'compound', 'strength'],
    difficulty: 'beginner',
  },
  {
    title: 'Lat Pulldown Form',
    category: 'form',
    summary: 'Build lat width with proper lat pulldown technique.',
    content: JSON.stringify({
      cues: ['Grip bar wider than shoulder width', 'Lean back slightly (10-15 degrees)', 'Pull bar to upper chest by driving elbows down', 'Squeeze lats at the bottom', 'Return bar slowly to full extension', 'Keep chest up throughout'],
      common_mistakes: ['Leaning too far back (turns into row)', 'Pulling behind the neck', 'Using momentum / rocking'],
      tips: ['Pull to upper chest, not behind neck', 'Wide grip emphasizes lat width', 'Close grip emphasizes lower lats'],
      muscles: ['Latissimus Dorsi', 'Biceps'],
      equipment: ['Cable Machine']
    }),
    tags: ['lat-pulldown', 'cable', 'back', 'compound', 'strength'],
    difficulty: 'beginner',
  },
  {
    title: 'Machine Shoulder Press Form',
    category: 'form',
    summary: 'Build shoulders safely with machine shoulder press.',
    content: JSON.stringify({
      cues: ['Adjust seat so handles are at shoulder height', 'Grip handles with palms facing forward', 'Press up until arms are nearly locked', 'Hold the top for 1 second', 'Lower until handles are at ear level', 'Keep back flat against pad'],
      common_mistakes: ['Arching lower back excessively', 'Not going through full range', 'Using momentum to start the rep'],
      tips: ['Great for beginners learning to press', 'Good for safely pushing to failure', 'Adjust grip width for different delt emphasis'],
      muscles: ['Shoulders', 'Triceps'],
      equipment: ['Machine']
    }),
    tags: ['machine-shoulder-press', 'machine', 'shoulders', 'compound', 'strength'],
    difficulty: 'beginner',
  },
  {
    title: 'Hack Squat Form',
    category: 'form',
    summary: 'Build quads with proper hack squat machine technique.',
    content: JSON.stringify({
      cues: ['Position shoulders under pads', 'Place feet shoulder-width on platform', 'Feet higher = more glutes, lower = more quads', 'Lower until thighs are parallel to platform', 'Press through whole foot to stand', 'Don\'t lock out knees at the top'],
      common_mistakes: ['Placing feet too narrow', 'Letting lower back round at bottom', 'Locking out knees fully'],
      tips: ['Great quad isolation exercise', 'Try different foot positions for variety', 'Control the negative — don\'t bounce'],
      muscles: ['Quadriceps', 'Glutes'],
      equipment: ['Hack Squat Machine']
    }),
    tags: ['hack-squat', 'machine', 'quadriceps', 'compound', 'strength'],
    difficulty: 'beginner',
  },
  {
    title: 'Leg Extension Form',
    category: 'form',
    summary: 'Isolate quads with proper leg extension technique.',
    content: JSON.stringify({
      cues: ['Adjust pad so it rests on lower shins', 'Grip handles for stability', 'Extend legs until nearly locked out', 'Squeeze quads hard at the top for 1-2 seconds', 'Lower slowly — 3 second eccentric', 'Don\'t let weight stack slam at bottom'],
      common_mistakes: ['Using too much weight', 'Not squeezing at the top', 'Rushing the negative'],
      tips: ['Great finisher for leg day', 'Try single-leg variation for imbalances', 'Pause at the top for maximum contraction'],
      muscles: ['Quadriceps'],
      equipment: ['Leg Extension Machine']
    }),
    tags: ['leg-extension', 'machine', 'quadriceps', 'isolation', 'strength'],
    difficulty: 'beginner',
  },
  {
    title: 'Leg Press Foot Placement Guide',
    category: 'form',
    summary: 'How foot placement on the leg press changes muscle emphasis.',
    content: JSON.stringify({
      high_placement: 'Feet high on platform = more glutes and hamstrings emphasis',
      low_placement: 'Feet low on platform = more quadriceps emphasis',
      wide_stance: 'Wide stance = more inner thighs and glutes',
      narrow_stance: 'Narrow stance = more outer quads',
      single_leg: 'Single leg = addresses imbalances, more core work',
      tips: ['Mix foot positions throughout the week', 'Always use full range of motion', 'Don\'t let hips lift off seat at bottom'],
      muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
      equipment: ['Leg Press Machine']
    }),
    tags: ['leg-press', 'machine', 'quadriceps', 'glutes', 'technique'],
    difficulty: 'beginner',
  },
  {
    title: 'Seated Cable Row Form',
    category: 'form',
    summary: 'Build mid-back thickness with proper seated cable row technique.',
    content: JSON.stringify({
      cues: ['Sit upright with feet on foot plates', 'Grip V-bar or wide grip attachment', 'Pull handle toward lower chest/upper abdomen', 'Squeeze shoulder blades together at the top', 'Return slowly until arms are fully extended', 'Keep torso upright — don\'t lean back excessively'],
      common_mistakes: ['Leaning too far back', 'Rounding shoulders forward', 'Pulling with arms only'],
      tips: ['V-bar grip targets mid-back', 'Wide grip hits upper back and rear delts', 'Think about pulling with elbows, not hands'],
      muscles: ['Back', 'Biceps'],
      equipment: ['Cable Machine']
    }),
    tags: ['seated-cable-row', 'cable', 'back', 'compound', 'strength'],
    difficulty: 'beginner',
  },
  {
    title: 'Concentration Curl Form',
    category: 'form',
    summary: 'Achieve maximum bicep contraction with concentration curls.',
    content: JSON.stringify({
      cues: ['Sit on bench, lean forward', 'Rest elbow on inner thigh of same side', 'Hold dumbbell with underhand grip', 'Curl weight up toward shoulder', 'Squeeze bicep hard at top for 2 seconds', 'Lower slowly to full extension'],
      common_mistakes: ['Using too much weight', 'Swinging the dumbbell', 'Not squeezing at the top'],
      tips: ['Great for bicep peak development', 'Use light weight — 10-20 lbs is plenty', 'Alternate arms or do all reps on one side first'],
      muscles: ['Biceps'],
      equipment: ['Dumbbell', 'Bench']
    }),
    tags: ['concentration-curl', 'dumbbell', 'biceps', 'isolation', 'hypertrophy'],
    difficulty: 'beginner',
  },
  {
    title: 'Dumbbell Fly Form',
    category: 'form',
    summary: 'Stretch and contract the chest with dumbbell flyes.',
    content: JSON.stringify({
      cues: ['Lie flat on bench, hold dumbbells above chest', 'Arms slightly bent — fixed angle throughout', 'Lower dumbbells out to sides, feeling chest stretch', 'Stop when upper arms are parallel to floor', 'Bring dumbbells back together in hugging motion', 'Squeeze chest at the top'],
      common_mistakes: ['Bending elbows too much (becomes press)', 'Going too heavy', 'Lowering too far (shoulder risk)'],
      tips: ['Light weight and high reps work best', 'Focus on the stretch and squeeze', 'Incline variation hits upper chest'],
      muscles: ['Chest', 'Shoulders'],
      equipment: ['Dumbbell', 'Bench']
    }),
    tags: ['dumbbell-fly', 'dumbbell', 'chest', 'isolation', 'hypertrophy'],
    difficulty: 'beginner',
  },
  {
    title: 'Lying Tricep Extension Form',
    category: 'form',
    summary: 'Build tricep mass with lying barbell extensions.',
    content: JSON.stringify({
      cues: ['Lie on bench, hold barbell above chest with narrow grip', 'Keep upper arms perpendicular to floor', 'Lower bar toward forehead by bending elbows', 'Bar stops just above forehead', 'Extend elbows back to starting position', 'Squeeze triceps at full extension'],
      common_mistakes: ['Moving upper arms', 'Flaring elbows', 'Lowering bar to chest instead of forehead'],
      tips: ['EZ bar is more comfortable than straight bar', 'Can target different tricep heads by changing bar path', 'Use a spotter for heavy sets'],
      muscles: ['Triceps'],
      equipment: ['Barbell', 'Bench']
    }),
    tags: ['lying-tricep-extension', 'barbell', 'triceps', 'isolation', 'strength'],
    difficulty: 'beginner',
  },
  {
    title: 'Good Morning Form',
    category: 'form',
    summary: 'Strengthen posterior chain with proper good morning technique.',
    content: JSON.stringify({
      cues: ['Bar on upper back like a squat', 'Feet shoulder-width apart', 'Slight bend in knees — fixed throughout', 'Hinge at hips, pushing them back', 'Lower torso until nearly parallel with floor', 'Drive hips forward to return to standing', 'Squeeze glutes at the top'],
      common_mistakes: ['Rounding the back', 'Bending knees too much', 'Going too heavy too soon'],
      tips: ['Start with very light weight', 'Excellent accessory for deadlift and squat', 'Pause at bottom to feel the hamstring stretch'],
      muscles: ['Hamstrings', 'Glutes', 'Back'],
      equipment: ['Barbell']
    }),
    tags: ['good-morning', 'barbell', 'hamstrings', 'glutes', 'compound', 'strength'],
    difficulty: 'intermediate',
  },
  {
    title: 'Barbell Curl Form',
    category: 'form',
    summary: 'Build big biceps with proper barbell curl technique.',
    content: JSON.stringify({
      cues: ['Stand with feet hip-width, grip bar shoulder-width', 'Elbows pinned to sides throughout', 'Curl bar up by flexing biceps', 'Squeeze at the top for 1 second', 'Lower slowly — 3 second eccentric', 'Full range of motion: full extension to full contraction'],
      common_mistakes: ['Swinging body for momentum', 'Elbows drifting forward', 'Half reps (not full extension)'],
      tips: ['EZ curl bar is more wrist-friendly', 'Chin-ups and barbell curls are the bicep mass builders', 'Try drop sets for extra intensity'],
      muscles: ['Biceps'],
      equipment: ['Barbell']
    }),
    tags: ['barbell-curl', 'barbell', 'biceps', 'isolation', 'hypertrophy'],
    difficulty: 'beginner',
  },
  {
    title: 'Upright Row Form',
    category: 'form',
    summary: 'Build trap and shoulder mass with upright rows.',
    content: JSON.stringify({
      cues: ['Stand with barbell or dumbbells in front', 'Grip slightly narrower than shoulder width', 'Pull weight straight up along body', 'Lead with elbows — they go higher than hands', 'Pull to chest level, not above', 'Lower slowly with control'],
      common_mistakes: ['Going too high (shoulder impingement risk)', 'Using too much weight', 'Grip too narrow'],
      tips: ['Dumbbell version is shoulder-friendlier', 'Keep elbows at or below shoulder height', 'Cable upright rows provide constant tension'],
      muscles: ['Shoulders', 'Trapezius', 'Biceps'],
      equipment: ['Barbell']
    }),
    tags: ['upright-row', 'barbell', 'shoulders', 'traps', 'compound', 'strength'],
    difficulty: 'intermediate',
  },
  {
    title: 'Front Squat Form',
    category: 'form',
    summary: 'Target quads and core with proper front squat technique.',
    content: JSON.stringify({
      cues: ['Rack bar on front delts (clean grip or cross-arm)', 'Elbows high — upper arms parallel to floor', 'Feet shoulder-width, toes slightly out', 'Descend by sitting down between legs', 'Keep torso as upright as possible', 'Knees track over toes, go as deep as possible', 'Drive up leading with elbows'],
      common_mistakes: ['Elbows dropping (bar rolls forward)', 'Leaning forward', 'Not going deep enough'],
      tips: ['Wrist mobility is key for clean grip', 'Cross-arm grip is easier if wrists are tight', 'Excellent for quad development and core strength'],
      muscles: ['Quadriceps', 'Glutes', 'Core'],
      equipment: ['Barbell', 'Squat Rack']
    }),
    tags: ['front-squat', 'barbell', 'quadriceps', 'compound', 'strength', 'core'],
    difficulty: 'intermediate',
  },
  {
    title: 'Reverse Fly Form',
    category: 'form',
    summary: 'Build rear delts and improve posture with reverse flyes.',
    content: JSON.stringify({
      cues: ['Bend forward at hips (or use incline bench)', 'Hold light dumbbells with palms facing each other', 'Raise arms out to sides in an arc motion', 'Squeeze rear delts at the top', 'Lower slowly with control', 'Keep slight bend in elbows throughout'],
      common_mistakes: ['Using too much weight', 'Raising too high (traps take over)', 'Using momentum'],
      tips: ['Light weight is key — 5-15 lbs', 'Cable or band version provides constant tension', 'Essential for shoulder health and posture'],
      muscles: ['Shoulders', 'Back'],
      equipment: ['Dumbbell']
    }),
    tags: ['reverse-fly', 'dumbbell', 'rear-delt', 'isolation', 'corrective'],
    difficulty: 'beginner',
  },
  {
    title: 'Barbell Shrug Form',
    category: 'form',
    summary: 'Build impressive traps with proper barbell shrug technique.',
    content: JSON.stringify({
      cues: ['Stand with barbell in front of thighs', 'Grip bar slightly wider than shoulder width', 'Shrug shoulders straight up toward ears', 'Hold the top for 2-3 seconds', 'Lower slowly with control', 'Keep arms straight throughout — no bending elbows'],
      common_mistakes: ['Rolling shoulders (causes impingement)', 'Using too much weight', 'Not holding at the top'],
      tips: ['Pause at the top for maximum contraction', 'Try behind-the-back shrugs for variety', 'Heavy dumbbells work great too'],
      muscles: ['Trapezius'],
      equipment: ['Barbell']
    }),
    tags: ['shrug', 'barbell', 'traps', 'isolation', 'strength'],
    difficulty: 'beginner',
  },
  {
    title: 'Wrist Curl Form',
    category: 'form',
    summary: 'Build forearm strength with proper wrist curl technique.',
    content: JSON.stringify({
      cues: ['Sit on bench, forearms on thighs or bench edge', 'Hold dumbbell or barbell with palms facing up', 'Let weight roll down to fingertips', 'Curl wrist up as high as possible', 'Squeeze forearms at the top', 'Lower slowly with control'],
      common_mistakes: ['Using too much weight', 'Not going through full range', 'Rushing through reps'],
      tips: ['Start light — forearms are small muscles', 'Reverse wrist curls train the opposite side', 'Great for grip strength improvement'],
      muscles: ['Forearms'],
      equipment: ['Dumbbell', 'Bench']
    }),
    tags: ['wrist-curl', 'dumbbell', 'forearms', 'isolation', 'strength'],
    difficulty: 'beginner',
  },
  {
    title: 'Glute Bridge Form',
    category: 'form',
    summary: 'Activate and strengthen glutes with proper glute bridge technique.',
    content: JSON.stringify({
      cues: ['Lie on floor, knees bent, feet flat hip-width apart', 'Drive through heels to lift hips', 'Squeeze glutes hard at the top', 'Hold lockout for 2-3 seconds', 'Lower hips slowly back to floor', 'Don\'t arch lower back at the top'],
      common_mistakes: ['Hyperextending lower back', 'Pushing through toes instead of heels', 'Not squeezing glutes at top'],
      tips: ['Great warm-up activation exercise', 'Progress to single-leg or barbell hip thrust', 'Hold a weight on hips for added resistance'],
      muscles: ['Glutes', 'Hamstrings'],
      equipment: ['Bodyweight']
    }),
    tags: ['glute-bridge', 'bodyweight', 'glutes', 'isolation', 'activation'],
    difficulty: 'beginner',
  },
  {
    title: 'Ab Rollout Form',
    category: 'form',
    summary: 'Build an iron core with proper ab wheel rollout technique.',
    content: JSON.stringify({
      cues: ['Kneel on floor, grip ab wheel handles', 'Start with wheel under shoulders', 'Roll forward by extending arms and hips', 'Go as far as you can while keeping core tight', 'Pull wheel back toward knees using abs', 'Keep back flat — no sagging or arching'],
      common_mistakes: ['Sagging hips (lower back pain)', 'Going too far too soon', 'Not engaging core'],
      tips: ['Start with small range and increase over time', 'Wall rollout is a great regression', 'One of the most effective core exercises'],
      muscles: ['Abdominals', 'Core'],
      equipment: ['Ab Wheel']
    }),
    tags: ['ab-rollout', 'bodyweight', 'core', 'abdominals', 'strength'],
    difficulty: 'intermediate',
  },
  {
    title: 'Hanging Leg Raise',
    category: 'form',
    summary: 'Proper technique for hanging leg raises to target lower abs and hip flexors.',
    content: JSON.stringify({
      cues: ['Hang from pull-up bar with straight arms', 'Brace core before initiating movement', 'Raise legs by flexing hips and tilting pelvis', 'Go as high as possible (90° or higher)', 'Lower slowly with control', 'Avoid swinging or kipping'],
      common_mistakes: ['Using momentum/swinging', 'Not tilting pelvis (hip flexors dominate)', 'Gripping bar too wide', 'Rounding shoulders forward'],
      tips: ['Start with bent knees if hanging leg raise is too hard', 'Weighted version for progression', 'Hanging knee raise is the regression', 'Keep shoulders engaged throughout'],
      muscles: ['Rectus Abdominis', 'Hip Flexors', 'Obliques'],
      equipment: ['Pull-up Bar']
    }),
    tags: ['hanging-leg-raise', 'bodyweight', 'core', 'abdominals', 'intermediate'],
    difficulty: 'intermediate',
  },
];

const TRAINING_ARTICLES: ArticleData[] = [
  {
    title: 'Complete Guide to Muscle Hypertrophy',
    category: 'programming',
    summary: 'Learn the science behind muscle growth and how to optimize your training.',
    content: JSON.stringify({
      overview: 'Muscle hypertrophy is the enlargement of skeletal muscle fibers in response to resistance training.',
      key_points: [
        'Three drivers: mechanical tension, metabolic stress, muscle damage',
        'Optimal volume: 10-20 sets per muscle group per week',
        'Rep ranges: 6-30 reps, with proximity to failure being the key driver',
        'Frequency: train each muscle 2-3 times per week',
        'Progressive overload is essential for continued growth',
        'Caloric surplus of 300-500 calories above maintenance supports growth',
        'Protein: 1.6-2.2g per kg of bodyweight'
      ],
      rest_periods: '60-90 seconds for hypertrophy, 3+ minutes for strength',
      tips: ['Track your workouts to ensure progression', 'Focus on controlled eccentrics', 'Prioritize sleep for recovery']
    }),
    tags: ['hypertrophy', 'muscle-growth', 'training', 'science', 'progressive-overload'],
    difficulty: 'intermediate',
  },
  {
    title: 'Progressive Overload: The Foundation',
    category: 'programming',
    summary: 'Understanding and implementing progressive overload for continuous gains.',
    content: JSON.stringify({
      overview: 'Progressive overload is the gradual increase of stress placed on the body during exercise.',
      methods: [
        'Adding weight: increase load by 2.5-5% when hitting rep targets',
        'Increasing reps: add one rep per set each workout',
        'Increasing sets: add an extra set for lagging muscles',
        'Decreasing rest: reduce rest periods between sets',
        'Improving form: better technique allows more effective loading',
        'Increasing time under tension: slower eccentrics'
      ],
      tips: ['Log every workout', 'Aim to beat previous performance per session', 'Periodize to prevent plateaus']
    }),
    tags: ['progressive-overload', 'strength', 'training', 'periodization'],
    difficulty: 'beginner',
  },
  {
    title: 'Training Frequency Guide',
    category: 'programming',
    summary: 'How often you should train each muscle for optimal results.',
    content: JSON.stringify({
      overview: 'Training each muscle 2-3 times per week is superior to once per week for hypertrophy.',
      splits: [
        'Full Body 3x/week: Best for beginners',
        'Upper/Lower 4x/week: Great for intermediates',
        'Push/Pull/Legs 6x/week: Popular for advanced lifters',
        'Each muscle 2-3x/week is the target frequency'
      ],
      key_finding: 'Meta-analyses show 2+ times per week produces greater hypertrophy than once weekly',
      tips: ['Start with full body as a beginner', 'Split volume across sessions for quality', 'Match frequency to recovery capacity']
    }),
    tags: ['frequency', 'training-split', 'hypertrophy', 'programming'],
    difficulty: 'beginner',
  },
  {
    title: 'Sets, Reps, and Volume Explained',
    category: 'programming',
    summary: 'How to structure training variables for your goals.',
    content: JSON.stringify({
      rep_ranges: {
        strength: '1-5 reps (heavy weight, neural adaptation)',
        hypertrophy: '6-12 reps (moderate weight, muscle growth)',
        endurance: '12-20+ reps (light weight, metabolic stress)'
      },
      volume_guidelines: {
        maintenance: '4-6 sets per muscle per week',
        optimal: '10-20 sets per muscle per week',
        maximum: '20-25 sets with diminishing returns'
      },
      rpe_guide: 'Most working sets should be RPE 7-9 (1-3 reps in reserve)',
      tips: ['All rep ranges build muscle near failure', 'Spread volume across 2-3 sessions per muscle', 'Save failure for the last set']
    }),
    tags: ['sets', 'reps', 'volume', 'rpe', 'programming'],
    difficulty: 'beginner',
  },
  {
    title: 'Warm-Up and Cool-Down Guide',
    category: 'programming',
    summary: 'Why proper warm-ups and cool-downs matter for performance and injury prevention.',
    content: JSON.stringify({
      warm_up: [
        '5-10 minutes light cardio (rowing, cycling)',
        'Movement prep exercises similar to your workout',
        '2-3 warm-up sets with progressive loading',
        'Targeted mobility work for your planned exercises'
      ],
      cool_down: [
        '5 minutes light aerobic activity',
        'Static stretching: hold each stretch 20-30 seconds',
        'Focus on muscles trained that day'
      ],
      tips: ['Never skip the warm-up', 'Dynamic stretching before, static after', 'Foam rolling before or after training']
    }),
    tags: ['warm-up', 'cool-down', 'mobility', 'injury-prevention'],
    difficulty: 'beginner',
  },
  {
    title: 'Periodization: Structuring Training',
    category: 'programming',
    summary: 'How to plan training cycles for continuous progress.',
    content: JSON.stringify({
      types: [
        'Linear: high volume/low intensity to low volume/high intensity',
        'Undulating (DUP): vary intensity daily or weekly',
        'Block: focused mesocycles (hypertrophy → strength → peaking)',
        'Conjugate: train multiple qualities simultaneously'
      ],
      deload: 'Every 4-8 weeks, reduce volume by 40-60% while maintaining intensity',
      tips: ['Beginners can use linear progression', 'Intermediate+ benefit from DUP or block', 'Always include deload weeks']
    }),
    tags: ['periodization', 'programming', 'strength', 'planning'],
    difficulty: 'advanced',
  },
  {
    title: 'Overcoming Plateaus',
    category: 'programming',
    summary: 'Practical strategies to break through strength and muscle gain stalls.',
    content: JSON.stringify({
      common_causes: [
        'Insufficient volume → add 1-2 sets per exercise',
        'Insufficient intensity → increase weight or push closer to failure',
        'Poor recovery → deload, increase sleep, check nutrition',
        'Program staleness → change exercises or rep ranges',
        'Inadequate nutrition → increase calories and protein'
      ],
      plateau_buster: [
        'Deload for 1 week',
        'Switch exercises for 4 weeks',
        'Increase frequency to each muscle 3x per week',
        'Add 1-2 hard sets to lagging body parts'
      ],
      tips: ['Film your sets to check form', 'Be patient — some plateaus last 4-8 weeks', 'Trust the process']
    }),
    tags: ['plateau', 'stalling', 'progress', 'programming'],
    difficulty: 'intermediate',
  },
  {
    title: 'Training for Beginners: First 90 Days',
    category: 'programming',
    summary: 'A complete beginner\'s guide to starting a fitness program.',
    content: JSON.stringify({
      phase_1_weeks_1_4: 'Learn form, build consistency — 3 full body sessions, 2-3 sets of 10-15',
      phase_2_weeks_5_8: 'Build strength — 3-4 sessions, 8-12 reps, RPE 7-8',
      phase_3_weeks_9_12: 'Progressive overload — add weight or reps weekly, 4 sessions upper/lower',
      essentials: ['Consistency beats intensity', 'Form over everything', 'Progressive overload', 'Eat enough protein (1.6g/kg)', 'Sleep 7-9 hours', 'Visible changes take 8-12 weeks'],
      sample: 'Workout A: Squat 3x10, Bench 3x10, Row 3x10, Plank 3x30s\nWorkout B: Deadlift 3x8, OHP 3x10, Pull-up 3x5, Leg Raise 3x10'
    }),
    tags: ['beginner', 'training', 'fitness', 'foundation'],
    difficulty: 'beginner',
  },
  {
    title: 'Cardio for Muscle Gain',
    category: 'programming',
    summary: 'How to incorporate cardio without compromising muscle gains.',
    content: JSON.stringify({
      overview: 'Moderate cardio (150 min/week) does not impair muscle gain in a surplus.',
      best_cardio: 'LISS (walking, incline walking, easy cycling) — 30-45 min, 120-140 BPM',
      hiit_guidelines: 'Limit HIIT to 2-3 sessions, 15-20 min each. Prefer low-impact (rower, bike).',
      step_target: '8,000-12,000 steps daily for NEAT',
      tips: ['Separate cardio from lifting when possible', 'Never do intense cardio before leg day', 'Walking is the best cardio for lifters']
    }),
    tags: ['cardio', 'muscle-gain', 'HIIT', 'LISS'],
    difficulty: 'intermediate',
  },
  {
    title: 'Push/Pull/Legs Split Guide',
    category: 'programming',
    summary: 'Design an effective push/pull/legs training split.',
    content: JSON.stringify({
      overview: 'The PPL split trains each muscle group 2x per week with focused sessions.',
      push_day: 'Bench press, overhead press, dips, lateral raises, tricep work',
      pull_day: 'Deadlift or rows, pull-ups, face pulls, curls, rear delts',
      leg_day: 'Squats or leg press, RDLs, lunges, leg curls, calf raises',
      frequency: '6 days/week (PPLPPL) or 3 days/week (PPL with rest days)',
      tips: ['Great for intermediate lifters', 'Allows high volume per muscle', 'Can be modified for 4 or 5 days']
    }),
    tags: ['ppl', 'training-split', 'programming', 'hypertrophy'],
    difficulty: 'intermediate',
  },
  {
    title: 'Upper/Lower Split Guide',
    category: 'programming',
    summary: 'Structure an upper/lower training split for balanced development.',
    content: JSON.stringify({
      overview: 'The upper/lower split trains each muscle group 2x per week.',
      upper_day: 'Bench, rows, OHP, pull-ups, curls, lateral raises, tricep work',
      lower_day: 'Squats, deadlifts or RDLs, lunges, leg curls, calf raises',
      frequency: '4 days per week (ULUL or UL-Rest-UL-Rest)',
      tips: ['Great for intermediate lifters', 'Balanced volume distribution', 'Allows 2-3 rest days per week']
    }),
    tags: ['upper-lower', 'training-split', 'programming', 'hypertrophy'],
    difficulty: 'intermediate',
  },
  {
    title: 'Full Body Training Program',
    category: 'programming',
    summary: 'Design an effective full body training program.',
    content: JSON.stringify({
      overview: 'Full body training hits all muscle groups each session — ideal for beginners.',
      frequency: '3 sessions per week with rest days between',
      structure: 'Start with compound movements, add accessories',
      sample: 'Squat 3x8, Bench 3x8, Row 3x8, OHP 3x8, Plank 3x30s',
      progression: 'Add 2.5kg or 1 rep each session',
      tips: ['Best program for beginners', 'Allows maximum frequency per muscle', 'Lower per-session volume, higher weekly frequency']
    }),
    tags: ['full-body', 'training-split', 'programming', 'beginner'],
    difficulty: 'beginner',
  },
  {
    title: 'Strength Program: 5x5',
    category: 'programming',
    summary: 'Classic 5x5 strength program for building a solid strength foundation.',
    content: JSON.stringify({
      overview: 'The 5x5 program uses 5 sets of 5 reps on compound lifts with linear progression.',
      workout_a: 'Squat 5x5, Bench Press 5x5, Barbell Row 5x5',
      workout_b: 'Squat 5x5, Overhead Press 5x5, Deadlift 1x5',
      frequency: '3 sessions per week (A-B-A, then B-A-B)',
      progression: 'Add 2.5kg per session on upper body, 5kg on lower body',
      tips: ['Best for beginners to intermediate', 'Simple and effective', 'When stalling, switch to intermediate program']
    }),
    tags: ['5x5', 'strength', 'programming', 'beginner', 'linear-progression'],
    difficulty: 'beginner',
  },
  {
    title: 'Hypertrophy Program: 4-Day Split',
    category: 'programming',
    summary: 'A 4-day hypertrophy program optimized for muscle growth.',
    content: JSON.stringify({
      overview: 'A 4-day upper/lower split designed for maximum muscle growth.',
      day_1_upper: 'Bench 4x8, Row 4x8, OHP 3x10, Pull-ups 3x10, Curls 3x12, Lateral Raise 3x15',
      day_2_lower: 'Squat 4x8, RDL 4x10, Leg Press 3x12, Leg Curl 3x12, Calf Raise 4x15',
      progression: 'Add reps each week, then increase weight',
      tips: ['Volume: 10-20 sets per muscle per week', 'RPE 7-9 for working sets', 'Include 1 deload per month']
    }),
    tags: ['hypertrophy', '4-day', 'programming', 'muscle-gain'],
    difficulty: 'intermediate',
  },
  {
    title: 'Powerlifting Competition Prep',
    category: 'programming',
    summary: 'Structure a powerlifting meet prep cycle for peak performance.',
    content: JSON.stringify({
      overview: 'A 12-16 week peaking cycle for powerlifting competition.',
      phases: [
        'Hypertrophy block (weeks 1-4): Volume accumulation',
        'Strength block (weeks 5-8): Intensity increase',
        'Peaking block (weeks 9-12): Singles and competition模拟',
        'Taper (weeks 13-14): Deload before meet'
      ],
      key_lifts: 'Squat, bench press, deadlift',
      tips: ['Practice competition commands', 'Select openers at RPE 8', 'Don\'t try new things in prep']
    }),
    tags: ['powerlifting', 'competition', 'programming', 'peaking'],
    difficulty: 'advanced',
  },
  {
    title: 'Bodyweight Training Program',
    category: 'programming',
    summary: 'A complete bodyweight training program for strength and muscle.',
    content: JSON.stringify({
      overview: 'Bodyweight training can build impressive strength and muscle without gym access.',
      progressions: {
        push: 'Push-ups → Diamond Push-ups → Archer Push-ups → One-arm Push-up',
        pull: 'Australian Rows → Pull-ups → Archer Pull-ups → One-arm Pull-up',
        legs: 'Squats → Bulgarian Split Squats → Pistol Squats → Shrimp Squats',
        core: 'Plank → Ab Rollout → Hanging Leg Raise → Dragon Flag'
      },
      frequency: '3-4 sessions per week',
      tips: ['Master each progression before moving up', 'Add weight with a backpack when bodyweight becomes easy', 'Combine with gym training for best results']
    }),
    tags: ['bodyweight', 'calisthenics', 'programming', 'no-equipment'],
    difficulty: 'beginner',
  },
  {
    title: 'Deload Protocol',
    category: 'programming',
    summary: 'A complete deload protocol for recovery and supercompensation.',
    content: JSON.stringify({
      overview: 'A planned reduction in training stress to allow full recovery.',
      when: ['Every 4-8 weeks', 'After competition or max test', 'When progress stalls', 'When feeling consistently fatigued'],
      protocol: 'Keep intensity (weight) the same, reduce volume by 50-60%',
      duration: '5-7 days',
      what_to_expect: 'Strength bounces back or exceeds previous levels after deload',
      tips: ['Trust the process', 'Don\'t add extra sessions during deload', 'Use deload weeks to focus on mobility and form']
    }),
    tags: ['deload', 'recovery', 'programming', 'fatigue-management'],
    difficulty: 'intermediate',
  },
  {
    title: 'RPE-Based Training',
    category: 'programming',
    summary: 'How to use Rate of Perceived Exertion for auto-regulated training.',
    content: JSON.stringify({
      overview: 'RPE-based training adjusts load based on how you feel each day.',
      scale: { 10: 'Max effort, 0 RIR', 9: '1 rep in reserve', 8: '2 reps in reserve', 7: '3 reps in reserve', 6: '4+ reps in reserve' },
      guidelines: 'Most working sets at RPE 7-9, save RPE 10 for test day',
      benefits: ['Auto-regulates fatigue', 'Prevents overtraining', 'Allows daily readiness-based training'],
      tips: ['Be honest with RPE ratings', 'Film sets to verify RPE', 'Start conservatively and build']
    }),
    tags: ['rpe', 'auto-regulation', 'programming', 'strength'],
    difficulty: 'intermediate',
  },
  {
    title: 'Bulgarian Method Training',
    category: 'programming',
    summary: 'High-frequency training for rapid strength and skill development.',
    content: JSON.stringify({
      overview: 'The Bulgarian method emphasizes daily maxes on competition lifts with high frequency.',
      structure: 'Train squat, bench, and deadlift (or variations) 4-6 times per week',
      approach: 'Work up to a daily max (heavy single), then back-off sets',
      volume: 'High frequency compensates for lower per-session volume',
      tips: ['Not for beginners — requires high work capacity', 'Body awareness is critical', 'Best used in short training blocks (4-6 weeks)']
    }),
    tags: ['bulgarian', 'high-frequency', 'programming', 'strength'],
    difficulty: 'advanced',
  },
  {
    title: 'Greyskull LP Program',
    category: 'programming',
    summary: 'The Greyskull Linear Progression program for balanced strength and hypertrophy.',
    content: JSON.stringify({
      overview: 'A modified 5x5 that adds AMRAP sets for hypertrophy and better progression.',
      workout_a: 'Bench Press 3x5+, Barbell Row 3x5+, Squat 3x5+',
      workout_b: 'Overhead Press 3x5+, Chin-ups 3x5+, Deadlift 1x5+',
      progression: 'Add 2.5kg upper, 5kg lower when all reps completed',
      amrap: 'Last set is AMRAP (as many reps as possible) — this drives hypertrophy',
      tips: ['Reset weight to 85% when stalling', 'Plugins available for arms, neck, etc.', 'Great beginner program']
    }),
    tags: ['greyskull', 'linear-progression', 'programming', 'beginner', 'strength'],
    difficulty: 'beginner',
  },
];

const NUTRITION_ARTICLES: ArticleData[] = [
  {
    title: 'Macros and Calorie Tracking',
    category: 'nutrition',
    summary: 'How to calculate and track your macronutrients for any goal.',
    content: JSON.stringify({
      macros: {
        protein: { calories_per_gram: 4, recommended: '1.6-2.2g per kg', sources: 'Lean meats, eggs, dairy, legumes, protein powders' },
        carbs: { calories_per_gram: 4, recommended: '3-5g per kg', sources: 'Oats, rice, potatoes, fruits, whole grains' },
        fat: { calories_per_gram: 9, recommended: '0.8-1.2g per kg', sources: 'Avocados, nuts, seeds, olive oil, fatty fish' }
      },
      calorie_calculator: 'Estimate TDEE, then adjust: -300 to -500 for loss, +300 to +500 for gain',
      macro_distribution: {
        muscle_gain: '30-35% protein, 40-50% carbs, 20-25% fat',
        fat_loss: '35-40% protein, 30-40% carbs, 20-30% fat'
      },
      tips: ['Use a food scale for accuracy', 'Track for 80%+ of days for progress', 'Consistency matters more than perfection']
    }),
    tags: ['macros', 'nutrition', 'calories', 'tracking', 'diet'],
    difficulty: 'beginner',
  },
  {
    title: 'Protein: How Much, When, What',
    category: 'nutrition',
    summary: 'Evidence-based guide to protein intake for muscle building.',
    content: JSON.stringify({
      recommended: {
        sedentary: '0.8g per kg',
        active: '1.2-1.6g per kg',
        muscle_building: '1.6-2.2g per kg',
        cutting: '2.0-2.4g per kg'
      },
      timing: 'Distribute across 3-6 meals of 20-40g each. Total daily intake matters more than timing.',
      anabolic_window: 'Post-workout window is wider than believed — up to 2 hours',
      bedtime: '30-40g slow-digesting protein (casein, cottage cheese) before bed',
      top_sources: ['Chicken breast (31g/100g)', 'Salmon (20g/100g)', 'Eggs (6.5g each)', 'Greek yogurt (10g/100g)', 'Whey protein (25g/scoop)', 'Tofu (8g/100g)'],
      tips: ['Aim for 2-3g leucine per meal', 'Animal proteins are complete; combine plant sources', 'Protein has the highest thermic effect of food']
    }),
    tags: ['protein', 'nutrition', 'muscle-building', 'amino-acids'],
    difficulty: 'beginner',
  },
  {
    title: 'Nutrition for Fat Loss',
    category: 'nutrition',
    summary: 'Science-backed nutrition strategies for sustainable fat loss.',
    content: JSON.stringify({
      deficit: '300-500 calories below TDEE — sustainable and muscle-preserving',
      protein_during_cut: 'Increase to 2.0-2.4g per kg to preserve muscle',
      volume_eating: 'Low-calorie-dense foods (vegetables, fruits, lean proteins) for satiety',
      approaches: ['Standard calorie counting (most flexible)', 'IIFYM', 'Intermittent fasting', 'Low carb/keto'],
      refeeds: 'One higher-carb day per week at maintenance calories',
      rate_of_loss: 'Aim for 0.5-1% of body weight per week',
      tips: ['Don\'t go below 1200 cal (women) or 1500 cal (men)', 'Measure progress with photos and measurements, not just scale', 'Take diet breaks if needed']
    }),
    tags: ['fat-loss', 'nutrition', 'diet', 'cutting', 'calories'],
    difficulty: 'beginner',
  },
  {
    title: 'Muscle Gain Nutrition',
    category: 'nutrition',
    summary: 'Optimize your diet for maximum muscle gain with minimal fat.',
    content: JSON.stringify({
      surplus: '300-500 calories above TDEE for lean gaining',
      protein: '1.6-2.2g per kg, distributed across 3-6 meals',
      carbs: '4-6g per kg during a bulk — carbs are protein-sparing',
      fat: '0.8-1.2g per kg — don\'t go too low for hormone health',
      timing: 'Pre-workout (2-3h before), post-workout (within 2h), bedtime (slow protein)',
      supplements: ['Whey protein', 'Creatine monohydrate (5g daily)', 'Vitamin D if deficient'],
      rate_of_gain: '0.25-0.5% of bodyweight per week',
      tips: ['Track progress with strength gains, measurements, and photos', 'Don\'t dirty bulk — keep the surplus moderate']
    }),
    tags: ['muscle-gain', 'bulking', 'nutrition', 'protein', 'calorie-surplus'],
    difficulty: 'intermediate',
  },
  {
    title: 'Hydration for Performance',
    category: 'nutrition',
    summary: 'How proper hydration impacts performance and recovery.',
    content: JSON.stringify({
      daily_needs: '30-40ml per kg bodyweight, plus 500-1000ml per hour of exercise',
      dehydration_effects: 'Even 2% dehydration can reduce performance by 10-20%',
      signs: 'Dark urine, headache, fatigue, dizziness, dry mouth, muscle cramps',
      strategy: [
        'Morning: 500ml water upon waking',
        'Pre-workout: 500ml 2 hours before',
        'During: 200-300ml every 15-20 minutes',
        'Post-workout: 500ml per 0.5kg weight lost'
      ],
      electrolytes: 'For sessions over 60 min, add sodium, potassium, magnesium',
      tips: ['Urine color: pale yellow = hydrated, dark = dehydrated', 'Caffeine counts toward fluid intake', 'Alcohol impairs hydration and recovery']
    }),
    tags: ['hydration', 'water', 'electrolytes', 'performance'],
    difficulty: 'beginner',
  },
  {
    title: 'Meal Timing Around Workouts',
    category: 'nutrition',
    summary: 'What to eat before, during, and after training.',
    content: JSON.stringify({
      pre_workout_2_3h: 'Complete meal with protein, carbs, low fat. 0.4-0.5g/kg protein + 0.5-1g/kg carbs.',
      pre_workout_30_60m: 'Small snack — banana, rice cakes. Caffeine: 200-400mg.',
      during_workout: 'Sessions under 60 min: water only. Over 60 min: 30-60g carbs per hour.',
      post_workout: 'Within 2 hours: 0.4-0.5g/kg protein + 0.5-1g/kg carbs.',
      fasted_training: 'Does not improve long-term fat loss. Individual preference.',
      tips: ['Total daily intake matters most', 'Pre-workout nutrition is most important', 'Don\'t stress about the anabolic window — it\'s hours wide']
    }),
    tags: ['nutrient-timing', 'pre-workout', 'post-workout', 'nutrition'],
    difficulty: 'intermediate',
  },
  {
    title: 'Creatine: The Evidence',
    category: 'nutrition',
    summary: 'Everything you need to know about creatine supplementation.',
    content: JSON.stringify({
      benefits: ['5-15% improvement in strength and power', 'Enhanced muscle growth', 'Some evidence for cognitive benefits', 'Extensively studied, very safe'],
      dosing: '3-5g per day. Loading (20g/day for 5-7 days) is optional but speeds saturation.',
      timing: 'Post-workout with carbs and protein may improve uptake, but total daily dose matters most.',
      form: 'Creatine monohydrate is the gold standard. Other forms are not proven superior.',
      myths: ['Not a steroid (naturally occurring compound)', 'Does not damage healthy kidneys', 'Does not cause cramping', 'Cycling is unnecessary'],
      tips: ['Most researched supplement in existence', '$0.10 per serving — incredible value', 'Vegetarians/vegans may see greater benefits']
    }),
    tags: ['creatine', 'supplements', 'strength', 'performance'],
    difficulty: 'beginner',
  },
  {
    title: 'Meal Prep for Fitness',
    category: 'nutrition',
    summary: 'Batch cooking strategies for consistent nutrition.',
    content: JSON.stringify({
      benefits: ['Saves 5+ hours weekly', 'Ensures portion control', 'Reduces impulse eating', 'Makes hitting macros consistent'],
      approach: [
        'Choose 2-3 proteins (chicken, beef, tofu)',
        'Choose 2-3 carbs (rice, quinoa, sweet potato)',
        'Choose 2-3 vegetables (broccoli, green beans, peppers)',
        'Choose sauces (marinara, teriyaki, salsa) — store separately'
      ],
      storage: 'Fridge: 3-5 days. Freezer: up to 3 months.',
      tips: ['Invest in a food scale', 'Glass containers are best', 'Undercook slightly as reheating finishes cooking', 'Buy proteins in bulk for savings']
    }),
    tags: ['meal-prep', 'nutrition', 'batch-cooking', 'planning'],
    difficulty: 'beginner',
  },
  {
    title: 'Supplements That Actually Work',
    category: 'nutrition',
    summary: 'Evidence-based supplement recommendations.',
    content: JSON.stringify({
      tier_1_strong_evidence: ['Creatine monohydrate (5g/day)', 'Protein powder (20-25g/scoop)', 'Caffeine (200-400mg pre-workout)', 'Vitamin D (2000-5000 IU/day)', 'Fish oil (2-3g EPA+DHA)'],
      tier_2_moderate: ['Beta-alanine (3-5g/day)', 'Citrulline malate (6-8g pre-workout)', 'Magnesium (200-400mg before bed)'],
      tier_3_ineffective: ['BCAAs (useless with adequate protein)', 'Testosterone boosters', 'Fat burners', 'Glutamine'],
      tips: ['Supplements supplement diet, don\'t replace it', 'Buy from reputable brands with third-party testing', 'Start one supplement at a time']
    }),
    tags: ['supplements', 'evidence-based', 'creatine', 'protein'],
    difficulty: 'beginner',
  },
  {
    title: 'Understanding TDEE',
    category: 'nutrition',
    summary: 'How to calculate your Total Daily Energy Expenditure for accurate calorie targets.',
    content: JSON.stringify({
      overview: 'TDEE is the total calories your body burns per day including activity.',
      calculation: 'TDEE = BMR × Activity Multiplier',
      bmr_methods: ['Mifflin-St Jeor (most accurate)', 'Harris-Benedict (older, slightly overestimates)'],
      activity_multipliers: { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 },
      tips: ['Track weight for 2 weeks at estimated TDEE to verify', 'Adjust by 200 calories if weight is trending wrong', 'Recalculate as weight changes']
    }),
    tags: ['tdee', 'calories', 'nutrition', 'metabolism'],
    difficulty: 'beginner',
  },
  {
    title: 'Fiber and Gut Health',
    category: 'nutrition',
    summary: 'Why fiber matters for fitness and overall health.',
    content: JSON.stringify({
      recommended: '25-35g per day for most adults',
      types: { soluble: 'Oats, beans, fruits — slows digestion', insoluble: 'Vegetables, whole grains — adds bulk' },
      benefits: ['Improved digestion and bowel regularity', 'Better blood sugar control', 'Increased satiety (helps fat loss)', 'Supports gut microbiome health'],
      tips: ['Increase fiber gradually to avoid bloating', 'Drink plenty of water with high fiber', 'Vegetables are the best source']
    }),
    tags: ['fiber', 'gut-health', 'nutrition', 'digestion'],
    difficulty: 'beginner',
  },
  {
    title: 'Alcohol and Fitness',
    category: 'nutrition',
    summary: 'How alcohol affects training, recovery, and body composition.',
    content: JSON.stringify({
      calorie_content: '7 calories per gram (more than protein/carbs, less than fat)',
      effects: ['Impairs muscle protein synthesis', 'Disrupts sleep quality', 'Increases cortisol', 'Reduces testosterone', 'Dehydrates the body', 'Impairs recovery'],
      guidelines: ['Limit to 1-2 drinks per week for best results', 'Avoid alcohol within 4 hours of sleep', 'Increase water intake when drinking', 'Account for calories in your daily total'],
      tips: ['Zero alcohol is optimal for fitness', 'If you drink, prioritize quality over quantity', 'Spirits with soda water is lowest calorie']
    }),
    tags: ['alcohol', 'recovery', 'nutrition', 'body-composition'],
    difficulty: 'beginner',
  },
  {
    title: 'Anti-Inflammatory Foods',
    category: 'nutrition',
    summary: 'Foods that reduce inflammation and support recovery.',
    content: JSON.stringify({
      top_anti_inflammatory_foods: ['Fatty fish (salmon, mackerel) — omega-3s', 'Berries — antioxidants', 'Leafy greens — vitamins and minerals', 'Turmeric — curcumin', 'Extra virgin olive oil — polyphenols', 'Nuts — healthy fats', 'Green tea — catechins'],
      inflammatory_foods_to_limit: ['Processed sugar', 'Fried foods', 'Processed meats', 'Excessive alcohol', 'Refined carbohydrates'],
      tips: ['Eat the rainbow — colorful foods are anti-inflammatory', 'Omega-3 to omega-6 ratio matters', 'Whole foods over supplements']
    }),
    tags: ['anti-inflammatory', 'recovery', 'nutrition', 'inflammation'],
    difficulty: 'beginner',
  },
  {
    title: 'Vegan and Vegetarian Nutrition for Lifters',
    category: 'nutrition',
    summary: 'How to meet all nutritional needs on a plant-based diet while lifting.',
    content: JSON.stringify({
      protein_sources: ['Tofu and tempeh', 'Lentils and beans', 'Seitan (wheat protein)', 'Plant-based protein powders (pea, rice, soy)', 'Quinoa', 'Edamame'],
      protein_combining: 'Combine rice + pea protein for complete amino acid profile',
      key_nutrients: { b12: 'Supplement (critical)', iron: 'Pair with vitamin C for absorption', omega3: 'Algae-based EPA/DHA supplement', creatine: 'Supplement 5g/day (plant foods lack creatine)', zinc: 'Pumpkin seeds, fortified foods' },
      tips: ['Protein targets are the same (1.6-2.2g/kg)', 'May need slightly more total protein due to lower bioavailability', 'Creatine supplementation is especially important for vegans']
    }),
    tags: ['vegan', 'vegetarian', 'plant-based', 'nutrition', 'protein'],
    difficulty: 'intermediate',
  },
  {
    title: 'Carb Cycling for Body Composition',
    category: 'nutrition',
    summary: 'How to strategically vary carb intake for fat loss and performance.',
    content: JSON.stringify({
      overview: 'Carb cycling alternates high and low carb days to optimize fat loss and training performance.',
      high_carb_days: 'Training days — fuel workouts, support recovery (4-6g/kg)',
      low_carb_days: 'Rest days — promote fat oxidation (2-3g/kg)',
      protein: 'Stays constant every day (2.0-2.4g/kg)',
      fat: 'Higher on low carb days, lower on high carb days',
      tips: ['Most useful during a cutting phase', 'Not necessary for beginners', 'Protein and total calories matter more than carb timing']
    }),
    tags: ['carb-cycling', 'fat-loss', 'nutrition', 'bodybuilding'],
    difficulty: 'intermediate',
  },
  {
    title: 'Micronutrients for Athletes',
    category: 'nutrition',
    summary: 'Key vitamins and minerals for training performance and recovery.',
    content: JSON.stringify({
      key_micronutrients: {
        vitamin_d: '2000-5000 IU/day — most people are deficient. Supports bone health and testosterone.',
        magnesium: '200-400mg before bed — supports sleep, muscle function, and recovery.',
        zinc: '15-30mg/day — supports testosterone and immune function.',
        iron: 'Critical for oxygen transport. Higher needs for female athletes.',
        calcium: '1000mg/day — bone health, muscle contraction.',
        sodium: 'Don\'t fear salt — athletes need more than sedentary people.'
      },
      tips: ['Get blood work done annually', 'Food first, supplements second', 'Vitamin D and magnesium are the most commonly deficient']
    }),
    tags: ['micronutrients', 'vitamins', 'minerals', 'nutrition', 'health'],
    difficulty: 'intermediate',
  },
  {
    title: 'Intermittent Fasting for Lifters',
    category: 'nutrition',
    summary: 'The evidence on intermittent fasting for muscle and fat loss.',
    content: JSON.stringify({
      overview: 'IF restricts eating to a specific window (typically 8 hours).',
      common_methods: ['16:8 (16 hours fasting, 8 hours eating)', 'OMAD (one meal a day)', '5:2 (normal eating 5 days, restricted 2 days)'],
      benefits: ['May help with calorie adherence', 'Convenience (fewer meals to prep)', 'Some evidence for insulin sensitivity'],
      drawbacks: ['Harder to hit protein targets in fewer meals', 'May impair training performance', 'No metabolic magic beyond calorie deficit'],
      tips: ['If it helps you stick to calories, it works', 'Prioritize protein in each meal', 'Train fasted only if performance is not affected']
    }),
    tags: ['intermittent-fasting', 'if', 'nutrition', 'fat-loss'],
    difficulty: 'intermediate',
  },
  {
    title: 'Reading Food Labels',
    category: 'nutrition',
    summary: 'How to read and interpret nutrition labels for better food choices.',
    content: JSON.stringify({
      key_sections: ['Serving size (everything else is per this amount)', 'Calories (energy content)', 'Protein (aim for high per serving)', 'Added sugars (minimize)', 'Fiber (aim for high)', 'Ingredient list (first item is most abundant)'],
      red_flags: ['Long ingredient lists with unrecognizable items', 'High added sugar', 'Low protein per calorie', '"Low fat" products with added sugar'],
      tips: ['Weigh food for accurate tracking', 'Compare protein-to-calorie ratio', 'Don\'t trust marketing claims — read the label']
    }),
    tags: ['food-labels', 'nutrition', 'tracking', 'diet'],
    difficulty: 'beginner',
  },
  {
    title: 'Weight Loss Plateaus',
    category: 'nutrition',
    summary: 'Why weight loss stalls and how to break through plateaus.',
    content: JSON.stringify({
      common_causes: ['Metabolic adaptation (TDEE decreases with weight loss)', 'Inconsistent tracking', 'Increased NEAT compensation', 'Water retention masking fat loss', 'Overestimating calorie burn from exercise'],
      solutions: ['Recalculate TDEE at new weight', 'Add a diet break (1-2 weeks at maintenance)', 'Increase NEAT (steps, daily movement)', 'Double-check portion sizes', 'Be patient — true plateaus are rare'],
      tips: ['Weight loss is not linear — expect fluctuations', 'Look at weekly averages, not daily weigh-ins', 'If TDEE is accurate and you\'re in a deficit, fat IS being lost']
    }),
    tags: ['weight-loss', 'plateau', 'nutrition', 'fat-loss'],
    difficulty: 'intermediate',
  },
  {
    title: 'Meal Prep for Gains',
    category: 'nutrition',
    summary: 'Efficient meal prep strategies for hitting your nutrition targets.',
    content: JSON.stringify({
      overview: 'Meal prep eliminates decision fatigue and ensures consistent nutrition.',
      steps: ['Pick 2-3 protein sources and cook in bulk', 'Prepare 2-3 carb sources (rice, potatoes, oats)', 'Wash and chop vegetables for the week', 'Portion into containers by meal', 'Prep snacks (nuts, yogurt, protein bars)'],
      batch_cooking_tips: ['Cook chicken in bulk (bake, grill, or slow cooker)', 'Use a rice cooker for easy carb prep', 'Slow cooker or Instant Pot saves time', 'Prep 3-4 days at a time for freshness'],
      tips: ['Keep it simple — 4-5 meals repeated', 'Invest in good containers', 'Freeze extra portions for later in the week']
    }),
    tags: ['meal-prep', 'nutrition', 'meal-planning', 'consistency'],
    difficulty: 'beginner',
  },
];

const RECOVERY_ARTICLES: ArticleData[] = [
  {
    title: 'Sleep for Recovery',
    category: 'recovery',
    summary: 'Why sleep is the most important recovery tool.',
    content: JSON.stringify({
      optimal: '7-9 hours per night',
      why: 'Growth hormone is released during sleep. Muscle tissue is repaired. Cortisol is managed.',
      effects_of_poor_sleep: ['Increased cortisol', 'Impaired glycogen replenishment', 'Reduced training performance', 'Increased injury risk', 'Poor cognitive function'],
      sleep_hygiene: ['Consistent sleep schedule', 'Cool room (65-68°F / 18-20°C)', 'No screens 1 hour before bed', 'Limit caffeine after 2pm', 'Dark, quiet environment'],
      tips: ['Track sleep quality with wearables', 'A pre-sleep routine helps signal your body', 'Naps of 20-30 min can supplement nighttime sleep']
    }),
    tags: ['sleep', 'recovery', 'growth-hormone', 'fatigue'],
    difficulty: 'beginner',
  },
  {
    title: 'Deload Weeks',
    category: 'recovery',
    summary: 'When and how to deload for long-term progress.',
    content: JSON.stringify({
      why: 'Accumulated fatigue masks fitness gains. Joints and nervous system need recovery.',
      when: ['Every 4-8 weeks of consistent training', 'After competition or max test', 'When progress stalls', 'When feeling consistently fatigued'],
      methods: [
        'Volume reduction (recommended): keep weight, reduce sets by 50-60%',
        'Intensity reduction: keep sets, reduce weight by 20-30%',
        'Frequency reduction: fewer sessions per week'
      ],
      duration: '5-7 days is standard. 10-14 days for extreme fatigue.',
      tips: ['Trust the process — deloading takes discipline', 'Don\'t wait until overtrained', 'After deload, strength should bounce back or exceed previous']
    }),
    tags: ['deload', 'recovery', 'rest', 'programming', 'fatigue'],
    difficulty: 'intermediate',
  },
  {
    title: 'Mobility for Lifters',
    category: 'recovery',
    summary: 'Why mobility matters and how to improve it.',
    content: JSON.stringify({
      overview: 'Mobility is the ability to move through a full range of motion with control.',
      key_limiters: ['Ankle mobility (squat depth)', 'Hip mobility (squat and deadlift)', 'Thoracic spine (overhead press)', 'Shoulder mobility (bench and overhead)'],
      daily_routine: ['90/90 hip stretch: 2 min each side', 'Couch stretch: 2 min each side', 'Ankle dorsiflexion: 10 reps each', 'T-spine rotations: 10 reps each', 'Band shoulder dislocates: 10 reps'],
      tips: ['5 minutes daily beats 30 minutes once a week', 'Static stretching after training, dynamic before', 'Expect 4-8 weeks for meaningful change']
    }),
    tags: ['mobility', 'flexibility', 'stretching', 'injury-prevention'],
    difficulty: 'beginner',
  },
  {
    title: 'Foam Rolling and Self-Myofascial Release',
    category: 'recovery',
    summary: 'How to use foam rolling for recovery and flexibility.',
    content: JSON.stringify({
      benefits: ['Improved blood flow to muscles', 'Reduced muscle soreness (DOMS)', 'Temporary increase in range of motion', 'Myofascial release of trigger points'],
      technique: 'Roll slowly over target area, 30-60 seconds per muscle group. Pause on tender spots.',
      when: 'Before warm-up or after training. Avoid rolling cold muscles.',
      focus_areas: ['Quads and IT band', 'Hamstrings and glutes', 'Upper back (thoracic)', 'Calves', 'Lats'],
      tips: ['Breathe through tender spots', 'Don\'t roll joints or bones', 'Use a lacrosse ball for smaller areas', 'Consistency matters more than duration']
    }),
    tags: ['foam-rolling', 'recovery', 'flexibility', 'soreness'],
    difficulty: 'beginner',
  },
  {
    title: 'Common Injuries and Prevention',
    category: 'recovery',
    summary: 'How to prevent and manage common weightlifting injuries.',
    content: JSON.stringify({
      injuries: {
        lower_back: { causes: 'Poor form, excessive volume, weak core', prevention: 'Brace properly, strengthen glutes, McGill big 3', management: 'Avoid flexion, work on hip hinge' },
        shoulder: { causes: 'Flared elbows, poor scapular control', prevention: 'Face pulls, external rotations, proper scapular retraction', management: 'Avoid painful ranges, strengthen rotator cuff' },
        knee: { causes: 'Knee cave, excessive volume, poor ankle mobility', prevention: 'Keep knees tracking toes, strengthen glute med', management: 'Reduce depth, quad and glute strengthening' },
        elbow: { causes: 'Excessive pulling or pressing volume', prevention: 'Wrist strengthening, manage volume', management: 'Eccentric wrist work, reduce aggravating exercises' }
      },
      when_to_see_professional: ['Pain lasting more than 2 weeks', 'Sharp pain vs dull ache', 'Pain affecting daily activities', 'Swelling or loss of function'],
      tips: ['Warm up properly', 'Progress volume gradually (10% rule)', 'Listen to your body — soreness vs pain', 'Deload regularly']
    }),
    tags: ['injury', 'prevention', 'rehab', 'pain', 'safety'],
    difficulty: 'intermediate',
  },
  {
    title: 'Stretching for Lifters',
    category: 'recovery',
    summary: 'A practical guide to stretching for improved performance.',
    content: JSON.stringify({
      when_to_stretch: {
        pre_workout: 'Dynamic stretching only (leg swings, arm circles, world greatest stretch)',
        post_workout: 'Static stretching (30-60 second holds)',
        between_days: 'Full stretching routines'
      },
      post_chest: ['Pec stretch in doorway: 60s each side', 'Shoulder extension: 60s each side'],
      post_legs: ['Quad stretch: 60s each', 'Hamstring stretch: 60s each', 'Hip flexor (couch stretch): 2 min each'],
      post_back: ['Lat stretch hanging: 60s', 'Cat/cow: 10 reps', 'Child\'s pose: 2 min'],
      tips: ['Never cold-static stretch before heavy lifting', 'Static stretching does not prevent soreness', 'Tightness is often weakness — strengthen through range']
    }),
    tags: ['stretching', 'flexibility', 'mobility', 'recovery'],
    difficulty: 'beginner',
  },
];

const MOTIVATION_ARTICLES: ArticleData[] = [
  {
    title: 'Building Fitness Habits',
    category: 'motivation',
    summary: 'How to build lasting fitness habits using behavioral psychology.',
    content: JSON.stringify({
      habit_loop: 'Cue → Routine → Reward. Design your environment to support each step.',
      habit_stacking: 'Attach new habits to existing ones. Example: "After I pour my morning coffee, I put on gym clothes."',
      commitment_devices: [
        'Schedule workouts like appointments',
        'Find an accountability partner',
        'Track streaks — don\'t break the chain',
        'Lay out gym clothes the night before'
      ],
      the_2_minute_rule: 'Make the habit so easy you can\'t say no. 2 minutes of exercise beats 0.',
      tips: ['Start with one habit at a time', 'Miss once, never miss twice', 'Celebrate small wins', 'Identity-based habits: "I am someone who works out"']
    }),
    tags: ['habits', 'behavioral-psychology', 'consistency', 'accountability'],
    difficulty: 'beginner',
  },
  {
    title: 'Goal Setting for Fitness',
    category: 'motivation',
    summary: 'Set effective fitness goals using the SMART framework.',
    content: JSON.stringify({
      smart: 'Specific, Measurable, Achievable, Relevant, Time-bound',
      examples: [
        'Good: "Squat 100kg for 5 reps by December"',
        'Good: "Lose 4kg in 8 weeks while maintaining strength"',
        'Bad: "Get strong"', 'Bad: "Lose weight"'
      ],
      goal_types: [
        'Performance goals: specific strength or skill targets',
        'Body composition goals: weight, body fat percentage',
        'Process goals: habits like "train 4x/week"',
        'Outcome goals: competition placement, transformation'
      ],
      tips: ['Focus on process goals (controllable)', 'Set outcome goals as direction, not stress', 'Reassess goals every 4-8 weeks', 'Celebrate milestones along the way']
    }),
    tags: ['goals', 'motivation', 'planning', 'mindset'],
    difficulty: 'beginner',
  },
  {
    title: 'Overcoming Mental Barriers',
    category: 'motivation',
    summary: 'Strategies for pushing through mental blocks in training.',
    content: JSON.stringify({
      common_barriers: [
        'Fear of heavy weights → use progressive loading and submaximal work',
        'Fear of failure → reframe as data collection, not personal failure',
        'Perfectionism → consistency beats perfection',
        'Comparison trap → focus on your own progress',
        'Motivation drought → rely on discipline and systems'
      ],
      mental_techniques: [
        'Visualization: mentally rehearse successful lifts',
        'Self-talk: use positive, directive language',
        'Chunking: break big goals into small daily actions',
        'Implementation intentions: "When X happens, I will do Y"'
      ],
      tips: ['Motivation follows action, not the other way around', 'Discipline is a muscle — train it', 'Set your environment up for success']
    }),
    tags: ['mental-barriers', 'mindset', 'motivation', 'resilience'],
    difficulty: 'beginner',
  },
];

const ALL_ARTICLES: ArticleData[] = [
  ...FORM_ARTICLES,
  ...TRAINING_ARTICLES,
  ...NUTRITION_ARTICLES,
  ...RECOVERY_ARTICLES,
  ...MOTIVATION_ARTICLES,
];

export function seedKnowledge(db: DB): void {
  const count = db.getFirstSync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM knowledge_articles'
  );
  if ((count?.cnt ?? 0) > 0) return;

  db.withTransactionSync(() => {
    for (const article of ALL_ARTICLES) {
      insertRow(db, 'knowledge_articles', {
        title: article.title,
        category: article.category,
        summary: article.summary,
        content: article.content,
        tags: JSON.stringify(article.tags),
        difficulty: article.difficulty,
        evidence_level: article.evidence_level || null,
        related_topics: '[]',
        references_: '[]',
      });
    }
  });
}

export function getArticleCount(): number {
  return ALL_ARTICLES.length;
}

export function getArticlesByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const article of ALL_ARTICLES) {
    counts[article.category] = (counts[article.category] || 0) + 1;
  }
  return counts;
}
