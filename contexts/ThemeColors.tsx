import { useTheme } from './ThemeContext';

// Fly Over the Indian Ocean - Premium E-Foil Experience
// Ocean blue + Carbon gray + Paradise vibes
export const useThemeColors = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return {
    // Core colors
    icon: isDark ? 'white' : '#1A1A1A',
    bg: isDark ? '#0A1218' : '#F8FAFB',
    invert: isDark ? '#0A0A0A' : '#ffffff',
    secondary: isDark ? '#1E2A32' : '#ffffff',
    state: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
    sheet: isDark ? '#1E2A32' : '#ffffff',
    highlight: isDark ? '#00A6F4' : '#0077B6', // Ocean blue
    lightDark: isDark ? '#1E2A32' : 'white',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    text: isDark ? 'white' : '#1A1A1A',
    placeholder: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
    switch: isDark ? 'rgba(255,255,255,0.4)' : '#ccc',
    chatBg: isDark ? '#1E2A32' : '#F0F4F5',
    
    // Brand-specific colors
    oceanBlue: '#0077B6',
    oceanLight: '#00A6F4',
    carbon: '#1A1A1A',
    carbonLight: '#2D2D2D',
    lagoon: '#48CAE4',
    coral: '#FF6B6B',
    sand: '#F8FAFB',
    
    isDark
  };
};

export default useThemeColors;