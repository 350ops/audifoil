import { View, Image, TextInput, Pressable, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import ThemedScroller from "@/components/ThemeScroller";
import ThemedText from "@/components/ThemedText";
import React, { useState, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@/components/Icon";
import useThemeColors from "@/contexts/ThemeColors";
import { shadowPresets } from "@/utils/useShadow";
import { useTranslation } from '@/hooks/useTranslation';
import { useNotes } from '@/contexts/NotesContext';

export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();
    const [searchText, setSearchText] = useState("");
    const { t } = useTranslation();
    const { notes } = useNotes();

    // Filter notes based on search text
    const filteredNotes = useMemo(() => {
        if (!searchText.trim()) {
            return notes;
        }
        const query = searchText.toLowerCase();
        return notes.filter((note) =>
            note.title?.toLowerCase().includes(query) ||
            note.description?.toLowerCase().includes(query)
        );
    }, [searchText, notes]);

    const handleNotePress = (noteId: string) => {
        router.push({
            pathname: '/screens/note-detail',
            params: { id: noteId },
        });
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <>
            <View className="bg-background px-4 pb-2 " style={{ paddingTop: insets.top }}>
                <View style={shadowPresets.card} className="relative bg-secondary rounded-full bg-secondary">
                    <Pressable onPress={() => router.back()} className="absolute z-40 left-4 top-1/2 -translate-y-1/2" >
                        <Icon name="ArrowLeft" size={20} />
                    </Pressable>
                    <TextInput
                        placeholder={t('search.placeholder')}
                        placeholderTextColor={colors.placeholder}
                        className="relative z-10 rounded-full py-5 flex-row items-center pl-12 pr-12"
                        style={{ color: colors.text }}
                        value={searchText}
                        onChangeText={setSearchText}
                        autoFocus
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchText("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-40"
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Icon name="X" size={20} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>


            <ThemedScroller className="pt-3">
                {filteredNotes.length === 0 ? (
                    <View className="items-center py-10">
                        <Icon name="Search" size={40} />
                        <ThemedText className="text-subtext mt-4">
                            {searchText ? 'No notes found' : 'No notes yet'}
                        </ThemedText>
                    </View>
                ) : (
                    filteredNotes.map((note) => (
                        <TouchableOpacity
                            key={note.id}
                            onPress={() => handleNotePress(note.id)}
                            className="flex-row items-center bg-secondary rounded-2xl p-4 mb-2"
                            style={shadowPresets.large}
                        >
                            <View className="flex-1 mr-3">
                                {note.title && (
                                    <ThemedText className="text-lg font-semibold" numberOfLines={1}>
                                        {note.title}
                                    </ThemedText>
                                )}
                                {note.description && (
                                    <ThemedText className="text-sm opacity-60" numberOfLines={2}>
                                        {note.description}
                                    </ThemedText>
                                )}
                                {note.created_at && (
                                    <ThemedText className="text-xs opacity-40 mt-2">
                                        {formatDate(note.created_at)}
                                    </ThemedText>
                                )}
                            </View>
                            {note.image_url && (
                                <Image
                                    source={{ uri: note.image_url }}
                                    className="w-16 h-16 rounded-xl"
                                    style={{ width: 64, height: 64 }}
                                    resizeMode="cover"
                                />
                            )}
                        </TouchableOpacity>
                    ))
                )}
            </ThemedScroller>

        </>
    )
}
