import React, { useRef, useState } from 'react';
import { View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import Header from '@/components/Header';
import ThemedScroller from '@/components/ThemeScroller';
import useThemeColors from '@/contexts/ThemeColors';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import ThemedText from '@/components/ThemedText';
import ThemedFooter from '@/components/ThemeFooter';
import ActionSheetThemed from '@/components/ActionSheetThemed';
import { ActionSheetRef } from 'react-native-actions-sheet';
import { Chip } from '@/components/Chip';
import { useTranslation } from '@/hooks/useTranslation';
import { useRevenueCat, PRODUCT_IDS } from '@/contexts/RevenueCatContext';
import RevenueCatUI from 'react-native-purchases-ui';

export default function SubscriptionScreen() {
    const { t } = useTranslation();
    const colors = useThemeColors();
    const { offerings, isProUser, isLoading, purchasePackage, restorePurchases, getPackageByIdentifier, resetSubscription } = useRevenueCat();
    const [selectedPlan, setSelectedPlan] = useState<string>(PRODUCT_IDS.MONTHLY);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const actionSheetRef = useRef<ActionSheetRef>(null);

    // If user is already Pro, show success state
    if (isProUser) {
        return (
            <View className='flex-1 bg-background items-center justify-center px-10'>
                <Icon name='Check' size={48} className='w-24 h-24 bg-highlight rounded-full mb-6' color='white' />
                <ThemedText className='font-bold text-3xl text-center mb-2'>You're a Pro!</ThemedText>
                <ThemedText className='text-lg text-center opacity-60 mb-8'>Enjoy unlimited access to all features</ThemedText>
                <Button
                    title="Back to App"
                    onPress={() => router.back()}
                    rounded='full'
                />
                <Pressable
                    onPress={() => {
                        Alert.alert(
                            'Reset Subscription',
                            'This will reset your test subscription. Continue?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Reset', style: 'destructive', onPress: resetSubscription }
                            ]
                        );
                    }}
                    className='mt-6'
                >
                    <ThemedText className='text-sm opacity-40 underline'>Reset Subscription (Dev)</ThemedText>
                </Pressable>
            </View>
        );
    }

    // Show loading while fetching offerings
    if (isLoading && !offerings) {
        return (
            <View className='flex-1 bg-background items-center justify-center'>
                <ActivityIndicator size="large" />
                <ThemedText className='mt-4 opacity-60'>Loading subscription options...</ThemedText>
            </View>
        );
    }

    // Get packages from offerings
    const monthlyPackage = getPackageByIdentifier(PRODUCT_IDS.MONTHLY) || getPackageByIdentifier('$rc_monthly');
    const yearlyPackage = getPackageByIdentifier(PRODUCT_IDS.YEARLY) || getPackageByIdentifier('$rc_annual');
    const lifetimePackage = getPackageByIdentifier(PRODUCT_IDS.LIFETIME) || getPackageByIdentifier('$rc_lifetime');

    const handlePurchase = async () => {
        let packageToPurchase;

        switch (selectedPlan) {
            case PRODUCT_IDS.MONTHLY:
                packageToPurchase = monthlyPackage;
                break;
            case PRODUCT_IDS.YEARLY:
                packageToPurchase = yearlyPackage;
                break;
            case PRODUCT_IDS.LIFETIME:
                packageToPurchase = lifetimePackage;
                break;
        }

        if (!packageToPurchase) {
            Alert.alert('Error', 'Selected plan is not available');
            return;
        }

        setIsPurchasing(true);
        const success = await purchasePackage(packageToPurchase);
        setIsPurchasing(false);

        if (success) {
            actionSheetRef.current?.show();
        }
    };

    const handleRestore = async () => {
        setIsPurchasing(true);
        const success = await restorePurchases();
        setIsPurchasing(false);

        if (success) {
            Alert.alert('Success', 'Your purchases have been restored!');
        } else {
            Alert.alert('No Purchases Found', 'We couldn\'t find any previous purchases to restore.');
        }
    };

    // Present RevenueCat native paywall
    const presentPaywall = async () => {
        try {
            const result = await RevenueCatUI.presentPaywall();
            if (result === 'PURCHASED' || result === 'RESTORED') {
                actionSheetRef.current?.show();
            }
        } catch (error) {
            console.error('Error presenting paywall:', error);
        }
    };

    return (
        <>
            <View className='flex-1 bg-background'>
                <Header showBackButton className='bg-secondary' />
                <ThemedScroller className='!px-0'>
                    <View className='pt-10 pb-4 px-10 bg-secondary'>
                        <View className='w-full items-center'>
                            <ThemedText className='font-outfit-bold text-4xl text-center'>{t('subscription.title')}</ThemedText>
                            <ThemedText className='text-lg font-light mt-1 text-center'>{t('subscription.subtitle')}</ThemedText>
                        </View>
                        <View className='flex-row mt-6 flex-wrap items-center justify-center gap-2 w-full mx-auto mb-14'>
                            <Chip size='lg' label={t('subscription.unlimitedNotes')} isSelected={true} />
                            <Chip size='lg' label={t('subscription.cloudSync')} isSelected={true} />
                        </View>
                    </View>
                    <View className='p-global'>
                        {monthlyPackage && (
                            <SubscriptionCard
                                icon='Star'
                                title={t('subscription.monthly')}
                                description={t('subscription.monthlyDesc')}
                                price={monthlyPackage.product.priceString}
                                active={selectedPlan === PRODUCT_IDS.MONTHLY}
                                onPress={() => setSelectedPlan(PRODUCT_IDS.MONTHLY)}
                            />
                        )}
                        {yearlyPackage && (
                            <SubscriptionCard
                                icon='Trophy'
                                title={t('subscription.yearly')}
                                description={t('subscription.yearlyDesc')}
                                price={yearlyPackage.product.priceString}
                                discount='50%'
                                active={selectedPlan === PRODUCT_IDS.YEARLY}
                                onPress={() => setSelectedPlan(PRODUCT_IDS.YEARLY)}
                            />
                        )}
                        {lifetimePackage && (
                            <SubscriptionCard
                                icon='Medal'
                                title='Lifetime'
                                description='Pay once, use forever'
                                price={lifetimePackage.product.priceString}
                                active={selectedPlan === PRODUCT_IDS.LIFETIME}
                                onPress={() => setSelectedPlan(PRODUCT_IDS.LIFETIME)}
                            />
                        )}

                        {/* Fallback if no packages loaded */}
                        {!monthlyPackage && !yearlyPackage && !lifetimePackage && (
                            <View className='items-center py-10'>
                                <ThemedText className='opacity-60 text-center'>
                                    Subscription options are being loaded...
                                </ThemedText>
                                <Button
                                    title="Use Native Paywall"
                                    onPress={presentPaywall}
                                    variant='outline'
                                    rounded='full'
                                    className='mt-4'
                                />
                            </View>
                        )}

                        <Pressable onPress={handleRestore} className='items-center mt-4'>
                            <ThemedText className='text-sm opacity-60 underline'>Restore Purchases</ThemedText>
                        </Pressable>
                    </View>
                </ThemedScroller>
                <ThemedFooter className='bg-secondary'>
                    <Button
                        onPress={handlePurchase}
                        className='!bg-highlight'
                        textClassName='!text-white'
                        size='large'
                        rounded='full'
                        title={t('subscription.upgrade')}
                        loading={isPurchasing}
                        disabled={isPurchasing || (!monthlyPackage && !yearlyPackage && !lifetimePackage)}
                    />
                </ThemedFooter>
            </View>
            <ActionSheetThemed
                gestureEnabled
                containerStyle={{
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingTop: 10,
                }}
                ref={actionSheetRef}>
                <View className='px-6 pt-10 items-center'>
                    <Icon name='Check' size={24} className='w-20 h-20 bg-background rounded-full mb-6' />
                    <ThemedText className='font-semibold text-4xl'>{t('subscription.welcomeTitle')}</ThemedText>
                    <ThemedText className='text-lg text-center px-14 font-light mt-2 mb-32'>{t('subscription.welcomeMessage')}</ThemedText>
                    <Button
                        onPress={() => {
                            actionSheetRef.current?.hide();
                            router.back();
                        }}
                        className='!bg-highlight !px-10'
                        textClassName='!text-white'
                        size='large'
                        rounded='full'
                        title={t('subscription.startUsing')}
                    />
                </View>
            </ActionSheetThemed>
        </>
    );
}

type SubscriptionCardProps = {
    icon?: string;
    title: string;
    description?: string;
    price: string;
    discount?: string;
    active?: boolean;
    onPress?: () => void;
};

const SubscriptionCard = ({ icon, title, description, price, discount, active, onPress }: SubscriptionCardProps) => {
    const colors = useThemeColors();
    return (
        <Pressable
            onPress={onPress}
            className={`bg-secondary rounded-2xl relative flex-row items-center border mb-2 ${active ? 'border-highlight' : 'border-transparent'}`}
        >
            <View className='py-6 px-6 flex-1 flex-row justify-start items-center'>
                <Icon
                    name="Check"
                    strokeWidth={3}
                    size={18}
                    color={active ? 'white' : 'transparent'}
                    className={`rounded-full border w-8 h-8 mr-3 ${active ? 'bg-highlight border-highlight' : 'bg-transparent border-border'}`}
                />
                <ThemedText className='font-semibold text-xl'>{title}</ThemedText>
                {discount && (
                    <ThemedText className='text-xs font-semibold bg-background text-highlight rounded-full px-2 py-1 ml-2'>
                        {discount} off
                    </ThemedText>
                )}
                <ThemedText className='text-lg ml-auto'>{price}</ThemedText>
            </View>
        </Pressable>
    );
};
