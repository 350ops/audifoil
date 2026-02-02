import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import { useTranslation } from '@/hooks/useTranslation';

export default function NotificationPermissionScreen() {
  const { t } = useTranslation();

  const handleSkip = () => {
    router.replace('/screens/location-permission');
  };

  return (
    <View className="flex-1 bg-background dark:bg-dark-primary p-6">
      <View className="flex-1 items-center justify-center px-10">
        <View className='w-24 h-24 bg-highlight rounded-2xl items-center justify-center mb-8'>
          <Icon name="BellDot" size={44} strokeWidth={2} color="white" />
        </View>
        <ThemedText className="text-4xl font-bold text-center mb-2 mt-8">
          {t('notificationPermission.title')}
        </ThemedText>
        <ThemedText className="text-light-subtext dark:text-dark-subtext text-center mb-12">
          {t('notificationPermission.description')}
        </ThemedText>
      </View>

      <View className="gap-1">
        <Button
          title={t('notificationPermission.allow')}
          size="large"
          className='!bg-highlight'
          textClassName='!text-white'
          rounded='full'
          onPress={handleSkip}
        />
        <Button
          title={t('notificationPermission.skip')}
          onPress={handleSkip}
          variant="ghost"
          size="large"
        />
      </View>
    </View>
  );
}