import { StyleSheet, View, Text, Image, Alert, TouchableOpacity } from 'react-native';
import realtimeDatabase from '../data/RealtimeDatabase';

export function Header() {
  const onLogoutPress = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: logout },
    ]);
  };

  const logout = async () => {
    const result = await realtimeDatabase.logout();
    if (!result.success) {
      Alert.alert('Logout Failed', result.message);
    }
  }

  return (
      <View style={styles.container}>
        <View style={styles.brand}>
          <Image source={require('../assets/icon.png')} style={styles.logoImage}/>
          <Text style={styles.headerText}>Money Magnet</Text>
        </View>   

        <TouchableOpacity onPress={onLogoutPress}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
    },
    brand: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoImage: {
      width: 30,
      height: 30,
      resizeMode: 'contain',
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginStart: 15,
      //color: theme.colors.blue,
    },
    logout: {
      fontSize: 15,
      color: 'gray'
    }
});