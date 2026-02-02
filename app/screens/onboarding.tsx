import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system/next';
import { decode } from 'base64-arraybuffer';
import MultiStep, { Step } from '@/components/MultiStep';
import ThemedText from '@/components/ThemedText';
import Icon from '@/components/Icon';
import Input from '@/components/forms/Input';
import { Chip } from '@/components/Chip';
import { categories as availableCategories } from '@/mockData';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// Shared state for onboarding data
interface OnboardingData {
  avatarUrl: string | null;
  firstName: string;
  lastName: string;
  location: string;
  selectedCategories: string[];
}

export default function OnboardingScreen() {
  const { user, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shared onboarding data
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    avatarUrl: null,
    firstName: '',
    lastName: '',
    location: '',
    selectedCategories: [],
  });

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };

  const handleComplete = async () => {
    if (!user) {
      router.replace('/screens/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // Update profile
      const { error: profileError } = await updateProfile({
        first_name: onboardingData.firstName,
        last_name: onboardingData.lastName,
        location: onboardingData.location,
        avatar_url: onboardingData.avatarUrl,
      });

      if (profileError) {
        Alert.alert('Error', 'Failed to save profile. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Create selected categories
      if (onboardingData.selectedCategories.length > 0) {
        const categoriesToInsert = onboardingData.selectedCategories.map(name => ({
          user_id: user.id,
          name,
        }));

        const { error: categoriesError } = await supabase
          .from('categories')
          .insert(categoriesToInsert);

        if (categoriesError) {
          console.error('Error creating categories:', categoriesError);
        }
      }

      // Navigate to home
      router.replace('/(drawer)/(tabs)/');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className='flex-1 bg-secondary'>
      <MultiStep
        onComplete={handleComplete}
        onClose={() => router.replace('/(drawer)/(tabs)/')}
      >
        <Step title="Profile Picture">
          <ProfilePicture
            selectedImage={onboardingData.avatarUrl}
            onImageSelected={(url) => updateOnboardingData({ avatarUrl: url })}
          />
        </Step>

        <Step title="Name">
          <NameStep
            firstName={onboardingData.firstName}
            lastName={onboardingData.lastName}
            onFirstNameChange={(val) => updateOnboardingData({ firstName: val })}
            onLastNameChange={(val) => updateOnboardingData({ lastName: val })}
          />
        </Step>

        <Step title="Location">
          <LocationStep
            location={onboardingData.location}
            onLocationChange={(val) => updateOnboardingData({ location: val })}
          />
        </Step>

        <Step title="Categories">
          <CategoriesStep
            selectedCategories={onboardingData.selectedCategories}
            onCategoriesChange={(cats) => updateOnboardingData({ selectedCategories: cats })}
          />
        </Step>
      </MultiStep>
    </View>
  );
}

interface NameStepProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (val: string) => void;
  onLastNameChange: (val: string) => void;
}

const NameStep = ({ firstName, lastName, onFirstNameChange, onLastNameChange }: NameStepProps) => {
  const { t } = useTranslation();

  return (
    <View className='flex-1 px-global justify-center pb-24'>
      <Icon name="User" size={30} className="w-28 h-28 mb-6 rounded-full bg-secondary mx-auto" />
      <ThemedText className='text-center text-3xl font-bold'>{t('onboarding.name')}</ThemedText>
      <ThemedText className='text-center text-base opacity-60 mb-8'>{t('onboarding.nameDesc')}</ThemedText>
      <Input
        placeholder={t('onboarding.firstName')}
        value={firstName}
        onChangeText={onFirstNameChange}
        autoCapitalize="words"
        className="mb-4"
      />
      <Input
        placeholder={t('onboarding.lastName')}
        value={lastName}
        onChangeText={onLastNameChange}
        autoCapitalize="words"
      />
    </View>
  );
};

interface LocationStepProps {
  location: string;
  onLocationChange: (val: string) => void;
}

const LocationStep = ({ location, onLocationChange }: LocationStepProps) => {
  const { t } = useTranslation();

  return (
    <View className='flex-1 px-global justify-center pb-24'>
      <Icon name="MapPin" size={30} className="w-28 h-28 mb-6 rounded-full bg-secondary mx-auto" />
      <ThemedText className='text-center text-3xl font-bold'>{t('onboarding.location')}</ThemedText>
      <ThemedText className='text-center text-base opacity-60 mb-8'>{t('onboarding.locationDesc')}</ThemedText>
      <Input
        placeholder="City, Country"
        value={location}
        onChangeText={onLocationChange}
        autoCapitalize="words"
      />
    </View>
  );
};

interface CategoriesStepProps {
  selectedCategories: string[];
  onCategoriesChange: (cats: string[]) => void;
}

const CategoriesStep = ({ selectedCategories, onCategoriesChange }: CategoriesStepProps) => {
  const { t } = useTranslation();

  const toggleCategory = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onCategoriesChange(updated);
  };

  return (
    <View className='flex-1 px-global justify-center pb-24'>
      <Icon name="Tag" size={30} className="w-28 h-28 mb-6 rounded-full bg-secondary mx-auto" />
      <ThemedText className='text-center text-3xl font-bold'>{t('onboarding.categories')}</ThemedText>
      <ThemedText className='text-center text-base opacity-60 mb-8'>{t('onboarding.categoriesDesc')}</ThemedText>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='flex-row flex-wrap gap-3 justify-center'>
          {availableCategories.map((category) => (
            <Chip
              size='lg'
              key={category}
              label={category}
              isSelected={selectedCategories.includes(category)}
              onPress={() => toggleCategory(category)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

interface ProfilePictureProps {
  selectedImage: string | null;
  onImageSelected: (url: string | null) => void;
}

const ProfilePicture = ({ selectedImage, onImageSelected }: ProfilePictureProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera permissions to take photos!');
      return false;
    }
    return true;
  };

  const uploadImage = async (uri: string) => {
    if (!user) return null;

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

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const localUri = result.assets[0].uri;
      onImageSelected(localUri);
      // Upload in background
      uploadImage(localUri).then(url => {
        if (url && url !== localUri) {
          onImageSelected(url);
        }
      });
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const localUri = result.assets[0].uri;
      onImageSelected(localUri);
      // Upload in background
      uploadImage(localUri).then(url => {
        if (url && url !== localUri) {
          onImageSelected(url);
        }
      });
    }
  };

  return (
    <View className='flex-1 px-global items-center justify-center'>
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} className='w-28 h-28 mx-auto rounded-full border border-border mb-6' />
      ) : (
        <Icon name="Camera" size={30} className="w-28 h-28 mb-6 rounded-full bg-secondary mx-auto" />
      )}
      <ThemedText className='text-center text-3xl font-bold'>{t('onboarding.profilePicture')}</ThemedText>
      <ThemedText className='text-center text-base opacity-60 mb-8'>{t('onboarding.profilePictureDesc')}</ThemedText>

      <View className='items-center pb-24'>
        <View className='flex-row gap-2'>
          <TouchableOpacity onPress={takePhoto} className='bg-secondary rounded-xl px-6 py-3'>
            <View className='flex-row items-center gap-2'>
              <ThemedText className='font-medium'>{t('onboarding.takePhoto')}</ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={pickImageFromGallery} className='bg-secondary rounded-xl px-6 py-3'>
            <View className='flex-row items-center gap-2'>
              <ThemedText className='font-medium'>{t('onboarding.choosePhoto')}</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
