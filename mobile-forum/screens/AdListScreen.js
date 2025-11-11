import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import AdCard from '../components/AdCard';
import CategoryFilter from '../components/CategoryFilter';
import { useAuth } from '../AuthContext';
import { useAds } from '../AdsContext';
import { FontAwesome5 } from '@expo/vector-icons';

// --- Antraštės komponentas su atsijungimu ir vartotojo info ---
const AdListHeader = ({ user, logout, COLORS, navigation, showMyAds, setShowMyAds, searchTerm, setSearchTerm }) => {
  const handleLogout = () => {
    Alert.alert(
      "Atsijungti",
      "Ar tikrai norite atsijungti?",
      [
        { text: "Atšaukti", style: "cancel" },
        { text: "Atsijungti", style: "destructive", onPress: logout }
      ]
    );
  };
  
  // Patikrinimas, kad mygtukai būtų rodomi tik prisijungusiam vartotojui (ne svečiui)
  const isAuthenticated = user && !user.isGuest;

  return (
    <View style={[headerStyles.headerContainer, { backgroundColor: COLORS.card }]}>
      <View style={headerStyles.titleSection}>
        <Text style={[headerStyles.headerTitle, { color: COLORS.text }]}>GameSwap</Text>
        <Text style={[headerStyles.userName, { color: COLORS.secondaryText }]}>
          Sveiki, {user ? user.username : 'Svečias'}
        </Text>
      </View>
      
      <View style={headerStyles.actions}>
        {isAuthenticated && (
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={headerStyles.iconButton}>
            <FontAwesome5 name="cog" size={20} color={COLORS.secondaryText} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleLogout} style={headerStyles.iconButton}>
          <FontAwesome5 name="sign-out-alt" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
// -----------------------------------------------------

const AdListScreen = ({ navigation }) => {
  const { user, logout, COLORS } = useAuth();
  const { 
    ads, 
    categories,
    selectedCategory, 
    setSelectedCategory,
    showMyAds, 
    setShowMyAds, 
    searchTerm, 
    setSearchTerm 
  } = useAds();

  const isAuthenticated = user && !user.isGuest;

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}> 
      {/* Custom Antraštė */}
      <AdListHeader
        user={user}
        logout={logout}
        COLORS={COLORS}
        navigation={navigation}
        showMyAds={showMyAds}
        setShowMyAds={setShowMyAds}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <View style={[styles.controlsContainer, { backgroundColor: COLORS.card }]}>
        {/* Paieška */}
        <TextInput
          style={[styles.searchInput, { backgroundColor: COLORS.background, color: COLORS.text }]}
          placeholder="Paieška pagal pavadinimą, kainą..."
          placeholderTextColor={COLORS.secondaryText}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {/* Filtravimas pagal kategorijas */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <View style={styles.bottomControlsRow}>
          {/* Filtras: Rodyti tik mano skelbimus (tik prisijungusiems) */}
          {isAuthenticated && (
            <View style={styles.switchContainer}>
              <Text style={[styles.switchText, { color: COLORS.text }]}>Mano skelbimai</Text>
              <Switch
                onValueChange={setShowMyAds}
                value={showMyAds}
                trackColor={{ false: COLORS.secondaryText, true: COLORS.primary }}
                thumbColor={COLORS.card}
              />
            </View>
          )}
          
          {/* Pridėti skelbimą mygtukas (tik prisijungusiems) */}
          {isAuthenticated && (
            <TouchableOpacity 
              onPress={() => navigation.navigate('AddAd')} 
              style={[styles.addButton, {backgroundColor: COLORS.primary}]}
            >
              <FontAwesome5 name="plus-circle" size={18} color={COLORS.card} style={styles.addIcon} /> 
              <Text style={[styles.addButtonText, {color: COLORS.card}]}>Pridėti</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>


      <FlatList
        data={ads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AdCard ad={item} navigation={navigation} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <Text style={[styles.emptyText, {color: COLORS.secondaryText}]}>
            Skelbimų pagal pasirinktus filtrus nerasta.
          </Text>
        )}
      />
    </View>
  );
};

// Antraštės stiliai
const headerStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 40, 
    borderBottomWidth: 1,
    borderBottomColor: '#33334f',
  },
  titleSection: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
  }
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlsContainer: {
    padding: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 10,
    elevation: 5,
  },
  searchInput: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  bottomControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    marginRight: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 2,
  },
  addIcon: {
    marginRight: 5,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  }
});

export default AdListScreen;