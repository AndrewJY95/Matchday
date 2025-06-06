import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image, Platform } from 'react-native';
import { useRouter, usePathname, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const navigation = useNavigation();
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  // Updated check for main tab screens
  const mainTabRoutes = ['/', '/chat', '/profile', '/fixtures', '/(tabs)'];
  const isMainTab = mainTabRoutes.some(route => 
    currentPath === route || 
    currentPath.startsWith('/(tabs)') || 
    currentPath === ''
  );
  
  const canGoBack = navigation.canGoBack();

  const handleBackPress = () => {
    router.back();
    // Force update the current path after navigation
    setTimeout(() => {
      if (Platform.OS === 'web') {
        setCurrentPath(window.location.pathname);
      } else {
        setCurrentPath(pathname);
      }
    }, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Left side - Back button and Logo */}
        <View style={styles.leftSection}>
          {(!isMainTab && canGoBack) && (
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Ionicons name="chevron-back" size={18} color="#fff" />
            </TouchableOpacity>
          )}
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>
        
        {/* Center - Empty for now */}
        <View style={styles.centerSection}>
        </View>
        
        {/* Right side - Future actions */}
        <View style={styles.rightSection}>
          {/* Space for notifications, settings, etc. */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#08101d',
    paddingTop: StatusBar.currentHeight || 28,
  },
  header: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#08101d',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginTop: -12, // Align with logo
  },
  centerSection: {
    flex: 2,             // Changed from flex: 1 to flex: 2
    alignItems: 'center', // Keep center alignment for future use
  },
  rightSection: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    marginTop: -8, // Adjust to match logo position
  },
  backButton: {
    padding: 8,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -12, // Match logo position
    marginLeft: -10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    borderRadius: 25,
    width: 50,
    height: 50,
    marginLeft: -10,
    marginTop: -15,
  },
});

export default Header;