import { Button, TouchableOpacity, View } from "react-native";
import Header from "@/components/Header";
import ThemedScroller from "@/components/ThemeScroller";
import Section from "@/components/layout/Section";
import Icon from "@/components/Icon";
import AnimatedView from "@/components/AnimatedView";
import ThemedText from "@/components/ThemedText";
import { SvgXml } from 'react-native-svg';
import { US, ES } from 'country-flag-icons/string/3x2';
import { useTranslation } from "@/hooks/useTranslation";

interface Language {
    title: string;
    nativeName: string;
    code: string;
    flag: string;
}

export default function LanguagesScreen() {
    const { t, language, setLanguage, availableLanguages } = useTranslation();

    const languageFlags: Record<string, string> = {
        en: US,
        es: ES,
    };

    const languages: Language[] = availableLanguages.map((lang) => ({
        title: lang.name,
        nativeName: lang.nativeName,
        code: lang.code.toUpperCase(),
        flag: languageFlags[lang.code] || US,
    }));

    const handleLanguageChange = (langCode: string) => {
        setLanguage(langCode);
    };

    return (
        <>
            <Header showBackButton title={t('languages.title')} />
            <ThemedScroller className="p-global">
                <Section title={t('languages.selectLanguage')} titleSize="4xl" className="mt-4 mb-10" />
                {languages.map((lang, index) => (
                    <LanguageItem 
                        key={index} 
                        title={lang.title} 
                        nativeName={lang.nativeName}
                        code={lang.code} 
                        flag={lang.flag} 
                        selected={language === lang.code.toLowerCase()} 
                        onSelect={() => handleLanguageChange(lang.code.toLowerCase())} 
                    />
                ))}
            </ThemedScroller>
        </>
    )
}

interface LanguageItemProps {
    title: string;
    nativeName: string;
    code: string;
    flag: string;
    selected: boolean;
    onSelect: () => void;
}

const LanguageItem = ({ title, nativeName, code, flag, selected, onSelect }: LanguageItemProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSelect}
            className={`flex-row items-center py-6 border-b border-border ${selected ? 'opacity-100' : 'opacity-100 '}`}
        >
            <View className="w-7 h-7 mr-6 rounded overflow-hidden">
                <SvgXml 
                    xml={flag} 
                    width={28} 
                    height={28}
                />
            </View>
            <View className="flex-1">
                <ThemedText className='text-lg font-bold'>{nativeName}</ThemedText>
                <ThemedText className='text-sm opacity-60'>{title}</ThemedText>
            </View>
            {selected &&
                <AnimatedView animation="bounceIn" duration={500}>
                    <Icon name="Check" size={25} />
                </AnimatedView>
            }
        </TouchableOpacity>
    );
};

