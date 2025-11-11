import React, { createContext, useContext, useState, useMemo } from 'react';
import { useAuth } from './AuthContext';

// Funkcija atsitiktiniam, unikaliam ID generavimui (vietoj uuid)
const generateSimpleId = () => {
    return 'ad-' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(0, 4);
};

const AdsContext = createContext();

export const useAds = () => useContext(AdsContext);

// Pavyzdiniai duomenys su kontaktais (tel/email)
const initialAds = [
  { id: '1', title: 'Parduodu PS5 žaidimą - God of War Ragnarok', description: 'Kaip naujas, kartą pereitas, diskas be įbrėžimų.', price: '50.00€', category: 'PlayStation', userId: 'user-72k8s2n', user: 'TestUser1', contacts: 'tel: +37060000001', photoUrl: 'https://placehold.co/100x100/505060/ffffff?text=PS5+GoW' },
  { id: '2', title: 'Keičiu Xbox Series S', description: 'Puikios būklės, su 2 pulteliais. Domina Nintendo Switch žaidimai.', price: '350.00€', category: 'Xbox', userId: 'user-72k8s2n', user: 'TestUser1', contacts: 'email: test.user@gmail.com', photoUrl: 'https://placehold.co/100x100/3949AB/ffffff?text=Xbox+S' },
  { id: '3', title: 'Kompiuteriniai žaidimai (RDR2)', description: 'Parduodu Red Dead Redemption 2, CD versija.', price: '30.00€', category: 'PC', userId: 'other-user-id', user: 'RandomGuy', contacts: 'tel: +37060000002', photoUrl: 'https://placehold.co/100x100/795548/ffffff?text=RDR2' },
  { id: '4', title: 'Nintendo Switch Lite konsolė', description: 'Geros būklės, mėlynos spalvos. Su dėžute.', price: '180.00€', category: 'Nintendo', userId: 'another-user-id', user: 'JaneDoe', contacts: 'email: jane.doe@email.com', photoUrl: 'https://placehold.co/100x100/E53935/ffffff?text=Switch+Lite' },
];

export const AdsProvider = ({ children }) => {
  const { user } = useAuth();
  const [ads, setAds] = useState(initialAds);
  const [selectedCategory, setSelectedCategory] = useState('Visi');
  const [showMyAds, setShowMyAds] = useState(false); // Naujas filtras: tik mano skelbimai
  const [searchTerm, setSearchTerm] = useState(''); // Nauja: paieškos terminas

  // --- CRUD Funkcijos ---
  const addAd = (newAdData) => {
    const adWithMetadata = { 
        ...newAdData, 
        id: generateSimpleId(),
        userId: user.id,
        user: user.username
    };
    setAds(prevAds => [adWithMetadata, ...prevAds]);
  };

  const updateAd = (updatedAd) => {
    setAds(prevAds => 
      prevAds.map(ad => ad.id === updatedAd.id ? updatedAd : ad)
    );
  };

  const deleteAd = (id) => {
    setAds(prevAds => prevAds.filter(ad => ad.id !== id));
  };

  // --- Filtravimas ir Paieška ---
  const filteredAds = useMemo(() => {
    let result = ads;

    // 1. Filtravimas: Mano skelbimai (tik jei vartotojas prisijungęs ir ne svečias)
    if (user && !user.isGuest && showMyAds) {
      result = result.filter(ad => ad.userId === user.id);
    }

    // 2. Filtravimas: Kategorija
    if (selectedCategory && selectedCategory !== 'Visi') {
      result = result.filter(ad => ad.category === selectedCategory);
    }

    // 3. Paieška (pagal pavadinimą ir kainą)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(ad => 
        ad.title.toLowerCase().includes(term) || 
        ad.price.includes(term)
      );
    }

    return result;
  }, [ads, selectedCategory, showMyAds, searchTerm, user]);

  // Kategorijų sąrašas
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(ads.map(ad => ad.category))].sort();
    return ['Visi', ...uniqueCategories];
  }, [ads]);


  return (
    <AdsContext.Provider value={{ 
        ads: filteredAds, 
        addAd, 
        updateAd, 
        deleteAd, 
        categories,
        selectedCategory, 
        setSelectedCategory,
        showMyAds, // Nauja
        setShowMyAds, // Nauja
        searchTerm, // Nauja
        setSearchTerm // Nauja
    }}>
      {children}
    </AdsContext.Provider>
  );
};