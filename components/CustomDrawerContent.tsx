import { router } from 'expo-router';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import ThemedText from './ThemedText';
import Icon, { IconName } from './Icon';
import Avatar from './Avatar';
import ThemedScroller from './ThemeScroller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActionSheetThemed from './ActionSheetThemed';
import { ActionSheetRef } from 'react-native-actions-sheet';
import React, { useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { useRevenueCat } from '@/contexts/RevenueCatContext';
import { useEfoil } from '@/contexts/EfoilContext';
import ThemeToggle from './ThemeToggle';
import useThemeColors from '@/contexts/ThemeColors';

export default function CustomDrawerContent() {
    const insets = useSafeAreaInsets();
    const switchAccountRef = useRef<ActionSheetRef>(null);
    const colors = useThemeColors();
    const { t } = useTranslation();
    const { profile, signOut } = useAuth();
    const { isProUser } = useRevenueCat();
    const { bookings } = useEfoil();
    const displayName = profile?.first_name || 'Traveler';

    // Get full name for avatar initials
    const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Traveler';
    
    return (
        <>
            <ThemedScroller className="flex-1 !px-8 bg-background" style={{ paddingTop: insets.top }}>
                {/* Brand Header */}
                <View className="flex-row items-center py-6 mb-4">
                    <Icon name="Waves" size={32} color={colors.highlight} />
                    <View className="ml-3">
                        <ThemedText className="text-xl font-bold">foilTribe Adventures</ThemedText>
                        <ThemedText className="text-sm opacity-50">Maldives Experience</ThemedText>
                    </View>
                </View>

                {/* User Profile Section */}
                <View className="mb-6 py-6 border-y border-border flex-row items-center">
                    <Avatar
                        src={profile?.avatar_url || undefined}
                        name={fullName}
                        size="lg"
                    />
                    <View className='ml-3 flex-1'>
                        <View className='flex-row items-center'>
                            <ThemedText className="font-semibold text-lg">{displayName}</ThemedText>
                            {isProUser && (
                                <Text className='text-xs rounded-full bg-highlight text-white px-2 py-1 ml-2'>Pro</Text>
                            )}
                        </View>
                        <ThemedText className="text-sm opacity-50">{profile?.email || 'Guest'}</ThemedText>
                    </View>
                </View>

                {/* Main Navigation */}
                <View className='flex-col pb-4 mb-4 border-b border-border'>
                    <NavItem href="/" icon="Home" label="Home" />
                    <NavItem href="/arrivals" icon="Plane" label="Arrivals" />
                    <NavItem href="/screens/my-bookings" icon="CalendarCheck" label="My Bookings" badge={bookings.length > 0 ? bookings.length : undefined} />
                    <NavItem href="/screens/how-it-works" icon="HelpCircle" label="How It Works" />
                </View>

                {/* Account Section */}
                <View className='flex-col pb-4 mb-4 border-b border-border'>
                    <ThemedText className="text-xs uppercase opacity-40 mb-2 tracking-wider">Account</ThemedText>
                    <NavItem href="/screens/edit-profile" icon="User" label="Profile" />
                    <NavItem href="/screens/settings" icon="Settings" label="Settings" />
                </View>

                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Logout */}
                <View className='mt-4'>
                    <NavItem onPress={() => signOut()} icon="LogOut" label="Sign Out" />
                </View>

                {/* Version */}
                <View className='flex-row justify-center items-center mt-8 mb-4'>
                    <ThemedText className='text-xs opacity-30'>foilTribe Adventures v1.0.0 • Demo Mode</ThemedText>
                </View>
            </ThemedScroller>
            <SwitchAccountDrawer ref={switchAccountRef} />
        </>
    );
}

type NavItemProps = {
    href?: string;
    icon: IconName;
    label: string;
    className?: string;
    description?: string;
    onPress?: () => void;
    badge?: number;
};

export const NavItem = ({ href, icon, label, description, onPress, badge }: NavItemProps) => {
    const colors = useThemeColors();
    return (
        <TouchableOpacity onPress={onPress ? onPress : href ? () => router.push(href) : undefined} className={`flex-row items-center py-3`}>
            <Icon name={icon} size={20} strokeWidth={1.8} className='bg-secondary rounded-full p-3' />
            <View className='flex-1 ml-4'>
                {label &&
                    <ThemedText className="text-lg font-medium">{label}</ThemedText>
                }
                {description &&
                    <ThemedText className='opacity-50 text-xs'>{description}</ThemedText>
                }
            </View>
            {badge !== undefined && badge > 0 && (
                <View 
                    className="w-6 h-6 rounded-full items-center justify-center mr-2"
                    style={{ backgroundColor: colors.highlight }}
                >
                    <Text className="text-white text-xs font-bold">{badge}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};


const SwitchAccountDrawer = React.forwardRef<ActionSheetRef>((props, ref) => {
    return (
        <ActionSheetThemed
            gestureEnabled
            ref={ref}>
            <View className='p-global'>

                <ProfileItem isSelected src={require('@/assets/img/user.jpg')} name='Miguel' label='Madrid, Spain' />
                <ProfileItem name='TZ Studios' label='Business account' />
                <Pressable className='items-center justify-center pt-6 mt-6 border-t border-border'>
                    <ThemedText className='text-lg font-semibold'>Add Account</ThemedText>
                </Pressable>

            </View>
        </ActionSheetThemed>
    );
});

const ProfileItem = (props: any) => {
    return (
        <Pressable className='flex-row items-center  bg-secondary rounded-2xl py-4'>

            <View className='flex-1'>
                <ThemedText className='font-semibold text-xl'>{props.name}</ThemedText>
                <ThemedText className='text-sm'>{props.label}</ThemedText>
            </View>
            <View className='relative mr-4 flex-row items-center'>
                {props.isSelected && <Icon name='Check' color='white' size={14} strokeWidth={2} className=' w-7 mr-2 h-7 bg-highlight rounded-full border-2 border-secondary' />}
                <Avatar bgColor='bg-slate-500' src={props.src} size="sm" name={props.name} className='border border-border' />
            </View>
        </Pressable>
    );
}


