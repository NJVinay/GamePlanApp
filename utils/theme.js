export const theme = {
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceLight: '#2C2C2C',
    primary: '#E50914', // A more vibrant, premium red
    primaryDark: '#B20710',
    primaryLight: 'rgba(229, 9, 20, 0.15)',
    secondary: '#EDEDED',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textMuted: '#808080',
    border: '#333333',
    error: '#CF6679',
    success: '#03DAC6',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 20,
    round: 50,
  },
  typography: {
    fontFamily: {
      regular: 'System', // Can be updated if custom fonts are added
      bold: 'System',
    },
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
    weight: {
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#E50914', // Colored shadow for primary buttons
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};
