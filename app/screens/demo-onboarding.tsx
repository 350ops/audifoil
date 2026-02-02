import { View } from "react-native";
import MultiStep, { Step } from "@/components/MultiStep";
import ThemedText from "@/components/ThemedText";
import Icon from "@/components/Icon";
import { router } from "expo-router";
import Input from "@/components/forms/Input";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function DemoOnboardingScreen() {
    const [name, setName] = useState('');
    const { updateDemoProfile } = useAuth();

    const handleComplete = async () => {
        // Save the name to demo profile if provided
        if (name.trim()) {
            const nameParts = name.trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || null;

            await updateDemoProfile({
                first_name: firstName,
                last_name: lastName,
            });
        }

        router.replace('/(drawer)/(tabs)');
    };

    const handleStepChange = (nextStep: number) => {
        // Validate name step before proceeding (step 1 -> step 2)
        if (nextStep === 2 && !name.trim()) {
            // Allow skipping, they can use default "Demo User"
            return true;
        }
        return true;
    };

    return (
        <MultiStep
            onComplete={handleComplete}
            showHeader={true}
            showStepIndicator={true}
            onStepChange={handleStepChange}
        >
            <Step title="Welcome">
                <View className="flex-1 px-global justify-center">
                    <View className="items-center mb-8">
                        <View className="w-24 h-24 rounded-full bg-highlight/10 items-center justify-center mb-6">
                            <Icon name="Sparkles" size={40} className="rounded-full bg-secondary p-6" />
                        </View>
                        <ThemedText className="text-3xl font-bold text-center mb-3">
                            Welcome to Demo Mode
                        </ThemedText>
                        <ThemedText className="text-center opacity-60 px-8">
                            Discover premium Maldives experiences without creating an account. Your bookings will be stored locally.
                        </ThemedText>
                    </View>
                </View>
            </Step>

            <Step title="Your Name">
                <View className="flex-1 px-global pt-8">
                    <ThemedText className="text-3xl font-bold mb-2">
                        What's your name?
                    </ThemedText>
                    <ThemedText className="opacity-60 mb-8">
                        Let us know how to address you.
                    </ThemedText>
                    <Input
                        placeholder="Enter your name"
                        variant="classic"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />
                </View>
            </Step>

            <Step title="Features">
                <View className="flex-1 px-global pt-8">
                    <ThemedText className="text-3xl font-bold mb-2">
                        What you can do
                    </ThemedText>
                    <ThemedText className="opacity-60 mb-8">
                        Discover premium Maldives experiences.
                    </ThemedText>
                    <View className="gap-4">
                        <FeatureItem
                            icon="Sparkles"
                            title="Discover Activities"
                            description="E-foil, snorkeling, sunset cruises & more"
                        />
                        <FeatureItem
                            icon="Calendar"
                            title="Book Sessions"
                            description="Choose your date, time, and group size"
                        />
                        <FeatureItem
                            icon="Plane"
                            title="Crew Shortcut"
                            description="Quick booking based on your flight"
                        />
                        <FeatureItem
                            icon="Bookmark"
                            title="Manage Bookings"
                            description="View and track all your experiences"
                        />
                    </View>
                </View>
            </Step>

            <Step title="Ready">
                <View className="flex-1 px-global justify-center">
                    <View className="items-center">
                        <View className="w-24 h-24 rounded-full items-center justify-center mb-6">
                            <Icon name="Check" size={40} color="white" className="rounded-full bg-highlight p-6" />
                        </View>
                        <ThemedText className="text-3xl font-bold text-center mb-3">
                            You're all set!
                        </ThemedText>
                        <ThemedText className="text-center opacity-60 px-8">
                            Start exploring premium Maldives experiences. Your adventure awaits!
                        </ThemedText>
                    </View>
                </View>
            </Step>
        </MultiStep>
    );
}

function FeatureItem({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <View className="flex-row items-center gap-4 p-4 bg-secondary rounded-2xl">
            <View className="w-12 h-12 rounded-full bg-highlight/10 items-center justify-center">
                <Icon name={icon as any} size={24} />
            </View>
            <View className="flex-1">
                <ThemedText className="font-semibold mb-0.5">{title}</ThemedText>
                <ThemedText className="opacity-60 text-sm">{description}</ThemedText>
            </View>
        </View>
    );
}
