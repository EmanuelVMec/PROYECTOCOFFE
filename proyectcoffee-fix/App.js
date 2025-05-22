import React from 'react';
import { View, ImageBackground, Image, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SecondScreen from './SecondScreen';
import Repositorio from './Repositorio';
import { enableScreens } from 'react-native-screens';
import Footer from './Footer';
import Info from './Info';
import 'react-native-gesture-handler';


enableScreens();

const Stack = createStackNavigator();

const HomeScreen = () => {
  return (
    <ImageBackground
      source={require('./assets/fondop.gif')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Encabezado con los logos y la línea divisoria */}
      <View style={styles.header}>
        <Image
          source={require('./assets/sistemaslogo.png')}
          style={styles.imageLeft}
        />
        <View style={styles.divider} />
        <Image
          source={require('./assets/fiasa.png')}
          style={styles.imageRight}
        />
      </View>

      {/* Logo central */}
      <View style={styles.container}>
        <Image
          source={require('./assets/logoapp.png')}
          style={styles.logoCentral}
        />
      </View>

      {/* Footer */}
      <Footer />
    </ImageBackground>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SecondScreen" component={SecondScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Repositorio" component={Repositorio} options={{ headerShown: false }} />
        <Stack.Screen name="Info" component={Info} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 30,
  },
  imageLeft: {
    left: 7,
    top: 30,
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  imageRight: {
    left: 5,
    top: 27,
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  divider: {
    left: 7,
    top: 30,
    width: 2,
    height: 100,
    backgroundColor: 'gray',
    marginHorizontal: 7,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCentral: {
    top: -75,
    width: 340,
    height: 340,
    resizeMode: 'contain',
  },
});

export default App;
