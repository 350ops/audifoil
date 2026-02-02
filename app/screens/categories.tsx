import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ActionSheetRef } from 'react-native-actions-sheet';
import ThemedScroller from '@/components/ThemeScroller';
import ThemedText from '@/components/ThemedText';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import useThemeColors from '@/contexts/ThemeColors';
import ActionSheetThemed from '@/components/ActionSheetThemed';
import Header from '@/components/Header';
import { useTranslation } from '@/hooks/useTranslation';
import { useNotes } from '@/contexts/NotesContext';
import { Tables } from '@/lib/database.types';

type Category = Tables<'categories'>;

export default function CategoriesScreen() {
  const colors = useThemeColors();
  const { categories, isLoading, createCategory, updateCategory, deleteCategory, getNoteCountByCategory } = useNotes();
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const categorySheetRef = useRef<ActionSheetRef>(null);
  const { t } = useTranslation();
  const isEditing = editingCategory !== null;

  const handleOpenAddSheet = () => {
    setCategoryName('');
    setEditingCategory(null);
    categorySheetRef.current?.show();
  };

  const handleOpenEditSheet = (category: Category) => {
    setCategoryName(category.name);
    setEditingCategory(category);
    categorySheetRef.current?.show();
  };

  const handleSave = async () => {
    if (!categoryName.trim()) return;

    setIsSaving(true);
    try {
      if (isEditing && editingCategory) {
        const { error } = await updateCategory(editingCategory.id, categoryName.trim());
        if (error) {
          Alert.alert('Error', 'Failed to update category');
          return;
        }
      } else {
        const { error } = await createCategory(categoryName.trim());
        if (error) {
          Alert.alert('Error', 'Failed to create category');
          return;
        }
      }
      setCategoryName('');
      setEditingCategory(null);
      categorySheetRef.current?.hide();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingCategory) return;

    const noteCount = getNoteCountByCategory(editingCategory.id);

    if (noteCount > 0) {
      Alert.alert(
        'Delete Category',
        `This category has ${noteCount} note${noteCount === 1 ? '' : 's'}. Deleting it will remove the category from these notes. Continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const { error } = await deleteCategory(editingCategory.id);
              if (error) {
                Alert.alert('Error', 'Failed to delete category');
              } else {
                setCategoryName('');
                setEditingCategory(null);
                categorySheetRef.current?.hide();
              }
            },
          },
        ]
      );
    } else {
      const { error } = await deleteCategory(editingCategory.id);
      if (error) {
        Alert.alert('Error', 'Failed to delete category');
      } else {
        setCategoryName('');
        setEditingCategory(null);
        categorySheetRef.current?.hide();
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <Header showBackButton title={t('categories.title')} />
        <View className="flex-1 bg-background items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </>
    );
  }

  return (
    <>
      <Header
        showBackButton
        title={t('categories.title')}
        rightComponents={[
          <TouchableOpacity onPress={handleOpenAddSheet}>
            <Icon name="Plus" size={22} color={colors.text} />
          </TouchableOpacity>,
        ]}
      />
      <ThemedScroller className="flex-1 bg-background px-global">
        <View className="py-4">
          {categories.map((category) => {
            const noteCount = getNoteCountByCategory(category.id);
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleOpenEditSheet(category)}
                className="flex-row items-center justify-between bg-secondary rounded-2xl p-4 mb-3"
              >
                <View className="flex-1">
                  <ThemedText className="text-lg font-semibold">
                    {category.name}
                  </ThemedText>
                  <ThemedText className="text-sm opacity-60 mt-1">
                    {noteCount} {noteCount === 1 ? 'note' : 'notes'}
                  </ThemedText>
                </View>
                <Icon name="ChevronRight" size={20} color={colors.text} />
              </TouchableOpacity>
            );
          })}

          {categories.length === 0 && (
            <View className="items-center py-20">
              <Icon name="Tag" size={40} color={colors.text} />
              <ThemedText className="text-subtext mt-4">{t('categories.noCategories')}</ThemedText>
              <ThemedText className="text-sm text-subtext mt-2">
                {t('categories.tapToAdd')}
              </ThemedText>
            </View>
          )}
        </View>
      </ThemedScroller>

      <ActionSheetThemed ref={categorySheetRef}>
        <View className="p-global pb-0">

          <TextInput
            value={categoryName}
            onChangeText={setCategoryName}
            placeholder={t('categories.categoryName')}
            placeholderTextColor={colors.text}
            className="text-text bg-secondary rounded-2xl font-bold text-xl mb-4"
            style={{ color: colors.text }}
            autoFocus
          />

          <View className='flex-row gap-2 mt-10'>
            {isEditing && (
              <Button
                title="Delete Category"
                onPress={handleDelete}
                rounded="full"
                variant="outline"
              />
            )}
            <Button
              title={isEditing ? t('categories.saveChanges') : t('categories.addCategory')}
              onPress={handleSave}
              disabled={!categoryName.trim()}
              loading={isSaving}
              rounded="full"
            />


          </View>
        </View>
      </ActionSheetThemed>
    </>
  );
}

