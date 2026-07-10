import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { register } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, motion } from '../theme';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { PasswordField } from '../components/PasswordField';
import { Ionicons } from '@expo/vector-icons';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;
type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { login: loginStore } = useAuthStore();
  const [apiError, setApiError] = useState<string | null>(null);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: motion.duration.normal, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    try {
      const response = await register(data.email, data.password, data.name);
      loginStore(response.user);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      setApiError(message);
    }
  };

  const socialButtons: { key: string; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    { key: 'google', icon: 'logo-google', label: 'Google' },
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
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                placeholder="Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
                accessibilityLabel="Name input"
              />
            )}
          />

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

          <Button title="Create Account" variant="primary" fullWidth loading={isSubmitting} onPress={handleSubmit(onSubmit)} />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            {socialButtons.map((s) => (
              <Pressable
                key={s.key}
                style={styles.socialBtn}
                accessibilityRole="button"
                accessibilityLabel={`Continue with ${s.label}`}
              >
                <Ionicons name={s.icon} size={24} color={colors.textPrimary} />
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={() => navigation.navigate('Login')}
            accessibilityRole="link"
            accessibilityLabel="Already have an account? Login"
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Log In</Text></Text>
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
  loginButton: { alignItems: 'center', marginTop: spacing.md },
  loginText: { color: colors.textSecondary, fontSize: 14 },
  loginLink: { color: colors.primary, fontWeight: '700' },
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
