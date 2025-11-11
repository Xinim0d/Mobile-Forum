import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

// Importuokite ekranus
import AuthScreen from './screens/AuthScreen';
import AdListScreen from './screens/AdListScreen';
import SettingsScreen from './screens/SettingsScreen';
import AdFormScreen from './screens/AdFormScreen';

// Importuokite kontekstus
import { AdsProvider } from './AdsContext';
import { AuthProvider, useAuth } from './AuthContext';

// Sukurti navigacijos steką
const Stack = createStackNavigator();

// Pagrindinė navigacijos konfigūracija (ekranai, kurie matomi prisijungus)
function AppStack() {
  const { COLORS } = useAuth(); // Gauti spalvas iš konteksto

  return (
    <Stack.Navigator
      initialRouteName="AdList"
      screenOptions={{
        headerStyle: { 
          backgroundColor: COLORS.card, 
          borderBottomWidth: 1, 
          borderBottomColor: '#33334f' 
        },
        headerTintColor: COLORS.text, // Teksto ir mygtukų spalva antraštėje
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: COLORS.background // Nustatykite bendrą ekrano foną
        }
      }}
    >
      <Stack.Screen 
        name="AdList" 
        component={AdListScreen} 
        options={{ title: 'Skelbimai' }}
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
      {/* EditAd naudoja tą patį komponentą, bet su skirtingu pavadinimu */}
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
  const { user, loading, COLORS } = useAuth();
  
  // Rodyti tik prisijungimo ekraną, jei vartotojas neprisijungęs ir nebekraunama
  if (!loading && !user) {
    return <AuthScreen />;
  }

  // Rodyti pagrindinę aplikaciją, jei vartotojas prisijungęs arba kraunama
  return (
    // SafeAreaView užtikrina, kad turinys nepersidengtų su sistemos elementais (pvz., pranešimų juosta)
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <NavigationContainer>
        {/* Įdėjus AuthProvider viduje gautumėte klaidą, todėl tikriname 'user' čia, bet AppStack vis tiek turi naudoti useAuth() */}
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