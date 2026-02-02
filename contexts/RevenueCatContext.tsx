import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { LogBox, Alert } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import Constants from 'expo-constants';
import { useAuth } from './AuthContext';

// Detect if running in Expo Go (not a development build)
const isExpoGo = Constants.executionEnvironment === 'storeClient';

// Suppress RevenueCat SDK internal errors in Expo Go
LogBox.ignoreLogs([
  '[RevenueCat]',
  'Error fetching customer info',
  'Error while tracking event',
  "Cannot read property 'search'",
  'Unknown backend error',
]);

// RevenueCat API Keys
const REVENUECAT_API_KEY = 'test_AVWMyXWmcTEGLmgXhvVbxBNriOS';

// Entitlement identifier
export const ENTITLEMENT_ID = 'audiFoil Pro';

// Product identifiers
export const PRODUCT_IDS = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  LIFETIME: 'lifetime',
} as const;

// Mock offerings for Expo Go testing
const MOCK_OFFERINGS: PurchasesOffering = {
  identifier: 'default',
  serverDescription: 'Default Offering',
  metadata: {},
  availablePackages: [
    {
      identifier: PRODUCT_IDS.MONTHLY,
      packageType: 'MONTHLY',
      product: {
        identifier: PRODUCT_IDS.MONTHLY,
        description: 'Monthly subscription',
        title: 'Monthly',
        price: 4.99,
        priceString: '$4.99',
        currencyCode: 'USD',
        introPrice: null,
        discounts: [],
        productCategory: 'SUBSCRIPTION',
        productType: 'AUTO_RENEWABLE_SUBSCRIPTION',
        subscriptionPeriod: 'P1M',
        defaultOption: null,
        subscriptionOptions: [],
        presentedOfferingIdentifier: 'default',
        presentedOfferingContext: null,
      },
      offeringIdentifier: 'default',
      presentedOfferingContext: { offeringIdentifier: 'default', targetingContext: null, placementIdentifier: null },
    },
    {
      identifier: PRODUCT_IDS.YEARLY,
      packageType: 'ANNUAL',
      product: {
        identifier: PRODUCT_IDS.YEARLY,
        description: 'Yearly subscription',
        title: 'Yearly',
        price: 29.99,
        priceString: '$29.99',
        currencyCode: 'USD',
        introPrice: null,
        discounts: [],
        productCategory: 'SUBSCRIPTION',
        productType: 'AUTO_RENEWABLE_SUBSCRIPTION',
        subscriptionPeriod: 'P1Y',
        defaultOption: null,
        subscriptionOptions: [],
        presentedOfferingIdentifier: 'default',
        presentedOfferingContext: null,
      },
      offeringIdentifier: 'default',
      presentedOfferingContext: { offeringIdentifier: 'default', targetingContext: null, placementIdentifier: null },
    },
    {
      identifier: PRODUCT_IDS.LIFETIME,
      packageType: 'LIFETIME',
      product: {
        identifier: PRODUCT_IDS.LIFETIME,
        description: 'Lifetime access',
        title: 'Lifetime',
        price: 79.99,
        priceString: '$79.99',
        currencyCode: 'USD',
        introPrice: null,
        discounts: [],
        productCategory: 'NON_SUBSCRIPTION',
        productType: 'NON_CONSUMABLE',
        subscriptionPeriod: null,
        defaultOption: null,
        subscriptionOptions: [],
        presentedOfferingIdentifier: 'default',
        presentedOfferingContext: null,
      },
      offeringIdentifier: 'default',
      presentedOfferingContext: { offeringIdentifier: 'default', targetingContext: null, placementIdentifier: null },
    },
  ] as unknown as PurchasesPackage[],
  lifetime: null,
  annual: null,
  sixMonth: null,
  threeMonth: null,
  twoMonth: null,
  monthly: null,
  weekly: null,
};

type RevenueCatContextType = {
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOffering | null;
  isProUser: boolean;
  isLoading: boolean;
  error: string | null;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  refreshCustomerInfo: () => Promise<void>;
  getPackageByIdentifier: (identifier: string) => PurchasesPackage | undefined;
  resetSubscription: () => Promise<void>; // Dev only - reset test purchases
};

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined);

export function RevenueCatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [devOverrideProStatus, setDevOverrideProStatus] = useState<boolean | null>(null); // Dev only
  const lastIdentifiedUserId = useRef<string | null>(null);

  // Check if user has Pro entitlement (check specific ID or any active entitlement for test mode)
  // Dev override takes precedence for testing
  const hasEntitlementFromRC = customerInfo?.entitlements.active[ENTITLEMENT_ID] !== undefined
    || Object.keys(customerInfo?.entitlements.active || {}).length > 0;
  const isProUser = devOverrideProStatus !== null ? devOverrideProStatus : hasEntitlementFromRC;

  // Initialize RevenueCat
  useEffect(() => {
    let removeListener: (() => void) | null = null;

    const initRevenueCat = async () => {
      // In Expo Go, use mock mode with fake offerings
      if (isExpoGo) {
        console.log('[RevenueCat] Running in Expo Go - using mock mode. Build a development build to test real purchases.');
        setOfferings(MOCK_OFFERINGS);
        setIsConfigured(true);
        setIsLoading(false);
        return;
      }

      try {
        // Set log level (use WARN in production to reduce noise)
        Purchases.setLogLevel(LOG_LEVEL.WARN);

        // Configure RevenueCat with API key
        Purchases.configure({
          apiKey: REVENUECAT_API_KEY,
        });
      } catch (err: any) {
        // Silently ignore SDK configuration errors (non-fatal)
        console.log('[RevenueCat] Configuration error (non-fatal):', err.message);
      }

      // Mark as configured regardless - the SDK usually works despite analytics errors
      setIsConfigured(true);

      // Set up listener after configure
      try {
        const listener = Purchases.addCustomerInfoUpdateListener((info) => {
          setCustomerInfo(info);
        }) as { remove: () => void } | void;
        if (listener && typeof listener.remove === 'function') {
          removeListener = () => listener.remove();
        }
      } catch (err) {
        // Listener setup may fail in some cases
      }

      // Fetch initial data
      try {
        await fetchCustomerInfo();
        await fetchOfferings();
      } catch (err) {
        // Silently handle
      }

      setIsLoading(false);
    };

    initRevenueCat();

    return () => {
      removeListener?.();
    };
  }, []);

  // Identify user with RevenueCat when auth state changes
  useEffect(() => {
    // Don't attempt to identify until SDK is configured
    if (!isConfigured) return;

    // Skip in Expo Go
    if (isExpoGo) return;

    // Prevent duplicate identification requests
    if (user?.id === lastIdentifiedUserId.current) return;

    const identifyUser = async () => {
      if (user?.id) {
        try {
          lastIdentifiedUserId.current = user.id;
          await Purchases.logIn(user.id);
          await fetchCustomerInfo();
        } catch (err: any) {
          // Reset so we can retry later
          lastIdentifiedUserId.current = null;
        }
      } else {
        // Log out from RevenueCat when user logs out
        try {
          lastIdentifiedUserId.current = null;
          await Purchases.logOut();
          await fetchCustomerInfo();
        } catch (err) {
          // Ignore logout errors
        }
      }
    };

    identifyUser();
  }, [user?.id, isConfigured]);

  // Fetch customer info
  const fetchCustomerInfo = async () => {
    if (isExpoGo) return; // Skip in Expo Go
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
      setError(null);
    } catch (err) {
      // Silently handle - common during SDK init or rate limiting
    }
  };

  // Fetch offerings
  const fetchOfferings = async () => {
    if (isExpoGo) return; // Skip in Expo Go
    try {
      const fetchedOfferings = await Purchases.getOfferings();
      if (fetchedOfferings.current) {
        setOfferings(fetchedOfferings.current);
      }
      setError(null);
    } catch (err) {
      // Silently handle - offerings may not be available yet
    }
  };

  // Purchase a package
  const purchasePackage = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    // In Expo Go, show a confirmation dialog and simulate purchase
    if (isExpoGo) {
      return new Promise((resolve) => {
        Alert.alert(
          'Confirm Purchase',
          `Subscribe to ${pkg.product.title} for ${pkg.product.priceString}?\n\n(Demo mode - no real charge)`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => resolve(false)
            },
            {
              text: 'Subscribe',
              onPress: () => {
                setDevOverrideProStatus(true);
                resolve(true);
              }
            }
          ]
        );
      });
    }

    try {
      setIsLoading(true);
      setError(null);

      const { customerInfo: newCustomerInfo } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(newCustomerInfo);
      setDevOverrideProStatus(null); // Clear dev override on new purchase

      // Check if purchase was successful (specific entitlement or any active entitlement for test mode)
      const hasEntitlement = newCustomerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined
        || Object.keys(newCustomerInfo.entitlements.active || {}).length > 0;

      return hasEntitlement;
    } catch (err: any) {
      if (err.userCancelled) {
        // User cancelled, not an error
        return false;
      }

      setError(err.message || 'Failed to complete purchase');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Restore purchases
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    // In Expo Go, show a message
    if (isExpoGo) {
      Alert.alert(
        'Demo Mode',
        'No purchases to restore in demo mode.',
        [{ text: 'OK' }]
      );
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const restoredInfo = await Purchases.restorePurchases();
      setCustomerInfo(restoredInfo);
      setDevOverrideProStatus(null); // Clear dev override on restore

      // Check if any entitlements were restored (specific or any for test mode)
      const hasEntitlement = restoredInfo.entitlements.active[ENTITLEMENT_ID] !== undefined
        || Object.keys(restoredInfo.entitlements.active || {}).length > 0;

      if (hasEntitlement) {
        return true;
      }

      setError('No purchases found to restore');
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to restore purchases');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh customer info
  const refreshCustomerInfo = useCallback(async () => {
    await fetchCustomerInfo();
  }, []);

  // Reset subscription (Dev only - for testing)
  const resetSubscription = useCallback(async () => {
    // Simply override pro status locally for testing
    setDevOverrideProStatus(false);
  }, []);

  // Get package by identifier
  const getPackageByIdentifier = useCallback((identifier: string): PurchasesPackage | undefined => {
    if (!offerings?.availablePackages) return undefined;
    return offerings.availablePackages.find(
      (pkg) => pkg.identifier === identifier || pkg.product.identifier === identifier
    );
  }, [offerings]);

  return (
    <RevenueCatContext.Provider
      value={{
        customerInfo,
        offerings,
        isProUser,
        isLoading,
        error,
        purchasePackage,
        restorePurchases,
        refreshCustomerInfo,
        getPackageByIdentifier,
        resetSubscription,
      }}
    >
      {children}
    </RevenueCatContext.Provider>
  );
}

export function useRevenueCat() {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error('useRevenueCat must be used within a RevenueCatProvider');
  }
  return context;
}

// Helper hook to check Pro status
export function useIsProUser() {
  const { isProUser, isLoading } = useRevenueCat();
  return { isProUser, isLoading };
}
