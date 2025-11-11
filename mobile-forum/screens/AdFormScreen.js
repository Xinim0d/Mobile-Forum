import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAds } from '../AdsContext';
import { useAuth } from '../AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';

// Kategorijų sąrašas
const categories = ['PlayStation', 'Xbox', 'Nintendo', 'PC', 'Kitos'];

export default function AdFormScreen() {
  const { addAd, updateAd } = useAds();
  const { user, COLORS } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  
  // Nustatyti, ar tai redagavimo režimas
  const existingAd = route.params?.ad;
  const isEditMode = !!existingAd;

  // Išimti '€' ženklą, kad galėtume naudoti TextInput
  const initialPrice = existingAd ? existingAd.price.replace('€', '').replace(',', '.') : '';

  const [title, setTitle] = useState(existingAd ? existingAd.title : '');
  const [description, setDescription] = useState(existingAd ? existingAd.description : '');
  const [price, setPrice] = useState(initialPrice);
  const [category, setCategory] = useState(existingAd ? existingAd.category : categories[0]);
  const [error, setError] = useState('');

  // Nustatyti ekrano pavadinimą
  useEffect(() => {
    navigation.setOptions({ 
        title: isEditMode ? 'Redaguoti Skelbimą' : 'Pridėti Skelbimą' 
    });
  }, [isEditMode, navigation]);

  const handleSubmit = () => {
    if (!title || !description || !price) {
      setError('Užpildykite visus laukus!');
      return;
    }
    
    const numericPrice = parseFloat(price.replace(',', '.'));

    if (isNaN(numericPrice) || numericPrice <= 0) {
        setError('Neteisinga kaina.');
        return;
    }

    // Sukurti naują skelbimo objektą
    const adData = {
      title: title.trim(),
      description: description.trim(),
      price: `${numericPrice.toFixed(2)}€`, // Formatavimas į du skaičius po kablelio ir €
      category,
    };

    if (isEditMode) {
      // Redaguoti skelbimą (1.0 balas)
      updateAd({ ...existingAd, ...adData });
    } else {
      // Pridėti naują skelbimą (1.0 balas)
      addAd(adData, user);
    }
    
    // Grįžti į sąrašo ekraną
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Kompensuoti antraštės aukštį iOS
    >
      <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: COLORS.background }]}>
        <View style={styles.formCard}>
          <Text style={[styles.label, { color: COLORS.text }]}>Pavadinimas</Text>
          <TextInput
            style={[styles.input, { backgroundColor: COLORS.card, color: COLORS.text }]}
            placeholder="Pvz.: Parduodu PS5 žaidimą"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.label, { color: COLORS.text }]}>Aprašymas</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: COLORS.card, color: COLORS.text }]}
            placeholder="Išsamus aprašymas..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={[styles.label, { color: COLORS.text }]}>Kaina (€)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: COLORS.card, color: COLORS.text }]}
            placeholder="50.00"
            placeholderTextColor="#999"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <Text style={[styles.label, { color: COLORS.text }]}>Kategorija</Text>
          {/* Picker komponentas (1.0 balas) */}
          <View style={[styles.pickerContainer, { backgroundColor: COLORS.card, borderColor: COLORS.text }]}>
              <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                  style={[styles.picker, { color: COLORS.text }]}
                  dropdownIconColor={COLORS.accent}
              >
                  {categories.map((cat) => (
                      <Picker.Item key={cat} label={cat} value={cat} />
                  ))}
              </Picker>
          </View>
          
          {error ? <Text style={[styles.errorText, { color: COLORS.error }]}>{error}</Text> : null}

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: COLORS.button }]} 
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>
              {isEditMode ? 'Išsaugoti Pakeitimus' : 'Pridėti Skelbimą'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    flexGrow: 1, // Leidžia ScrollView augti
  },
  formCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#1e1e2d',
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#33334f',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top', 
  },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden', 
  },
  picker: {
    height: Platform.OS === 'ios' ? 200 : 50, // iOS naudoja didesnį ratuką
    width: '100%',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#12121e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  }
});