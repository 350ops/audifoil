import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system/next';
import { decode } from 'base64-arraybuffer';
import Header from '@/components/Header';
import ThemedScroller from '@/components/ThemeScroller';
import Input from '@/components/forms/Input';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { shadowPresets } from '@/utils/useShadow';

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const { profile, user, updateProfile, isDemoMode } = useAuth();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load profile data when component mounts
  useEffect(() => {
    if (profile) {
      setProfileImage(profile.avatar_url);
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setEmail(profile.email || '');
      setLocation(profile.location || '');
    }
  }, [profile]);

  const uploadImage = async (uri: string) => {
    if (!user) return null;

    // Skip cloud upload in demo mode - just use the local URI
    if (isDemoMode) {
      return uri;
    }

    try {
      // Read file as base64 using new File API
      const file = new File(uri);
      const base64 = await file.base64();

      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/avatar.${fileExt}`;
      const contentType = fileExt === 'png' ? 'image/png' : 'image/jpeg';

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, decode(base64), {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return uri;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return uri;
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      let avatarUrl = profileImage;

      // Upload new image if it's a local file
      if (profileImage && profileImage.startsWith('file://')) {
        avatarUrl = await uploadImage(profileImage);
      }

      const { error } = await updateProfile({
        first_name: firstName,
        last_name: lastName,
        location: location,
        avatar_url: avatarUrl,
      });

      if (error) {
        Alert.alert('Error', 'Failed to save profile. Please try again.');
      } else {
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1 bg-background'
    >
      <Header showBackButton
        title={t('profile.title')}
        rightComponents={[
          <Button
            title={t('common.save')}
            rounded='full'
            onPress={handleSave}
            loading={isSaving}
          />
        ]}
      />
      <ThemedScroller>
        <View className="items-center flex-col mb-8 my-14 rounded-2xl">
          <TouchableOpacity
            onPress={pickImage}
            className="relative"
            activeOpacity={0.9}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-28 h-28 rounded-full"
              />
            ) : (
              <View className="w-28 h-28 rounded-full bg-secondary items-center justify-center">
                <Icon name="Plus" size={25} className="text-light-subtext dark:text-dark-subtext" />
              </View>
            )}
          </TouchableOpacity>
          <View className='mt-4 flex flex-row gap-2'>
            <Button  title={profileImage ? t('profile.changePhoto') : t('profile.uploadPhoto')} rounded='full' onPress={pickImage} />

            {profileImage && (
              <Button
                className='bg-secondary'
                textClassName='text-text'
                title={t('profile.removePhoto')}
                rounded='full'
                onPress={() => setProfileImage(null)}
              />
            )}
          </View>
        </View>
        <View className='px-global pt-10 pb-4 bg-secondary rounded-3xl' style={shadowPresets.large}>
          <Input
            label={t('profile.firstName')}
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
          <Input
            label={t('profile.lastName')}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
          <Input
            label={t('profile.email')}
            keyboardType="email-address"
            value={email}
            autoCapitalize="none"
            editable={false}
            containerClassName='mb-0 opacity-50'
          />
          <Input
            label={t('profile.location')}
            keyboardType="default"
            value={location}
            onChangeText={setLocation}
            autoCapitalize="words"
            containerClassName='mb-0'
          />
        </View>
      </ThemedScroller>
    </KeyboardAvoidingView>
  );
}


