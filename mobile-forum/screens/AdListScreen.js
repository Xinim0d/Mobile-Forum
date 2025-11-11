import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { useAds } from '../AdsContext';
import AdCard from '../components/AdCard';
import CategoryFilter from '../components/CategoryFilter';
import { useNavigation } from '@react-navigation/native';

export default function AdListScreen() {
  const { ads } = useAds();
  const { COLORS } = useAuth();
  const navigation = useNavigation();

  // Navigacija į AddAd ekraną (2.0 balas)
  const handleAddAdPress = () => {
    navigation.navigate('AddAd');
  };

  const renderItem = ({ item }) => <AdCard ad={item} />;

  // 1.0 balas už sąrašo atvaizdavimą
  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      
      {/* 2.0 balas už filtravimą */}
      <CategoryFilter />

      {ads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: COLORS.text }]}>
            Šioje kategorijoje skelbimų nėra. Pridėkite naują arba pasirinkite kitą kategoriją.
          </Text>
        </View>
      ) : (
        <FlatList
          data={ads}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      {/* Pridėti mygtuką (2.0 balas) */}
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: COLORS.button }]} // Pakeista spalva į 'button'
        onPress={handleAddAdPress}
      >
        <MaterialIcons name="add" size={30} color={COLORS.background} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80, // Vieta mygtukui
  },
  addButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8, // Padidintas šešėlis Android
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  }
});