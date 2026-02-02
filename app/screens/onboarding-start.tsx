import { View, Text, Pressable, ImageBackground } from 'react-native';
import ThemedText from '@/components/ThemedText';
import { router } from 'expo-router';
import React from 'react';
import Icon from '@/components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



export default function OnboardingScreen() {

    const insets = useSafeAreaInsets();

    return (
        <View className='flex-1 bg-background'>
            <ImageBackground
                source={require('@/assets/img/onboarding.jpg')}
                className='w-full h-full absolute top-0 left-0'
            >

                <View className="flex-1 relative items-start justify-end p-global">

                    <Text className='text-white text-4xl font-bold'>Welcome, Miguel</Text>
                    <ThemedText className='text-white text-lg text-left pr-20'>We are excited to have you on board. Let's set up your account.</ThemedText>
                    <Pressable
                        onPress={() => router.push('/screens/onboarding')}
                        className='w-full mt-10 bg-highlight rounded-full flex flex-row items-center justify-center py-4'
                    >
                        <Text className='text-white text-lg font-semibold mr-4'>Let's get started</Text>
                        <Icon name="ArrowRight" size={20} color="white" />
                    </Pressable>

                </View>
                {/* Login/Signup Buttons */}
                <View style={{ bottom: insets.bottom }} className="px-6 mb-6">
                    <View className='flex flex-row items-center justify-center gap-2'>



                    </View>
                </View>

            </ImageBackground>
        </View>
    );
}
