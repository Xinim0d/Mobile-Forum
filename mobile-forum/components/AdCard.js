import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { useAds } from '../AdsContext';

const AdCard = ({ ad, navigation }) => {
  const { user, COLORS } = useAuth();
  const { deleteAd } = useAds();

  const isOwner = user && user.id === ad.userId && !user.isGuest;

  const handleDelete = () => {
    Alert.alert(
      "Ištrinti skelbimą",
      `Ar tikrai norite ištrinti skelbimą "${ad.title}"?`,
      [
        { text: "Atšaukti", style: "cancel" },
        { text: "Ištrinti", style: "destructive", onPress: () => deleteAd(ad.id) }
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('EditAd', { ad: ad });
  };

  return (
    <View style={[styles.card, { backgroundColor: COLORS.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: COLORS.text }]}>{ad.title}</Text>
        <Text style={[styles.price, { color: COLORS.primary }]}>{ad.price}</Text>
      </View>

      <View style={styles.content}>
        <Image
          source={{ uri: ad.photoUrl || 'https://placehold.co/100x100/33334f/ffffff?text=N/A' }}
          style={styles.image}
        />
        <View style={styles.details}>
          <Text style={[styles.description, { color: COLORS.secondaryText }]} numberOfLines={3}>{ad.description}</Text>
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: COLORS.secondaryText }]}>
              <FontAwesome5 name="tag" size={12} color={COLORS.secondaryText} /> {ad.category}
            </Text>
            <Text style={[styles.metaText, { color: COLORS.secondaryText }]}>
              <FontAwesome5 name="user" size={12} color={COLORS.secondaryText} /> {ad.user}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.contactText, { color: COLORS.text }]}>
          <FontAwesome5 name="phone" size={14} color={COLORS.secondaryText} style={{ marginRight: 5 }} /> Kontaktas: {ad.contacts}
        </Text>

        {isOwner && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
              <FontAwesome5 name="edit" size={16} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
              <FontAwesome5 name="trash-alt" size={16} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: '900',
  },
  content: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  description: {
    fontSize: 14,
    marginBottom: 5,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
  },
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
    padding: 5,
  },
});

export default AdCard;