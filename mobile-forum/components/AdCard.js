import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../AuthContext';
import { useAds } from '../AdsContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function AdCard({ ad }) {
  const { user, COLORS } = useAuth();
  const { deleteAd } = useAds();
  const navigation = useNavigation();

  // Patikrina, ar vartotojas yra skelbimo savininkas
  // Dėmesio: jei vartotojas prisijungia, jo ID bus atnaujintas, bet pavyzdiniuose skelbimuose išlieka 'user-72k8s2n'
  // Autentifikacijos kontekste 'test' vartotojui priskiriamas ID, kuris išsaugomas.
  // Kad veiktų pavyzdys, patikrinkite, ar vartotojo ID sutampa su 'test' vartotojo ID
  const isOwner = user && user.id === ad.userId; 

  const handleDelete = () => {
    deleteAd(ad.id);
  };
  
  const handleEdit = () => {
    navigation.navigate('EditAd', { ad });
  };

  return (
    <View style={[styles.card, { backgroundColor: COLORS.card, borderColor: COLORS.accent }]}>
      <Text style={[styles.category, { color: COLORS.accent }]}>[{ad.category}]</Text>
      <Text style={[styles.title, { color: COLORS.text }]}>{ad.title}</Text>
      <Text style={[styles.description, { color: COLORS.text }]}>{ad.description}</Text>
      
      <View style={styles.footer}>
        <View>
            <Text style={[styles.price, { color: COLORS.button }]}>{ad.price}</Text>
            <Text style={[styles.user, { color: '#aaa' }]}>Pardavėjas: {ad.user}</Text>
        </View>

        {isOwner && (
          <View style={styles.ownerActions}>
            {/* Redagavimo mygtukas (1.0 balas) */}
            <TouchableOpacity onPress={handleEdit} style={[styles.actionButton, { backgroundColor: '#3a7bd5' }]}>
                <MaterialIcons name="edit" size={20} color={COLORS.text} />
            </TouchableOpacity>
            {/* Trinimo mygtukas (1.0 balas) */}
            <TouchableOpacity onPress={handleDelete} style={[styles.actionButton, { backgroundColor: COLORS.error, marginLeft: 10 }]}>
                <MaterialIcons name="delete" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  category: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#33334f',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  user: {
    fontSize: 12,
  },
  ownerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  }
});