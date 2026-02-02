import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ActionSheetRef } from 'react-native-actions-sheet';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import useThemeColors from '@/contexts/ThemeColors';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system/next';
import { decode } from 'base64-arraybuffer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardScroller } from '@/components/CardScroller';
import { shadowPresets } from '@/utils/useShadow';
import ActionSheetThemed from '@/components/ActionSheetThemed';
import { useTranslation } from '@/hooks/useTranslation';
import { useNotes } from '@/contexts/NotesContext';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function NoteEditScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const isEditing = !!params.id;
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { user, isDemoMode } = useAuth();
  const { categories, createNote, updateNote, deleteNote, createCategory, getNote } = useNotes();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [image, setImage] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingNote, setIsLoadingNote] = useState(isEditing);

  const categorySheetRef = useRef<ActionSheetRef>(null);

  // Load note data if editing
  useEffect(() => {
    if (isEditing && params.id) {
      loadNote(params.id as string);
    }
  }, [params.id]);

  const loadNote = async (id: string) => {
    setIsLoadingNote(true);
    const { data: note, error } = await getNote(id);

    if (error || !note) {
      console.error('Error loading note:', error);
      Alert.alert('Error', 'Failed to load note');
      router.back();
    } else {
      setTitle(note.title || '');
      setDescription(note.description || '');
      setSelectedCategoryId(note.category_id);
      setImage(note.image_url || '');
      setIsPinned(note.pinned || false);
    }
    setIsLoadingNote(false);
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      const { data, error } = await createCategory(newCategoryName.trim());
      if (!error && data) {
        setSelectedCategoryId(data.id);
      }
      setNewCategoryName('');
      categorySheetRef.current?.hide();
    }
  };

  const uploadImage = async (uri: string) => {
    if (!user) return null;

    // In demo mode, just return the local URI (no cloud upload)
    if (isDemoMode) {
      return uri;
    }

    try {
      // Read file as base64 using new File API
      const file = new File(uri);
      const base64 = await file.base64();

      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const contentType = fileExt === 'png' ? 'image/png' : 'image/jpeg';

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, decode(base64), {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return uri; // Return local uri as fallback
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
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim() && !description.trim()) {
      Alert.alert('Error', 'Please add a title or description to your note');
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl = image;

      // Upload image if it's a local file
      if (image && image.startsWith('file://')) {
        imageUrl = await uploadImage(image) || '';
      }

      const noteData = {
        title: title.trim() || null,
        description: description.trim() || '',
        category_id: selectedCategoryId,
        image_url: imageUrl || null,
        pinned: isPinned,
      };

      if (isEditing && params.id) {
        const { error } = await updateNote(params.id as string, noteData);
        if (error) {
          Alert.alert('Error', 'Failed to update note');
          return;
        }
      } else {
        const { error } = await createNote(noteData);
        if (error) {
          Alert.alert('Error', 'Failed to create note');
          return;
        }
      }

      router.back();
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !params.id) return;

    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteNote(params.id as string);
            if (error) {
              Alert.alert('Error', 'Failed to delete note');
            } else {
              router.back();
            }
          },
        },
      ]
    );
  };

  if (isLoadingNote) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <View className='w-full bg-background flex-row pb-6 px-global' style={{ paddingTop: Platform.OS === 'ios' ? 20 : insets.top }}>
        <Icon name="X" size={20} color={colors.text} onPress={() => router.back()} className="bg-secondary rounded-full p-1.5" />
        <View className="flex-row items-center ml-auto gap-2">
          {isEditing && (
            <Icon
              name="Trash"
              size={20}
              onPress={handleDelete}
              className="bg-secondary rounded-full p-1.5"
            />
          )}
          <Icon
            name="Pin"
            size={20}
            color={isPinned ? "white" : colors.text}
            onPress={() => setIsPinned(!isPinned)}
            className={` rounded-full p-1.5 ${isPinned ? 'bg-highlight' : 'bg-secondary'}`}
          />
          <Button
            rounded='full'
            title={t('noteEdit.save')}
            onPress={handleSave}
            loading={isSaving}
          />
        </View>
      </View>
      <ScrollView className="flex-1 bg-background">
        <View className="px-global pb-6">
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={t('noteEdit.title')}
            placeholderTextColor={colors.placeholder}
            className="text-3xl font-bold text-text mb-4"
            style={{ color: colors.text }}
            multiline
          />

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t('noteEdit.startTyping')}
            placeholderTextColor={colors.placeholder}
            multiline
            className="text-base text-text min-h-[200px]"
            style={{ color: colors.text, textAlignVertical: 'top' }}
          />
        </View>
      </ScrollView>
      <View className=" bg-background" style={{ paddingBottom: insets.bottom + 20 }}>
        <View className="px-global pb-8 border-b border-border border-dashed mb-global">
          {image ? (
            <TouchableOpacity onPress={pickImage} className="mb-4 h-48 w-48 relative">
              <Image
                source={{ uri: image }}
                className="w-48 h-48 rounded-2xl"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setImage('')}
                className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
              >
                <Icon name="X" size={16} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.8}
              className="flex flex-row items-center bg-secondary ml-auto px-6 py-4 rounded-full"
              style={shadowPresets.card}
            >
              <Icon name="Image" size={20} />
              <ThemedText className="text-base ml-2">{t('noteEdit.addImage')}</ThemedText>
            </TouchableOpacity>
          )}
        </View>
        <View className='flex-row items-center justify-between px-global mb-4'>
          <ThemedText className="text-lg font-bold mb-3">{t('noteEdit.category')}</ThemedText>
          <Icon name="Plus" size={20} className="rounded-full p-1 bg-text" color={colors.invert} onPress={() => categorySheetRef.current?.show()} />
        </View>
        <CardScroller className='px-global'>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setSelectedCategoryId(null)}
              className={`px-4 py-2 rounded-full ${!selectedCategoryId ? 'bg-highlight' : 'bg-secondary'}`}
            >
              <ThemedText className={`text-sm ${!selectedCategoryId ? '!text-white' : ''}`}>{t('noteEdit.none')}</ThemedText>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategoryId(cat.id)}
                className={`px-4 py-2 rounded-full ${selectedCategoryId === cat.id ? 'bg-highlight' : 'bg-secondary'}`}
              >
                <ThemedText className={`text-sm ${selectedCategoryId === cat.id ? '!text-white' : ''}`}>{cat.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </CardScroller>
      </View>

      <ActionSheetThemed ref={categorySheetRef}>
        <View className="p-6">
            <TextInput
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder={t('noteEdit.categoryName')}
              placeholderTextColor={colors.placeholder}
              className="text-text bg-secondary rounded-lg text-xl py-2 h-20"
              style={{ color: colors.text }}
              autoFocus
            />
            <Button
              title={t('noteEdit.addCategory')}
              onPress={handleAddCategory}
              disabled={!newCategoryName.trim()}
              rounded='full'
            />
          </View>
      </ActionSheetThemed>
    </>
  );
}
