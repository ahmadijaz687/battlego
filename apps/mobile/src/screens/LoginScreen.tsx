import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, motion } from '../theme';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { PasswordField } from '../components/PasswordField';
import { Ionicons } from '@expo/vector-icons';
import { signInWithProvider, SocialProvider } from '../services/socialAuth';
import { socialLogin } from '../services/authService';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { login: loginStore } = useAuthStore();
  const loginMutation = useLogin();
  const [demoLoading, setDemoLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: SocialProvider) => {
    setSocialLoading(provider);
    setApiError(null);
    try {
      const firebaseUser = await signInWithProvider(provider);
      const data = await socialLogin(provider, firebaseUser.idToken);
      loginStore(data.user);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Social login failed';
      setApiError(message);
    } finally {
      setSocialLoading(null);
    }
  };

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      const response = await loginMutation.mutateAsync({ email: data.email, password: data.password });
      loginStore(response.user);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setApiError(message);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setApiError(null);
    try {
      const response = await loginMutation.mutateAsync({
        email: __DEV__ ? 'demo@fitbattle.com' : '',
        password: __DEV__ ? 'Password123!' : '',
      });
      loginStore(response.user);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setApiError(message);
    } finally {
      setDemoLoading(false);
    }
  };

  const socialButtons: { key: SocialProvider; label: string; icon: React.ReactNode }[] = [
    { key: 'google', label: 'Google', icon: <Ionicons name="logo-google" size={24} color={colors.textPrimary} /> },
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
          <View style={styles.logoHero}>
            <View style={styles.logoTile}>
              <Text style={styles.logoText}>FB</Text>
            </View>
            <Text style={styles.brand}>FITNESS BATTLE</Text>
          </View>

          {apiError && (
            <View style={styles.apiError}>
              <Text style={styles.apiErrorText}>{apiError}</Text>
            </View>
          )}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
                accessibilityLabel="Email input"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordField
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                accessibilityLabel="Password input"
              />
            )}
          />

          <Pressable
            onPress={() => {}}
            accessibilityRole="link"
            accessibilityLabel="Forgot Password?"
            style={styles.forgotWrap}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>

          <Button title="Sign In" variant="primary" fullWidth loading={isSubmitting} onPress={handleSubmit(onSubmit)} />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            {socialButtons.map((s) => (
              <Pressable
                key={s.key}
                style={[styles.socialBtn, socialLoading === s.key && styles.socialBtnLoading]}
                accessibilityRole="button"
                accessibilityLabel={`Continue with ${s.label}`}
                disabled={socialLoading !== null}
                onPress={() => handleSocialLogin(s.key)}
              >
                {socialLoading === s.key ? (
                  <Ionicons name="reload" size={22} color={colors.textMuted} />
                ) : (
                  s.icon
                )}
              </Pressable>
            ))}
          </View>

          {__DEV__ && (
            <Button title="Use Demo Account" variant="outline" fullWidth loading={demoLoading} disabled={isSubmitting} onPress={handleDemoLogin} style={styles.demoButton} />
          )}

          <Pressable
            onPress={() => navigation.navigate('Register')}
            accessibilityRole="link"
            accessibilityLabel="Create Account"
            style={styles.signupWrap}
          >
            <Text style={styles.signupText}>Don't have an account? <Text style={styles.signupLink}>Sign Up</Text></Text>
          </Pressable>
        </Animated.View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.md,
  },
  logoHero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoTile: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: spacing.sm,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  brand: { ...typography.overline, color: colors.textSecondary, letterSpacing: 4 },
  demoButton: { marginTop: spacing.sm },
  forgotWrap: { alignSelf: 'flex-end', marginBottom: spacing.md, marginTop: spacing.xs },
  forgotText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginVertical: spacing.md },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md, marginBottom: spacing.md },
  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnLoading: {
    opacity: 0.6,
  },
  signupWrap: { alignItems: 'center', marginTop: spacing.md },
  signupText: { color: colors.textSecondary, fontSize: 14 },
  signupLink: { color: colors.primary, fontWeight: '700' },
  apiError: {
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  apiErrorText: { color: colors.error, fontSize: 14, textAlign: 'center' },
});
