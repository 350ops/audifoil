import { View, Dimensions, Pressable, Text, Alert, Platform, ActivityIndicator, ImageBackground } from 'react-native';
import { useEffect, useCallback, useState, useRef } from 'react';
import ThemedText from '@/components/ThemedText';
import { router } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// LinearGradient removed - using solid black overlay
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { setStatusBarStyle } from 'expo-status-bar';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import ActionSheetThemed from '@/components/ActionSheetThemed';
import { ActionSheetRef } from 'react-native-actions-sheet';
import useThemeColors from '@/contexts/ThemeColors';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';

// Required for Google auth session to complete properly
WebBrowser.maybeCompleteAuthSession();

// Google OAuth Client IDs
const GOOGLE_WEB_CLIENT_ID = '148934629650-hn7qtlsqf3bkp1sfinq1mnnlccdvoafn.apps.googleusercontent.com';
// TODO: Replace with your iOS client ID from Google Cloud Console
const GOOGLE_IOS_CLIENT_ID = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';

const { width, height } = Dimensions.get('window');


export default function OnboardingScreen() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const colors = useThemeColors();
    const { signInWithApple, signInWithGoogleToken, signInAsDemo, session, demoModeAvailable } = useAuth();
    const [isAppleLoading, setIsAppleLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isDemoLoading, setIsDemoLoading] = useState(false);
    const [isAppleAvailable, setIsAppleAvailable] = useState(false);

    // ActionSheet ref for Expo Go limitation message
    const actionSheetRef = useRef<ActionSheetRef>(null);

    // Animation for wave icon
    const waveRotation = useSharedValue(0);

    // Google Auth Hook - use iOS client ID on iOS, web client for others
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: Platform.OS === 'ios' ? GOOGLE_IOS_CLIENT_ID : GOOGLE_WEB_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        webClientId: GOOGLE_WEB_CLIENT_ID,
    });

    // Log the redirect URI for debugging
    useEffect(() => {
        if (request) {
            console.log('Google redirect URI to add to Google Cloud Console:', request.redirectUri);
        }
    }, [request]);

    // Handle Google auth response
    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            if (id_token) {
                setIsGoogleLoading(true);
                signInWithGoogleToken(id_token)
                    .then(({ error }) => {
                        if (error) {
                            Alert.alert('Error', error.message || 'Failed to sign in with Google');
                        }
                    })
                    .finally(() => setIsGoogleLoading(false));
            }
        }
    }, [response]);

    // Check if Apple Sign-in is available
    useEffect(() => {
        if (Platform.OS === 'ios') {
            AppleAuthentication.isAvailableAsync().then(setIsAppleAvailable);
        }
    }, []);

    // Navigate to home when signed in
    useEffect(() => {
        if (session) {
            router.replace('/(drawer)/(tabs)');
        }
    }, [session]);

    const handleAppleSignIn = async () => {
        // Bypass authentication and navigate directly to the app
        router.replace('/(drawer)/(tabs)');
    };

    const handleGoogleSignIn = () => {
        // In demo mode context, show ActionSheet explaining limitation
        if (demoModeAvailable) {
            actionSheetRef.current?.show();
            return;
        }

        promptAsync();
    };

    const handleDemoSignIn = async () => {
        setIsDemoLoading(true);
        const { error } = await signInAsDemo();
        setIsDemoLoading(false);

        if (error) {
            Alert.alert('Error', error.message || 'Failed to start demo');
        } else {
            // Navigate to demo onboarding instead of directly to tabs
            router.replace('/screens/demo-onboarding');
        }
    };

    // Set status bar to light when this screen is focused, restore theme-based style when leaving
    useFocusEffect(
        useCallback(() => {
            setStatusBarStyle('light');
            return () => {
                // When leaving, set status bar based on theme
                setStatusBarStyle(theme === 'dark' ? 'light' : 'dark');
            };
        }, [theme])
    );

    // Wave animation
    useEffect(() => {
        waveRotation.value = withRepeat(
            withTiming(10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const waveAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${waveRotation.value}deg` }],
    }));

    return (
        <View className='flex-1'>
            {/* Background Image */}
            <ImageBackground
                source={require('@/assets/img/dolphin.jpg')}
                className="flex-1"
                resizeMode="cover"
            >
                {/* Black Overlay */}
                <View className="flex-1 bg-black/50">
                    {/* Logo at top */}
                    <View style={{ paddingTop: insets.top + 20 }} className="px-6 flex-row items-center">
                        <Animated.View style={waveAnimatedStyle}>
                            <Icon name="Waves" size={32} color="white" />
                        </Animated.View>
                        <Text className="text-white text-2xl font-bold ml-3">foilTribe Adventures</Text>
                    </View>

                    {/* Main Content - centered */}
                    <View className="flex-1 justify-center px-6">
                        <Text className='text-5xl font-bold text-white w-full leading-tight'>
                            Experience the{'\n'}Maldives
                        </Text>
                        <Text className='text-lg text-white/70 mt-3'>
                            Premium water adventures and luxury experiences in paradise
                        </Text>
                    </View>

                    {/* Buttons at bottom */}
                    <View style={{ paddingBottom: insets.bottom + 24 }} className="px-6">
                        {/* Main CTA */}
                        <Pressable
                            onPress={handleAppleSignIn}
                            className='w-full rounded-2xl flex flex-row items-center justify-center py-4 mb-4'
                            style={{ backgroundColor: colors.highlight }}
                        >
                            <Icon name="Sparkles" size={20} color="white" />
                            <Text className='text-white font-semibold text-lg ml-2'>Explore Experiences</Text>
                        </Pressable>

                        {/* Social Auth Row */}
                        <View className='flex flex-row mb-4 gap-3'>
                            <Pressable
                                onPress={handleGoogleSignIn}
                                disabled={isGoogleLoading || !request}
                                className='flex-1 border border-white/30 rounded-xl flex flex-row items-center justify-center py-4 bg-white/10'
                                style={{ opacity: !request ? 0.5 : 1 }}
                            >
                                {isGoogleLoading ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <>
                                        <AntDesign name="google" size={20} color="white" />
                                        <Text className="text-white ml-2 font-medium">Google</Text>
                                    </>
                                )}
                            </Pressable>
                            {(Platform.OS === 'ios' && isAppleAvailable) && (
                                <Pressable
                                    onPress={handleAppleSignIn}
                                    disabled={isAppleLoading}
                                    className='flex-1 border border-white/30 rounded-xl flex flex-row items-center justify-center py-4 bg-white/10'
                                >
                                    {isAppleLoading ? (
                                        <ActivityIndicator color="white" size="small" />
                                    ) : (
                                        <>
                                            <Icon name="Apple" size={20} color="white" />
                                            <Text className="text-white ml-2 font-medium">Apple</Text>
                                        </>
                                    )}
                                </Pressable>
                            )}
                        </View>

                        {/* Sign In Link */}
                        <View className='flex flex-row items-center justify-center'>
                            <Text className='text-white/60 text-sm'>Already have an account? </Text>
                            <Pressable onPress={() => router.push('/screens/login')}>
                                <Text className='text-white text-sm font-semibold'>Sign In</Text>
                            </Pressable>
                        </View>

                        {/* Demo Mode */}
                        {demoModeAvailable && (
                            <Pressable
                                onPress={handleDemoSignIn}
                                disabled={isDemoLoading}
                                className='mt-4 py-3'
                            >
                                {isDemoLoading ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <Text className='text-white/50 text-sm text-center'>
                                        Try Demo Mode
                                    </Text>
                                )}
                            </Pressable>
                        )}
                    </View>
                </View>
            </ImageBackground>

            {/* ActionSheet for Expo Go limitations */}
            <ActionSheetThemed ref={actionSheetRef} gestureEnabled>
                <View className="px-6 pt-4 pb-4">
                    <View className="items-center mb-6">
                        <View className="w-16 h-16 rounded-full bg-highlight/10 items-center justify-center mb-4">
                            <Icon name="Info" size={32} color={colors.highlight} />
                        </View>
                        <ThemedText className="text-2xl font-bold text-center mb-2">
                            Demo Mode
                        </ThemedText>
                        <ThemedText className="text-center opacity-60 px-4">
                            This is a demo app. Sign in with any method to explore premium Maldives experiences.
                        </ThemedText>
                    </View>

                    <View className="gap-3 mt-4">
                        <Button
                            title="Continue as Guest"
                            onPress={() => {
                                actionSheetRef.current?.hide();
                                handleAppleSignIn();
                            }}
                            className="w-full"
                        />
                        <Button
                            title="Cancel"
                            variant="outline"
                            onPress={() => {
                                actionSheetRef.current?.hide();
                            }}
                            className="w-full"
                        />
                    </View>
                </View>
            </ActionSheetThemed>
        </View>
    );
}
