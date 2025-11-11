import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../AuthContext';
import { useAds } from '../AdsContext';
import { Picker } from '@react-native-picker/picker';

const AdFormScreen = ({ navigation, route }) => {
  const { COLORS, user } = useAuth();
  const { addAd, updateAd, categories } = useAds();
  
  // Patikrinimas ar redaguojama
  const existingAd = route.params?.ad;
  const isEditing = !!existingAd;

  const [title, setTitle] = useState(existingAd?.title || '');
  const [description, setDescription] = useState(existingAd?.description || '');
  const [price, setPrice] = useState(existingAd?.price || '');
  const [contacts, setContacts] = useState(existingAd?.contacts || user?.email || ''); // Kontaktai. Naudojamas user.email kaip pradinė vertė
  const [category, setCategory] = useState(existingAd?.category || categories[1] || 'PlayStation');
  const [photoUrl, setPhotoUrl] = useState(existingAd?.photoUrl || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Redaguoti Skelbimą' : 'Pridėti Skelbimą',
    });
  }, [isEditing, navigation]);

  const handleSubmit = () => {
    if (!title || !description || !price || !contacts || !category) {
      Alert.alert("Klaida", "Prašome užpildyti visus laukelius (pavadinimą, aprašymą, kainą, kontaktus ir kategoriją).");
      return;
    }

    const adData = {
      title,
      description,
      price,
      contacts,
      category,
      photoUrl,
    };

    setIsLoading(true);

    if (isEditing) {
      // Atnaujinimas
      updateAd({ ...existingAd, ...adData });
      Alert.alert("Sėkmė", "Skelbimas sėkmingai atnaujintas!");
    } else {
      // Pridėjimas
      addAd(adData);
      Alert.alert("Sėkmė", "Skelbimas sėkmingai pridėtas!");
    }

    setIsLoading(false);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: COLORS.background }]}>
      <View style={[styles.card, { backgroundColor: COLORS.card }]}>
        <Text style={[styles.label, { color: COLORS.text }]}>Pavadinimas</Text>
        <TextInput
          style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text }]}
          placeholder="Žaidimo ar konsolės pavadinimas"
          placeholderTextColor={COLORS.secondaryText}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[styles.label, { color: COLORS.text }]}>Aprašymas</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: COLORS.background, color: COLORS.text }]}
          placeholder="Išsamus aprašymas, būklė, mainų galimybės..."
          placeholderTextColor={COLORS.secondaryText}
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={[styles.label, { color: COLORS.text }]}>Kaina (€)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text }]}
          placeholder="Kaina, pvz. 50.00€"
          placeholderTextColor={COLORS.secondaryText}
          keyboardType="default" // Pakeista į default, kad leistų € simbolį
          value={price}
          onChangeText={setPrice}
        />

        <Text style={[styles.label, { color: COLORS.text }]}>Kontaktai (Tel. nr. arba el. paštas)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text }]}
          placeholder="pvz., tel: +3706XXXXXXX arba email: vardas@paštas.lt"
          placeholderTextColor={COLORS.secondaryText}
          value={contacts}
          onChangeText={setContacts}
        />

        <Text style={[styles.label, { color: COLORS.text }]}>Nuotraukos URL (nebūtina)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text }]}
          placeholder="https://nuotraukos-adresas.lt/nuotrauka.jpg"
          placeholderTextColor={COLORS.secondaryText}
          autoCapitalize="none"
          value={photoUrl}
          onChangeText={setPhotoUrl}
        />

        <Text style={[styles.label, { color: COLORS.text }]}>Kategorija</Text>
        <View style={[styles.pickerContainer, { backgroundColor: COLORS.background }]}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={{ color: COLORS.text }}
            dropdownIconColor={COLORS.primary}
          >
            {categories.filter(c => c !== 'Visi').map(cat => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>


        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.primary }]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, { color: COLORS.card }]}>
            {isEditing ? 'Išsaugoti Pakeitimus' : 'Pridėti Skelbimą'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdFormScreen;