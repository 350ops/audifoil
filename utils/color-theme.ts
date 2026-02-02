import { vars } from "nativewind";

// Fly Over the Indian Ocean - Premium E-Foil Experience
// Ocean blue + Carbon gray + Paradise vibes
export const themes = {
  light: vars({
    "--color-primary": "#1A1A1A",       // Carbon black
    "--color-invert": "#ffffff",        // White
    "--color-secondary": "#ffffff",     // Card backgrounds
    "--color-background": "#F8FAFB",    // Off-white paradise
    "--color-darker": "#F0F4F5",        // Slightly darker
    "--color-text": "#1A1A1A",          // Carbon text
    "--color-highlight": "#0077B6",     // Deep ocean blue
    "--color-border": "rgba(0, 0, 0, 0.08)",
  }),
  dark: vars({
    "--color-primary": "#ffffff",       // White
    "--color-invert": "#0A0A0A",        // Deep black
    "--color-secondary": "#1E2A32",     // Ocean dark card
    "--color-background": "#0A1218",    // Deep ocean night
    "--color-darker": "#050A0D",        // Deepest ocean
    "--color-text": "#ffffff",          // White text
    "--color-highlight": "#00A6F4",     // Bright ocean blue
    "--color-border": "rgba(255, 255, 255, 0.1)",
  }),
}; 