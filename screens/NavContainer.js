import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import theme from '../theme';
import { FontAwesome5 } from '@expo/vector-icons';
import { Discover } from './Discover';
import { Holdings } from './Holdings';
import { Orders } from './Orders';
import { Header } from '../partials/Header';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function NavContainer() {
    return (
        <NavigationContainer>

          <Header/>
          
          <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: styles.tabBarStyle }}>      
            <Tab.Screen name='Discover' 
                options={{ tabBarIcon: ({color})=> (<FontAwesome5 name="search-dollar" size={15} color={color}/>) }}
                component={Discover}
                initialParams={{ isNewOrderPlaced: false }}
            />

            <Tab.Screen name='Holdings'
                options={{ tabBarIcon: ({color})=> (<FontAwesome5 name="th-list" size={15} color={color}/>) }}
                component={Holdings}
                initialParams={{ isNewOrderPlaced: false }}
            />

            <Tab.Screen name='Orders'
              options={{ tabBarIcon: ({color})=> (<FontAwesome5 name="shopping-cart" size={15} color={color}/>) }}
              component={Orders}
              initialParams={{ isNewOrderPlaced: false }}
            />
          </Tab.Navigator>

        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    tabBarStyle: {
      backgroundColor: theme.colors.lightGray,
    },
  });