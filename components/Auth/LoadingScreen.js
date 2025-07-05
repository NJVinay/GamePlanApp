import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// ref: https://www.freecodecamp.org/news/how-to-use-settimeout-in-react-using-hooks
export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    console.log('Loading screen started'); 

    const timer = setTimeout(() => {
      console.log('Navigating to Login screen'); 
      navigation.replace('Login');
    }, 3000); 

    return () => clearTimeout(timer);  //ref: https://github.com/react-navigation/react-navigation/issues/3351
  }, [navigation]);

  return (
    <LinearGradient //ref: https://docs.expo.dev/versions/latest/sdk/linear-gradient
      colors={['#171717', '#444444']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require("../../assets/logo.png")} 
          style={styles.logo}
        />

        {/* Heading */}
        <Text style={styles.heading}>GamePlan</Text>

        {/* Loader */}
        

        {/* Tagline */}
        <Text style={styles.tagline}>Your sports journey begins here</Text>
        <ActivityIndicator
          size="large"
          color="#EDEDED"
          style={styles.loader}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150, 
    height: 150, 
    marginBottom: 20,
    borderRadius: 75, 
    borderWidth: 2, 
    borderColor: '#DA0037', 
    resizeMode: 'cover', 
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#EDEDED',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#DA0037',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  loader: {
    marginVertical: 20,
  },
  tagline: {
    fontSize: 16,
    color: '#EDEDED',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
