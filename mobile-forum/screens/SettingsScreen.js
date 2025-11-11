// screens/SettingsScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth, COLORS } from '../AuthContext';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={[styles.container, {backgroundColor: COLORS.background}]}>
      <Text style={[styles.title, {color: COLORS.text}]}>Nustatymai</Text>
      <Text style={[styles.userInfo, {color: COLORS.text}]}>Prisijungęs kaip: {user?.username || 'Nenurodyta'}</Text>
      <Text style={[styles.userInfo, {color: COLORS.text}]}>Vartotojo ID: {user?.id}</Text>

      <TouchableOpacity style={[styles.logoutButton, {backgroundColor: COLORS.button}]} onPress={() => signOut()}>
        <Text style={styles.logoutText}>Atsijungti</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20 },
  title:{ fontSize:22, fontWeight:'700', marginBottom:10 },
  userInfo:{ fontSize:16, marginBottom:6 },
  logoutButton:{ padding:12, borderRadius:10, marginTop:20, alignItems:'center' },
  logoutText:{ color:'#12121e', fontWeight:'700' }
});
