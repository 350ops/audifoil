import { useTheme } from './ThemeContext';

// Airbnb Experiences style: white cards, black titles, grey body, pink CTA
export const useThemeColors = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return {
    icon: isDark ? 'white' : '#000000',
    bg: isDark ? '#000000' : '#F7F7F7',
    invert: isDark ? '#000000' : '#ffffff',
    secondary: isDark ? '#1A1A1A' : '#ffffff',
    state: isDark ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0.3)',
    sheet: isDark ? '#1A1A1A' : '#ffffff',
    highlight: '#0F424D',
    cta: '#FF0039',
    lightDark: isDark ? '#1A1A1A' : '#ffffff',
    border: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    text: isDark ? '#ffffff' : '#000000',
    textMuted: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
    placeholder: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
    switch: isDark ? 'rgba(255,255,255,0.4)' : '#ccc',
    chatBg: isDark ? '#1A1A1A' : '#EBEBEB',
    isDark,
  };
};

export default useThemeColors;