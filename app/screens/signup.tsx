import React, { useState } from 'react';
import { View, Pressable, KeyboardAvoidingView, ScrollView, Platform, Text } from 'react-native';
import { Link, router, Stack } from 'expo-router';
import Input from '@/components/forms/Input';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/Button';
import useThemeColors from '@/contexts/ThemeColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { shadowPresets } from '@/utils/useShadow';
import AnimatedView from '@/components/AnimatedView';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthText, setStrengthText] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;

    // Length check - main requirement
    if (password.length >= 8) {
      strength = 100;
      setStrengthText('Good password!');
    } else if (password.length >= 6) {
      strength = 50;
      setStrengthText('At least 8 characters recommended');
    } else {
      strength = 25;
      setStrengthText('At least 6 characters required');
    }

    setPasswordStrength(strength);
    return password.length >= 6;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    checkPasswordStrength(password);
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSignup = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      setIsLoading(true);
      const { error } = await signUp(email, password);
      setIsLoading(false);

      if (error) {
        setEmailError(error.message);
      } else {
        // Navigate to onboarding to complete profile
        router.replace('/screens/onboarding');
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Social login is available on welcome screen
    // Add social buttons here if needed for your UI
    router.push('/screens/welcome');
  };

  return (
    <>
      <Stack.Screen options={{
        headerShown: false,
        animation: 'none',
      }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        className='flex-1 bg-amber-200'
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <AnimatedView animation="slideInBottom" duration={400} className='w-full p-4'>
            <View className='py-14 justify-center px-10' style={{ paddingTop: insets.top + 50}}>
              <Text className="text-4xl text-center font-outfit-bold text-black">Set up your account</Text>
              <Text className="text-sm text-center opacity-50 mt-2 text-black">Create an account to get started</Text>
            </View>
            <View className="bg-background p-global rounded-3xl bg-secondary" style={{ paddingBottom: insets.bottom + 20, ...shadowPresets.large }}>
                  <View className="flex-row gap-4 bg-background border border-border p-1.5 rounded-2xl mb-8">
                    <Link href="/screens/login" asChild>
                      <Pressable className='flex-1 bg-background p-3 rounded-2xl'>
                        <ThemedText className="text-sm text-center">Login</ThemedText>
                      </Pressable>
                    </Link>
                    <Link href="/screens/signup" asChild>
                      <Pressable className='flex-1 bg-text p-3 rounded-xl' style={shadowPresets.small}>
                        <ThemedText className="text-sm !text-invert text-center">Signup</ThemedText>
                      </Pressable>
                    </Link>
                  </View>

                  <Input
                    label="Email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) validateEmail(text);
                    }}
                    error={emailError}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />

                  <Input
                    label="Password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      checkPasswordStrength(text);
                      if (passwordError) validatePassword(text);
                    }}
                    error={passwordError}
                    isPassword={true}
                    autoCapitalize="none"
                  />

                  <Input
                    label="Confirm password"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (confirmPasswordError) validateConfirmPassword(text);
                    }}
                    error={confirmPasswordError}
                    isPassword={true}
                    autoCapitalize="none"
                  />

                  {password.length > 0 && (
                    <View className="mb-4">
                      <View className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                        <View
                          className={`h-full rounded-full ${passwordStrength >= 75 ? 'bg-green-500' : passwordStrength >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </View>
                      <ThemedText className="text-xs mt-1 opacity-50">
                        {strengthText}
                      </ThemedText>
                    </View>
                  )}

                  <Button
                    title="Sign up"
                    onPress={handleSignup}
                    loading={isLoading}
                    size="large"
                    className="mb-4 !bg-highlight"
                    rounded="full"
                    textClassName='!text-white'
                  />

                  <View className="flex-row justify-center">
                    <ThemedText className="text-sm opacity-50">By signing up you agree to our Terms & Conditions</ThemedText>
                  </View>
                </View>
              </AnimatedView>
            </ScrollView>
          </KeyboardAvoidingView>
    </>
  );
}
