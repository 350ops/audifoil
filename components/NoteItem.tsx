import { useRef } from "react";
import { View, Image, Pressable, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ActionSheetRef } from "react-native-actions-sheet";
import ThemedText from "./ThemedText";
import Icon from "./Icon";
import useThemeColors from "@/contexts/ThemeColors";
import { shadowPresets } from "@/utils/useShadow";
import ActionSheetThemed from "./ActionSheetThemed";

type NoteItemProps = {
    id: string;
    title?: string;
    description?: string;
    date?: string;
    color?: string;
    category?: string;
    image?: string;
    pinned?: boolean;
    variant?: 'grid' | 'list';
    onDelete?: (id: string) => void;
    onPinToggle?: (id: string) => void;
};

export default function NoteItem({ id, title, description, date, color, category, image, pinned, variant = 'grid', onDelete, onPinToggle }: NoteItemProps) {
    const hasPinnedColor = pinned && color;
    const colors = useThemeColors();
    const actionSheetRef = useRef<ActionSheetRef>(null);
    const isListView = variant === 'list';

    const handlePress = () => {
        router.push({
            pathname: '/screens/note-detail',
            params: { id },
        });
    };

    const handleLongPress = () => {
        actionSheetRef.current?.show();
    };

    const handleEdit = () => {
        actionSheetRef.current?.hide();
        router.push({
            pathname: '/screens/note-edit',
            params: { id },
        });
    };

    const handleDelete = () => {
        actionSheetRef.current?.hide();
        onDelete?.(id);
    };

    const handleView = () => {
        actionSheetRef.current?.hide();
        handlePress();
    };

    const handlePinToggle = () => {
        actionSheetRef.current?.hide();
        onPinToggle?.(id);
    };

    // List View
    if (isListView) {
        return (
            <>
                <TouchableOpacity
                    onPress={handlePress}
                    activeOpacity={0.8}
                    onLongPress={handleLongPress}
                    className={`rounded-2xl mb-3 flex-row ${hasPinnedColor ? `bg-amber-300` : 'bg-secondary'}`}
                    style={shadowPresets.large}
                    delayLongPress={200}
                >
                    <View className="flex-1 p-4">
                        <View className="flex-row items-center mb-2">
                            {category && (
                                <View
                                    className={`px-2 py-0.5 rounded-full border mr-2 ${hasPinnedColor ? `border-black` : `border-text`}`}
                                >
                                    <ThemedText
                                        className={`text-[10px] ${hasPinnedColor ? `!text-black` : `text-text`}`}
                                    >
                                        {category}
                                    </ThemedText>
                                </View>
                            )}

                        </View>
                        {title && (
                            <ThemedText
                                className={`text-base font-bold ${hasPinnedColor ? `!text-black` : `text-text`}`}
                            >
                                {title}
                            </ThemedText>
                        )}
                        {description && (
                            <ThemedText
                                numberOfLines={2}
                                className={`text-xs mt-1 opacity-70 ${hasPinnedColor ? `!text-black` : `text-text`}`}
                            >
                                {description}
                            </ThemedText>
                        )}
                        <View className="flex-row items-center mt-2">
                            {pinned && (
                                <Icon name="Pin" size={12} className="bg-text p-1.5 rounded-full mr-2" color={hasPinnedColor ? colors.invert : colors.text} />
                            )}
                            {date && (
                                <ThemedText
                                    className={`text-xs opacity-50 ${hasPinnedColor ? `!text-black` : `text-text`}`}
                                >
                                    {date}
                                </ThemedText>
                            )}

                        </View>
                    </View>
                    {image && (
                        <Image
                            source={{ uri: image }}
                            className="w-20 h-20 rounded-xl m-3"
                            style={{ width: 50, height: 50 }}
                            resizeMode="cover"
                        />
                    )}
                </TouchableOpacity>

                <ActionSheetThemed ref={actionSheetRef}>
                    <View className="p-8">
                        {category && (
                            <View
                                className={`px-2 py-0.5 mb-2 rounded-full border mr-auto border-text`}
                            >
                                <ThemedText
                                    className={`text-[10px] text-text`}
                                >
                                    {category}
                                </ThemedText>
                            </View>
                        )}
                        <ThemedText className="text-2xl font-bold">{title}</ThemedText>
                        <ThemedText className="text-sm mb-4">{date}</ThemedText>

                        <Pressable
                            onPress={handlePinToggle}
                            className="flex-row items-center py-4 border-b border-border"
                        >
                            <Icon name="Pin" size={20} color={pinned ? colors.highlight : colors.text} />
                            <ThemedText className="ml-3 text-base">{pinned ? 'Unpin' : 'Pin'}</ThemedText>
                        </Pressable>
                        <Pressable
                            onPress={handleView}
                            className="flex-row items-center py-4 border-b border-border"
                        >
                            <Icon name="Eye" size={20} />
                            <ThemedText className="ml-3 text-base">View</ThemedText>
                        </Pressable>
                        <Pressable
                            onPress={handleEdit}
                            className="flex-row items-center py-4 border-b border-border"
                        >
                            <Icon name="Pencil" size={20} />
                            <ThemedText className="ml-3 text-base">Edit</ThemedText>
                        </Pressable>
                        <Pressable
                            onPress={handleDelete}
                            className="flex-row items-center py-4"
                        >
                            <Icon name="Trash" size={20} />
                            <ThemedText className="ml-3 text-base text-red-500">Delete</ThemedText>
                        </Pressable>
                    </View>
                </ActionSheetThemed>
            </>
        );
    }

    // Grid View (default)
    return (
        <>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.8}
                onLongPress={handleLongPress}
                className={`rounded-3xl mb-2 ${hasPinnedColor ? `bg-amber-300` : 'bg-secondary'}`}
                style={pinned ? shadowPresets.card : shadowPresets.large}
                delayLongPress={200}
            >
                {image && (
                    <Image
                        source={{ uri: image }}
                        className="w-full h-44 rounded-t-2xl"
                        style={{ width: '100%', height: 176 }}
                        resizeMode="cover"
                    />
                )}
                <View className="p-5">
                    <View className={`flex-row items-center justify-between ${category ? `mb-2` : `mb-0`} ${pinned ? `mb-2` : `mb-0`}`}>

                        {category && (
                            <View
                                className={`px-2 py-0.5 rounded-full border ${hasPinnedColor ? `border-black` : `border-text`}`}
                            >
                                <ThemedText
                                    className={`text-[10px] ${hasPinnedColor ? `!text-black` : `text-text`}`}
                                >
                                    {category}
                                </ThemedText>
                            </View>
                        )}

                    </View>
                    {title && (
                        <ThemedText
                            className={`text-lg font-bold leading-tight ${hasPinnedColor ? `!text-black` : `text-text`}`}
                        >
                            {title}
                        </ThemedText>
                    )}
                    {description && (
                        <ThemedText
                            numberOfLines={2}
                            className={`text-xs mt-1 opacity-80 ${hasPinnedColor ? `!text-black` : `text-text`}`}
                        >
                            {description}
                        </ThemedText>
                    )}
                    <View className="flex-row items-end justify-between mt-16">

                        {date && (
                            <ThemedText
                                className={`text-xs opacity-60 ${hasPinnedColor ? `!text-black` : `text-text`}`}
                            >
                                {date}
                            </ThemedText>
                        )}
                        {pinned && (
                            <View className="flex-row items-center ml-auto">
                                <Icon name="Pin" size={14} className="bg-text p-1.5 rounded-full" color={hasPinnedColor ? colors.invert : colors.text} />
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            <ActionSheetThemed ref={actionSheetRef}>
                <View className="p-8">
                    {category && (
                        <View
                            className={`px-2 py-0.5 mb-2 rounded-full border mr-auto border-text`}
                        >
                            <ThemedText
                                className={`text-[10px] text-text`}
                            >
                                {category}
                            </ThemedText>
                        </View>
                    )}
                    <ThemedText className="text-2xl font-bold">{title}</ThemedText>
                    <ThemedText className="text-sm mb-4">{date}</ThemedText>

                    <Pressable
                        onPress={handlePinToggle}
                        className="flex-row items-center py-4 border-b border-border"
                    >
                        <Icon name="Pin" size={20} color={pinned ? colors.highlight : colors.text} />
                        <ThemedText className="ml-3 text-base">{pinned ? 'Unpin' : 'Pin'}</ThemedText>
                    </Pressable>
                    <Pressable
                        onPress={handleView}
                        className="flex-row items-center py-4 border-b border-border"
                    >
                        <Icon name="Eye" size={20} />
                        <ThemedText className="ml-3 text-base">View</ThemedText>
                    </Pressable>
                    <Pressable
                        onPress={handleEdit}
                        className="flex-row items-center py-4 border-b border-border"
                    >
                        <Icon name="Pencil" size={20} />
                        <ThemedText className="ml-3 text-base">Edit</ThemedText>
                    </Pressable>
                    <Pressable
                        onPress={handleDelete}
                        className="flex-row items-center py-4"
                    >
                        <Icon name="Trash" size={20} />
                        <ThemedText className="ml-3 text-base text-red-500">Delete</ThemedText>
                    </Pressable>
                </View>

            </ActionSheetThemed>
        </>
    );
}   