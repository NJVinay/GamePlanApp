import React from 'react';
import { ScrollView, View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * WebResponsiveContainer - A wrapper component that makes screens web-responsive
 * Provides automatic scrolling and proper sizing for both mobile and web
 */
export default function WebResponsiveContainer({ 
  children, 
  style, 
  contentStyle,
  showScrollIndicator = true,
  maxWidth = 800,
  useGradient = true 
}) {
  const content = (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { 
          maxWidth: Platform.OS === 'web' ? maxWidth : '100%',
          paddingBottom: Platform.OS === 'web' ? 40 : 20,
        },
        contentStyle
      ]}
      showsVerticalScrollIndicator={showScrollIndicator}
      style={styles.scrollView}
    >
      {children}
    </ScrollView>
  );

  if (useGradient) {
    return (
      <LinearGradient 
        colors={['#171717', '#444444']} 
        style={[styles.container, style]}
      >
        {content}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
});
