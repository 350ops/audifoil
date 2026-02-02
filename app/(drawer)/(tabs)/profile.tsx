import { View, Text, Pressable } from 'react-native';
import Header, { HeaderIcon } from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import Avatar from '@/components/Avatar';
import ListLink from '@/components/ListLink';
import AnimatedView from '@/components/AnimatedView';
import ThemedScroller from '@/components/ThemeScroller';
import React from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { shadowPresets } from '@/utils/useShadow';
import Icon from '@/components/Icon';
import { Link } from 'expo-router';

export default function ProfileScreen() {

    return (
        <View className="flex-1 bg-light-primary dark:bg-dark-primary">
            <Header
                leftComponent={<ThemeToggle />}
                rightComponents={[<HeaderIcon icon="ChartBar" href="/screens/analytics" />]} />
            <View className='flex-1 bg-light-primary dark:bg-dark-primary'>
                <ThemedScroller>
                    <AnimatedView className='pt-4' animation='scaleIn'>
                        <View className="flex-row  items-center justify-center mb-4 bg-secondary rounded-3xl p-10">
                            <View className='flex-col items-center w-1/2'>
                                <Avatar src={require('@/assets/img/user.jpg')} size="xxl" />
                                <View className="flex-1 items-center justify-center">
                                    <ThemedText className="text-2xl font-bold">Miguel</ThemedText>
                                    <View className='flex flex-row items-center'>
                                        <ThemedText className='text-sm text-light-subtext dark:text-dark-subtext ml-2'>Madrid, Spain</ThemedText>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <SubscribeCard />
                        <View className='gap-1 bg-secondary rounded-3xl'>
                            <ListLink className='px-4 py-2 border-b border-border' showChevron title="Account settings" icon="Settings" href="/screens/settings" />
                            <ListLink className='px-4 py-2 border-b border-border' showChevron title="Billing" icon="CreditCard" href="/screens/billing" />
                            <ListLink className='px-4 border-b border-border' showChevron title="Edit profile" icon="UserRoundPen" href="/screens/edit-profile" />
                            <ListLink className='px-4 border-b border-border' showChevron title="Get help" icon="HelpCircle" href="/screens/help" />
                            <ListLink className='px-4' showChevron title="Logout" icon="LogOut" href="/screens/welcome" />
                        </View>
                    </AnimatedView>
                </ThemedScroller>


            </View>
        </View>
    );
}


const SubscribeCard = () => {
    return (
        <Link asChild href="/screens/subscription">
            <Pressable className='bg-highlight flex flex-row rounded-3xl mb-4 p-6'>
                <View className='flex-1 pr-6'>
                    <Text className='text-2xl font-outfit-bold text-white'>audiFoil Maldives</Text>
                    <Text className='text-base  text-white'>Unlock exclusive e-foil experiences.</Text>
                </View>
                <Icon name="Sparkles" size={30} color="white" className='w-20 h-20 bg-black/5 border border-border rounded-full' />
            </Pressable>
        </Link>
    );
}
