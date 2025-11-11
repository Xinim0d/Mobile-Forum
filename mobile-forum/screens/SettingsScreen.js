import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../AuthContext';

export default function SettingsScreen() {
  const { logout, COLORS, user } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      
      <View style={styles.userInfoContainer}>
        <Text style={[styles.title, { color: COLORS.text }]}>Nustatymai</Text>
        <Text style={[styles.userInfo, { color: COLORS.text }]}>Prisijungęs kaip: {user?.username || 'Nenurodyta'}</Text>
        <Text style={[styles.userInfo, { color: COLORS.text }]}>Vartotojo ID: {user?.id}</Text>
      </View>

      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: COLORS.error }]} 
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Atsijungti</Text>
      </TouchableOpacity>
      
      <Text style={[styles.versionText, { color: COLORS.text }]}>
        Versija 1.0
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
    padding: 20,
    borderRadius: 12,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  versionText: {
    marginTop: 'auto', // Stumia elementą į apačią
    fontSize: 12,
    opacity: 0.6,
  }
});