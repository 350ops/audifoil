import { vars } from "nativewind";

// Airbnb Experiences style: white cards, black titles, grey body, pink CTA
export const themes = {
  light: vars({
    "--color-primary": "#000000",
    "--color-invert": "#ffffff",
    "--color-secondary": "#ffffff",
    "--color-background": "#F7F7F7",
    "--color-darker": "#EBEBEB",
    "--color-text": "#000000",
    "--color-text-muted": "rgba(0, 0, 0, 0.65)",
    "--color-highlight": "#FF0039",
    "--color-cta": "#FF0039",
    "--color-border": "rgba(0, 0, 0, 0.12)",
  }),
  dark: vars({
    "--color-primary": "#ffffff",
    "--color-invert": "#000000",
    "--color-secondary": "#1A1A1A",
    "--color-background": "#000000",
    "--color-darker": "#0D0D0D",
    "--color-text": "#ffffff",
    "--color-text-muted": "rgba(255, 255, 255, 0.65)",
    "--color-highlight": "#FF0039",
    "--color-cta": "#FF0039",
    "--color-border": "rgba(255, 255, 255, 0.12)",
  }),
}; 