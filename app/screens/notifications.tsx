import { View, Pressable } from 'react-native';
import React from 'react';
import Header from '@/components/Header';
import ThemedScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';
import Icon, { IconName } from '@/components/Icon';
import useThemeColors from '@/contexts/ThemeColors';
import { useTranslation } from '@/hooks/useTranslation';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/Button';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: IconName;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: 'Reminder',
    message: 'Don\'t forget to review "Shopping List"',
    time: '5 min ago',
    read: false,
    icon: 'Bell',
  },
  {
    id: 2,
    title: 'Note Updated',
    message: 'Your note "Project Ideas" was synced',
    time: '1 hour ago',
    read: false,
    icon: 'RefreshCw',
  },
  {
    id: 3,
    title: 'Backup Complete',
    message: 'All your notes have been backed up',
    time: '3 hours ago',
    read: true,
    icon: 'Cloud',
  },
  {
    id: 4,
    title: 'New Feature',
    message: 'You can now add images to your notes!',
    time: '1 day ago',
    read: true,
    icon: 'Sparkles',
  },
  {
    id: 5,
    title: 'Reminder',
    message: 'Check your pinned note "Vacation Plans"',
    time: '2 days ago',
    read: true,
    icon: 'Pin',
  },
];

export default function NotificationsScreen() {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const {
    permissionStatus,
    expoPushToken,
    isLoading,
    isExpoGoAndroid,
    requestPermissions,
    sendTestNotification,
  } = useNotifications();

  const handleEnableNotifications = async () => {
    await requestPermissions();
  };

  const handleTestNotification = async () => {
    await sendTestNotification();
  };

  return (
    <>
      <Header showBackButton title={t('notifications.title')} />
      <ThemedScroller>
        {/* Permission & Test Section */}
        <View className="bg-secondary rounded-2xl p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
              isExpoGoAndroid ? 'bg-orange-500' : permissionStatus === 'granted' ? 'bg-green-500' : 'bg-highlight'
            }`}>
              <Icon
                name={isExpoGoAndroid ? 'AlertTriangle' : permissionStatus === 'granted' ? 'Check' : 'Bell'}
                size={18}
                color="#fff"
              />
            </View>
            <View className="flex-1">
              <ThemedText className="font-semibold">
                {isExpoGoAndroid
                  ? 'Expo Go Limitation'
                  : permissionStatus === 'granted'
                    ? 'Notifications Enabled'
                    : 'Enable Notifications'}
              </ThemedText>
              <ThemedText className="text-xs opacity-50">
                {isExpoGoAndroid
                  ? 'Notifications require a development build'
                  : permissionStatus === 'granted'
                    ? 'You will receive push notifications'
                    : 'Allow notifications to stay updated'}
              </ThemedText>
            </View>
          </View>

          {isExpoGoAndroid ? (
            <Button
              title="Test Notification (Demo)"
              onPress={handleTestNotification}
              rounded="full"
              variant="outline"
            />
          ) : permissionStatus !== 'granted' ? (
            <Button
              title="Enable Notifications"
              onPress={handleEnableNotifications}
              loading={isLoading}
              rounded="full"
              className="!bg-highlight"
              textClassName="!text-white"
            />
          ) : (
            <Button
              title="Send Test Notification"
              onPress={handleTestNotification}
              rounded="full"
              variant="outline"
            />
          )}

          {expoPushToken && (
            <Pressable
              onPress={() => console.log('Push Token:', expoPushToken)}
              className="mt-3"
            >
              <ThemedText className="text-xs opacity-40 text-center">
                Push token registered
              </ThemedText>
            </Pressable>
          )}
        </View>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <View
              key={notification.id}
              className={`flex-row items-start p-4 mb-2 rounded-2xl ${
                notification.read ? 'bg-secondary' : 'bg-secondary'
              }`}
            >
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  notification.read ? 'bg-background' : 'bg-highlight'
                }`}
              >
                <Icon
                  name={notification.icon}
                  size={18}
                  color={notification.read ? colors.text : '#fff'}
                />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <ThemedText className="font-semibold">{notification.title}</ThemedText>
                  <ThemedText className="text-xs opacity-50">{notification.time}</ThemedText>
                </View>
                <ThemedText className="text-sm opacity-70 mt-1">
                  {notification.message}
                </ThemedText>
              </View>
              {!notification.read && (
                <View className="w-2 h-2 rounded-full bg-highlight ml-2 mt-2" />
              )}
            </View>
          ))
        ) : (
          <View className="items-center py-20">
            <Icon name="Bell" size={48} color={colors.placeholder} />
            <ThemedText className="text-subtext mt-4">No notifications yet</ThemedText>
          </View>
        )}
      </ThemedScroller>
    </>
  );
}
