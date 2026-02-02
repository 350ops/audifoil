import React, { useState } from 'react';
import { View, Pressable, ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { Stack, Link, router } from 'expo-router';
import Input from '@/components/forms/Input';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { shadowPresets } from '@/utils/useShadow';
import AnimatedView from '@/components/AnimatedView';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);
      const { error } = await signIn(email, password);
      setIsLoading(false);

      if (error) {
        setPasswordError(error.message);
      } else {
        router.replace('/(drawer)/(tabs)/');
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
              <Text className="text-4xl text-center font-outfit-bold text-black">Login to your account</Text>
              <Text className="text-sm text-center opacity-50 mt-2 text-black">Enter your email and password to login</Text>
            </View>
            <View className="bg-background p-global rounded-3xl bg-secondary" style={{ paddingBottom: insets.bottom + 20, ...shadowPresets.large }}>
                  <View className="flex-row gap-4 bg-background border border-border p-1.5 rounded-2xl mb-8">
                    <Link href="/screens/login" asChild>
                      <Pressable className='flex-1 bg-text p-3 rounded-xl' style={shadowPresets.small}>
                        <ThemedText className="text-sm !text-invert text-center">Login</ThemedText>
                      </Pressable>
                    </Link>
                    <Link href="/screens/signup" asChild>
                      <Pressable className='flex-1 bg-background p-3 rounded-2xl'>
                        <ThemedText className="text-sm text-center">Signup</ThemedText>
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
                      if (passwordError) validatePassword(text);
                    }}
                    error={passwordError}
                    isPassword={true}
                    autoCapitalize="none"
                  />
                  <Button
                    title="Login"
                    onPress={handleLogin}
                    loading={isLoading}
                    size="large"
                    className="mb-4 !bg-highlight"
                    rounded="full"
                    textClassName='!text-white'
                  />
                  <Link className='underline text-center text-text text-sm mb-4' href="/screens/forgot-password">
                    Forgot Password?
                  </Link>
                </View>
              </AnimatedView>
            </ScrollView>
          </KeyboardAvoidingView>
    </>
  );
}