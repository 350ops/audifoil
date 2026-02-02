import { View } from 'react-native';
import Header from '@/components/Header';
import ListLink from '@/components/ListLink';
import ThemedScroller from '@/components/ThemeScroller';
import React from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import Section from '@/components/layout/Section';
import { useTranslation } from '@/hooks/useTranslation';
export default function SettingsScreen() {
    const { t } = useTranslation();
    return (
        <>
            <Header showBackButton rightComponents={[<ThemeToggle />]} />
            <View className='flex-1'>
                <ThemedScroller className='flex-1 pt-4'>
                    <Section title={t('settings.title')} titleSize="4xl" className=" mt-6 mb-14" />
                    <View className='gap-1 bg-secondary rounded-3xl'>
                        <ListLink className='px-4 py-2 border-b border-border' title={t('settings.notifications')} description={t('settings.notificationsDesc')} showChevron icon="Bell" href="/screens/notification-settings" />
                        <ListLink className='px-4 py-2 border-b border-border' title={t('settings.help')} description={t('settings.helpDesc')} showChevron icon="HelpCircle" href="/screens/help" />
                        <ListLink className='px-4 py-2 border-b border-border' title={t('settings.profile')} description={t('settings.profileDesc')} showChevron icon="Settings" href="/screens/edit-profile" />
                        <ListLink className='px-4 py-2 border-b border-border' title={t('settings.language')} description={t('settings.languageDesc')} showChevron icon="Globe" href="/screens/languages" />
                        <ListLink className='px-4 py-2' title={t('settings.logout')} showChevron description={t('settings.logoutDesc')} icon="LogOut" href="/screens/welcome" />
                    </View>
                </ThemedScroller>
            </View>
        </>
    );
}
