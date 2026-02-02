import Header from "@/components/Header";
import ListLink from "@/components/ListLink";
import ThemedScroller from "@/components/ThemeScroller";
import Section from "@/components/layout/Section";
import { View } from "react-native";
import { shadowPresets } from "@/utils/useShadow";

export default function ComponentsScreen() {
    return (
        <>
            <Header showBackButton title="Components" />
            <ThemedScroller className="flex-1 bg-background px-global">
                <Section title="Core UI" titleSize="lg" className="mt-4 mb-2" />
                <View style={shadowPresets.large} className="bg-secondary rounded-2xl mb-4">
                    <ListLink className="px-4 border-b border-border" icon="RectangleHorizontal" title="Button" description="Variants, sizes, icons, states" href="/screens/components/button" />
                    <ListLink className="px-4 border-b border-border" icon="Square" title="Card" description="Classic, overlay, with badges" href="/screens/components/card" />
                    <ListLink className="px-4 border-b border-border" icon="Circle" title="Chip" description="Sizes, icons, selectable" href="/screens/components/chip" />
                    <ListLink className="px-4" icon="User" title="Avatar" description="Sizes, images, initials" href="/screens/components/avatar" />
                </View>

                <Section title="Forms" titleSize="lg" className="mt-6 mb-2" />
                <View style={shadowPresets.large} className="bg-secondary rounded-2xl mb-4">
                    <ListLink className="px-4 border-b border-border" icon="TextCursorInput" title="Input" description="Classic, underlined, label-inside" href="/screens/components/input" />
                    <ListLink className="px-4 border-b border-border" icon="ChevronDown" title="Select" description="Dropdown with action sheet" href="/screens/components/select" />
                    <ListLink className="px-4 border-b border-border" icon="Calendar" title="DatePicker" description="Date selection with variants" href="/screens/components/datepicker" />
                    <ListLink className="px-4 border-b border-border" icon="CheckSquare" title="Selectable" description="Selection cards with icons" href="/screens/components/selectable" />
                    <ListLink className="px-4" icon="ToggleRight" title="Switch" description="Toggle with labels and icons" href="/screens/components/switch" />
                </View>

                <Section title="Layout" titleSize="lg" className="mt-6 mb-2" />
                <View style={shadowPresets.large} className="bg-secondary rounded-2xl mb-4">
                    <ListLink className="px-4 border-b border-border" icon="ChevronsUpDown" title="Expandable" description="Tap to expand and collapse" href="/screens/components/expandable" />
                    <ListLink className="px-4 border-b border-border" icon="Layers" title="Card Scroller" description="Horizontal scrolling cards" href="/screens/components/card-scroller" />
                    <ListLink className="px-4 border-b border-border" icon="Images" title="Image Carousel" description="Swipeable image gallery" href="/screens/components/image-carousel" />
                    <ListLink className="px-4 border-b border-border" icon="PanelBottom" title="Action Sheet" description="Bottom sheet modals" href="/screens/components/action-sheet" />
                    <ListLink className="px-4" icon="Columns" title="Tabs" description="Swipeable tab navigation" href="/screens/components/theme-tabs" />
                </View>

                <Section title="Data Display" titleSize="lg" className="mt-6 mb-2" />
                <View style={shadowPresets.large} className="bg-secondary rounded-2xl mb-4">
                    <ListLink className="px-4 border-b border-border" icon="Star" title="Review" description="User reviews with ratings" href="/screens/components/review" />
                    <ListLink className="px-4" icon="BarChart3" title="Chart Cards" description="Line & circle chart cards" href="/screens/components/chart-cards" />
                </View>

                <Section title="Navigation" titleSize="lg" className="mt-6 mb-2" />
                <View style={shadowPresets.large} className="bg-secondary rounded-2xl mb-4">
                    <ListLink className="px-4" icon="ListOrdered" title="MultiStep" description="Step-by-step onboarding flow" href="/screens/components/multistep" />
                </View>

                <Section title="Utilities" titleSize="lg" className="mt-6 mb-2" />
                <View style={shadowPresets.large} className="bg-secondary rounded-2xl mb-4">
                    <ListLink className="px-4 border-b border-border" icon="Shapes" title="Icons" description="Available icon set" href="/screens/components/icon" />
                    <ListLink className="px-4" icon="Loader" title="Progress Bar" description="Progress indicators" href="/screens/components/progress-bar" />
                </View>
            </ThemedScroller>
        </>
    );
}
