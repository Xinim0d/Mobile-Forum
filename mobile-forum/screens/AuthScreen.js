import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useAuth } from '../AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const AuthScreen = () => {
  const { register, login, loginAsGuest, COLORS } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password || (isRegistering && !username)) {
      Alert.alert("Klaida", "Prašome užpildyti visus laukelius.");
      return;
    }
    setIsLoading(true);
    let success = false;
    
    if (isRegistering) {
      success = await register(username, email, password);
    } else {
      success = await login(email, password);
    }

    setIsLoading(false);
    if (success) {
      // Navigacija bus valdoma App.js po user būsenos pasikeitimo
    }
  };

  return (
    <KeyboardAwareScrollView 
      contentContainerStyle={[styles.container, { backgroundColor: COLORS.background }]}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <View style={styles.header}>
        <FontAwesome5 name="gamepad" size={64} color={COLORS.primary} />
        <Text style={[styles.title, { color: COLORS.text }]}>GameSwap</Text>
        <Text style={[styles.subtitle, { color: COLORS.secondaryText }]}>Skelbimai žaidimų mėgėjams</Text>
      </View>

      <View style={[styles.card, { backgroundColor: COLORS.card }]}>
        <Text style={[styles.cardTitle, { color: COLORS.text }]}>
          {isRegistering ? 'Registracija' : 'Prisijungimas'}
        </Text>

        {isRegistering && (
          <TextInput
            style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text }]}
            placeholder="Vartotojo vardas"
            placeholderTextColor={COLORS.secondaryText}
            value={username}
            onChangeText={setUsername}
          />
        )}

        <TextInput
          style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text }]}
          placeholder="El. paštas"
          placeholderTextColor={COLORS.secondaryText}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text }]}
          placeholder="Slaptažodis"
          placeholderTextColor={COLORS.secondaryText}
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.primary }]}
          onPress={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.card} />
          ) : (
            <Text style={[styles.buttonText, { color: COLORS.card }]}>
              {isRegistering ? 'Registruotis' : 'Prisijungti'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setIsRegistering(prev => !prev)}
          style={styles.linkButton}
        >
          <Text style={[styles.linkText, { color: COLORS.secondaryText }]}>
            {isRegistering ? 'Jau turite paskyrą? Prisijunkite.' : 'Neturite paskyros? Registruokitės.'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: COLORS.secondaryText }]} />
          <Text style={[styles.dividerText, { color: COLORS.secondaryText }]}>ARBA</Text>
          <View style={[styles.divider, { backgroundColor: COLORS.secondaryText }]} />
        </View>

        <TouchableOpacity
          style={[styles.guestButton, { borderColor: COLORS.secondaryText }]}
          onPress={loginAsGuest}
        >
          <FontAwesome5 name="user-secret" size={18} color={COLORS.secondaryText} style={{ marginRight: 10 }} />
          <Text style={[styles.linkText, { color: COLORS.secondaryText, fontWeight: 'bold' }]}>
            Prisijungti kaip svečiui
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
  },
  card: {
    width: '100%',
    padding: 25,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    padding: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  linkText: {
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
  },
  guestButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

export default AuthScreen;