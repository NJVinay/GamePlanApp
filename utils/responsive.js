import { Dimensions, Platform } from 'react-native';

/**
 * Responsive utilities for adapting to different screen sizes and aspect ratios
 */

export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

export const getResponsiveSize = () => {
  const { width, height } = getScreenDimensions();
  const aspectRatio = width / height;
  
  // Determine device type
  const isSmallDevice = width < 375;
  const isMediumDevice = width >= 375 && width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  
  // Determine orientation
  const isPortrait = height > width;
  const isLandscape = width > height;
  
  return {
    width,
    height,
    aspectRatio,
    isSmallDevice,
    isMediumDevice,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    isWeb: Platform.OS === 'web',
    isMobile: Platform.OS !== 'web',
  };
};

/**
 * Calculate responsive font size based on screen width
 */
export const responsiveFontSize = (baseFontSize) => {
  const { width, isWeb } = getResponsiveSize();
  
  if (isWeb && width > 768) {
    // Desktop/tablet web - use base size
    return baseFontSize;
  }
  
  // Scale font size based on screen width (375px is base)
  const scale = width / 375;
  return Math.round(baseFontSize * scale);
};

/**
 * Calculate responsive spacing based on screen width
 */
export const responsiveSpacing = (baseSpacing) => {
  const { width, isDesktop } = getResponsiveSize();
  
  if (isDesktop) {
    return baseSpacing; // Keep consistent on desktop
  }
  
  const scale = width / 375;
  return Math.round(baseSpacing * scale);
};

/**
 * Get maximum content width for web to prevent stretching
 */
export const getMaxContentWidth = () => {
  const { isWeb, isDesktop, isTablet } = getResponsiveSize();
  
  if (!isWeb) return '100%';
  if (isDesktop) return 800;
  if (isTablet) return 600;
  return '100%';
};

/**
 * Get responsive banner height based on screen size
 */
export const getBannerHeight = () => {
  const { width, isWeb, isDesktop } = getResponsiveSize();
  
  if (isWeb && isDesktop) {
    return 200; // Fixed height on desktop
  }
  
  // Mobile: 40% of screen width
  return width * 0.4;
};
