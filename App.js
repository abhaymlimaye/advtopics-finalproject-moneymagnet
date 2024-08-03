import { StyleSheet, View, Text, Alert, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import NavContainer from './screens/NavContainer';
import Authentication from './screens/Authentication';
import realtimeDatabase from './data/RealtimeDatabase';

export default function App() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    realtimeDatabase.listenAuthStatus(user => {
        setIsAuthenticated(!!user);
        setCheckingAuth(false);
    });
  }, []);

  return (
    <SafeAreaProvider><SafeAreaView>
      <View style={styles.container}>
          {checkingAuth ? (
              <View style={styles.splashContainer}>
                  <Image
                      source={require('./assets/splash.png')} // Update the path
                      style={styles.splashImage}
                  />
              </View>
          ) : !checkingAuth && (isAuthenticated ? (
              <NavContainer />
          ) : (
              <Authentication onSuccess={() => setIsAuthenticated(true)} />
          ))}
      </View>
    </SafeAreaView></SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
  },
});
