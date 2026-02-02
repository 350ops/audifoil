import React, { useState } from 'react';
import { View, Alert, ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { Link, router } from 'expo-router';
import Input from '@/components/forms/Input';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shadowPresets } from '@/utils/useShadow';
import AnimatedView from '@/components/AnimatedView';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
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

  const handleResetPassword = () => {
    const isEmailValid = validateEmail(email);

    if (isEmailValid) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // Show success message
        Alert.alert(
          "Password Reset Link Sent",
          "We've sent a password reset link to your email address. Please check your inbox.",
          [
            { text: "OK", onPress: () => router.back() }
          ]
        );
      }, 1500);
    }
  };

  return (
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
            <Text className="text-4xl text-center font-outfit-bold text-black">Reset your password</Text>
            <Text className="text-sm text-center opacity-50 mt-2 text-black">Enter your email to receive a reset link</Text>
          </View>
          <View className="bg-background p-global rounded-3xl bg-secondary" style={{ paddingBottom: insets.bottom + 20, ...shadowPresets.large }}>
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

            <Button
              title="Send Reset Link"
              onPress={handleResetPassword}
              loading={isLoading}
              size="large"
              className="mb-4 !bg-highlight"
              rounded="full"
              textClassName='!text-white'
            />

            <Link className='underline text-center text-text text-sm mb-4' href="/screens/login">
              Back to Login
            </Link>
          </View>
        </AnimatedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}