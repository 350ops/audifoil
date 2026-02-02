import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Header from '@/components/Header';
import ThemedText from '@/components/ThemedText';
import Icon from '@/components/Icon';
import ThemedScroller from '@/components/ThemeScroller';
import useThemeColors from '@/contexts/ThemeColors';
import { useNotes } from '@/contexts/NotesContext';
import AnimatedView from '@/components/AnimatedView';

export default function NoteDetailScreen() {
  const params = useLocalSearchParams();
  const colors = useThemeColors();
  const { categories, togglePin, getNote } = useNotes();

  const [note, setNote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadNote(params.id as string);
    }
  }, [params.id]);

  const loadNote = async (id: string) => {
    setIsLoading(true);
    const { data, error } = await getNote(id);

    if (error || !data) {
      console.error('Error loading note:', error);
      Alert.alert('Error', 'Failed to load note');
      router.back();
    } else {
      setNote(data);
    }
    setIsLoading(false);
  };

  const handleEdit = () => {
    router.push({
      pathname: '/screens/note-edit',
      params: { id: params.id },
    });
  };

  const handlePinToggle = async () => {
    if (!note) return;
    await togglePin(note.id);
    setNote({ ...note, pinned: !note.pinned });
  };

  // Get category name by id
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return undefined;
    const category = categories.find(c => c.id === categoryId);
    return category?.name;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <>
        <Header showBackButton />
        <View className="flex-1 bg-background items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </>
    );
  }

  if (!note) {
    return (
      <>
        <Header showBackButton />
        <View className="flex-1 bg-background items-center justify-center">
          <Icon name="FileX" size={48} />
          <ThemedText className="text-lg mt-4">Note not found</ThemedText>
        </View>
      </>
    );
  }

  const categoryName = getCategoryName(note.category_id);

  return (
    <>
      <Header
        showBackButton
        rightComponents={[
          <TouchableOpacity onPress={handleEdit}>
            <Icon name="Pencil" size={22} />
          </TouchableOpacity>,
          <TouchableOpacity onPress={handlePinToggle}>
            <Icon name="Pin" size={22} color={note.pinned ? colors.highlight : colors.text} />
          </TouchableOpacity>
        ]}
      />
      <ThemedScroller className='!px-8'>
        {note.image_url && (
          <AnimatedView animation="scaleIn" duration={400} delay={200} className='mb-global'>
            <Image
              source={{ uri: note.image_url }}
              className="w-full h-80 rounded-3xl"
              style={{ width: '100%', height: 320 }}
              resizeMode="cover"
            />
          </AnimatedView>
        )}
        <AnimatedView animation="slideInBottom" duration={400}>
          <View className="flex-row items-center gap-4 mb-4">

            {categoryName && (
              <View className="px-3 py-1 rounded-full bg-secondary">
                <ThemedText className="text-xs">{categoryName}</ThemedText>
              </View>
            )}
            {note.created_at && (
              <ThemedText className="text-sm opacity-50">{formatDate(note.created_at)}</ThemedText>
            )}
          </View>

          {note.title && (
            <ThemedText className="text-3xl font-bold mb-4">{note.title}</ThemedText>
          )}

          {note.description && (
            <ThemedText className="text-base leading-relaxed opacity-80">
              {note.description}
            </ThemedText>
          )}


        </AnimatedView>
      </ThemedScroller>
    </>
  );
}
