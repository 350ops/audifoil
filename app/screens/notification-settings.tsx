import { View } from "react-native";
import Header from "@/components/Header";
import ThemedScroller from "@/components/ThemeScroller";
import Section from "@/components/layout/Section";
import Switch from "@/components/forms/Switch";
import { useState } from "react";
import { useTranslation } from '@/hooks/useTranslation';

export default function NotificationSettingsScreen() {
    const [reminders, setReminders] = useState(true);
    const [sync, setSync] = useState(true);
    const [dailySummary, setDailySummary] = useState(true);
    const [pinnedNotes, setPinnedNotes] = useState(true);
    const [suggestions, setSuggestions] = useState(false);
    const [updates, setUpdates] = useState(true);
    const { t } = useTranslation();
    return (
        <>
            <Header showBackButton />
            <ThemedScroller className="p-global">
                <Section title={t('settings.notifications')} titleSize="4xl" className="mt-4 mb-10" />
                <View className="bg-secondary rounded-3xl">
                    <Switch className="py-4 px-4 border-b border-border" label={t('settings.noteReminders')} description={t('settings.noteRemindersDesc')} icon="Bell" value={reminders} onChange={setReminders} />
                    <Switch className="py-4 px-4 border-b border-border" label={t('settings.syncNotifications')} description={t('settings.syncNotificationsDesc')} icon="RefreshCw" value={sync} onChange={setSync} />
                    <Switch className="py-4 px-4 border-b border-border" label={t('settings.dailySummary')} description={t('settings.dailySummaryDesc')} icon="Calendar" value={dailySummary} onChange={setDailySummary} />
                    <Switch className="py-4 px-4 border-b border-border" label={t('settings.pinnedNotes')} description={t('settings.pinnedNotesDesc')} icon="Pin" value={pinnedNotes} onChange={setPinnedNotes} />
                    <Switch className="py-4 px-4 border-b border-border" label={t('settings.smartSuggestions')} description={t('settings.smartSuggestionsDesc')} icon="Lightbulb" value={suggestions} onChange={setSuggestions} />
                    <Switch className="py-4 px-4" label={t('settings.appUpdates')} description={t('settings.appUpdatesDesc')} icon="Sparkles" value={updates} onChange={setUpdates} />
                </View>
            </ThemedScroller>
        </>
    )
}

