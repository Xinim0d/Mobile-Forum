import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native';

// Importuokite ekranus
import AuthScreen from './screens/AuthScreen';
import AdListScreen from './screens/AdListScreen';
import SettingsScreen from './screens/SettingsScreen';
import AdFormScreen from './screens/AdFormScreen';

// Importuokite kontekstus
import { AdsProvider } from './AdsContext';
import { AuthProvider, useAuth, COLORS } from './AuthContext'; // Importuotas COLORS

// Sukurti navigacijos steką
const Stack = createStackNavigator();

// Pagrindinė navigacijos konfigūracija (ekranai, kurie matomi prisijungus)
function AppStack() {
  const { COLORS } = useAuth(); 

  return (
    <Stack.Navigator
      initialRouteName="AdList"
      screenOptions={{
        headerStyle: { 
          backgroundColor: COLORS.card, 
          borderBottomWidth: 1, 
          borderBottomColor: '#33334f' 
        },
        headerTintColor: COLORS.text, 
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: COLORS.background 
        }
      }}
    >
      <Stack.Screen 
        name="AdList" 
        component={AdListScreen} 
        options={{ headerShown: false }} // Custom antraštė
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Nustatymai' }} 
      />
      <Stack.Screen 
        name="AddAd" 
        component={AdFormScreen} 
        options={{ title: 'Pridėti Skelbimą' }} 
      />
      <Stack.Screen 
        name="EditAd" 
        component={AdFormScreen} 
        options={{ title: 'Redaguoti Skelbimą' }} 
      />
    </Stack.Navigator>
  );
}

// Pagrindinis komponentas
function RootApp() {
  // isLoaded rodo ar vartotojo duomenys jau pakrauti is AsyncStorage
  const { user, isLoaded } = useAuth(); 

  // Rodyti krovimą, kol duomenys nėra pakrauti (isLoaded yra undefined)
  if (!isLoaded) { 
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />
      
      <NavigationContainer>
        {/* user yra null arba objektas (prisijungęs/svečias) */}
        {user ? <AppStack /> : <AuthScreen />}
      </NavigationContainer>
    </SafeAreaView>
);
}


// Apsukame visą aplikaciją kontekstais
export default function App() {
  return (
    <AuthProvider>
      <AdsProvider>
        <RootApp />
      </AdsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});