import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../AuthContext'; 

// PRIDEDAMA ŠI KONSTANTA: 
// Tai yra GREITAS sprendimas, leidžiantis StyleSheet.create pasiekti spalvas.
// Spalvų tema (kopijuojama iš AuthContext, kad būtų išvengta "COLORS is not defined" klaidos)
const COLORS = {
  background: '#12121e',
  accent: '#00ff7f', 
  text: '#f5f5f5',
  card: '#1e1e2d',
  button: '#00cc66',
  error: '#ff5555',
};

export default function AuthScreen() {
  // Gaunamas hook'as, kuriame yra funkcija 'login' ir 'loading' būsena
  // NENAUDOJAME COLORS iš useAuth(), nes jau jį apibrėžėme viršuje stiliams
  const { login, loading } = useAuth(); 
  
  const [username, setUsername] = useState('test');
  const [password, setPassword] = useState('123');
  const [rememberMe, setRememberMe] = useState(true); 
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setError('');
    setIsLoggingIn(true);
    
    // Simuliuoti tinklo uždelsimą
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    const success = await login(username, password, rememberMe);

    if (!success) {
      setError('Neteisingas vartotojo vardas arba slaptažodis. Bandykite: test / 123');
    }
    setIsLoggingIn(false);
  };

  if (loading) {
    // Naudojame lokaliai apibrėžtą COLORS
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text 
        style={styles.title}
      >
        GameSwap 🎮
      </Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Prisijungimas</Text>

        <TextInput
          style={styles.input}
          placeholder="Vartotojo vardas (test)"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Slaptažodis (123)"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={[styles.checkbox, rememberMe && styles.checkboxChecked]} 
            onPress={() => setRememberMe(!rememberMe)}
            disabled={isLoggingIn}
          >
            {rememberMe && <Text style={styles.checkboxText}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.label}>Prisiminti mane</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, isLoggingIn && { opacity: 0.7 }]} 
          onPress={handleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.buttonText}>Prisijungti</Text>
          )}
        </TouchableOpacity>
        
        <Text style={styles.registerText}>Neturite paskyros? Registracija greitai bus prieinama.</Text>

      </View>
    </View>
  );
}

// STILIAI dabar pasiekia aukščiau apibrėžtą COLORS konstantą
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.accent,
    marginBottom: 30,
    textShadowColor: 'rgba(0, 255, 127, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.card,
    borderRadius: 15,
    padding: 25,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#33334f',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#33334f',
    color: COLORS.text,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.button,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.button,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  registerText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: COLORS.accent,
  },
  checkboxText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
  },
});