import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAds } from '../AdsContext';
import { useAuth } from '../AuthContext'; 

// Visos galimos kategorijos
const categories = ['Visi', 'PlayStation', 'Xbox', 'Nintendo', 'PC', 'Kitos'];

export default function CategoryFilter() {
  const { selectedCategory, setSelectedCategory } = useAds();
  const { COLORS } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: COLORS.card }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.button,
              { borderColor: COLORS.accent },
              selectedCategory === category && { backgroundColor: COLORS.accent }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text 
              style={[
                styles.buttonText, 
                selectedCategory === category ? { color: COLORS.background } : { color: COLORS.text }
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#33334f',
    elevation: 2, // Šešėlis Android
  },
  scrollContent: {
    paddingHorizontal: 10, // Papildoma erdvė kraštuose
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});