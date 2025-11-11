import React, { createContext, useContext, useState, useMemo } from 'react';

// Funkcija atsitiktiniam, unikaliam ID generavimui (vietoj uuid)
const generateSimpleId = () => {
    // Generuoja trumpą, unikalų ID
    return 'ad-' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(0, 4);
};

const AdsContext = createContext();

export const useAds = () => useContext(AdsContext);

// Pradiniai pavyzdiniai duomenys (3.0 balas)
const initialAds = [
  { id: '1', title: 'Parduodu PS5 žaidimą', description: 'Spider-Man 2, kaip naujas. Kartą pereitas.', price: '50.00€', category: 'PlayStation', userId: 'user-72k8s2n', user: 'TestUser1' },
  { id: '2', title: 'Keičiu Xbox Series S', description: 'Be defektų, su 2 pulteliais. Domina Nintendo Switch žaidimai.', price: '350.00€', category: 'Xbox', userId: 'user-72k8s2n', user: 'TestUser1' },
  { id: '3', title: 'Kompiuteriniai žaidimai (RDR2)', description: 'Parduodu Red Dead Redemption 2, CD versija.', price: '30.00€', category: 'PC', userId: 'other-user-id', user: 'RandomGuy' },
  { id: '4', title: 'Nintendo Switch Lite konsolė', description: 'Geros būklės, mėlynos spalvos. Su dėžute.', price: '180.00€', category: 'Nintendo', userId: 'another-user-id', user: 'JaneDoe' },
];

export const AdsProvider = ({ children }) => {
  const [ads, setAds] = useState(initialAds);
  const [selectedCategory, setSelectedCategory] = useState('Visi'); // Pradinė reikšmė 'Visi'

  // 1.0 balas už pridėjimą
  const addAd = (newAd, user) => {
    const adWithId = { 
        ...newAd, 
        id: generateSimpleId(), // Naudojama nauja funkcija
        userId: user.id, // Išsaugoti vartotojo ID
        user: user.username // Vartotojo vardas atvaizdavimui
    };
    setAds(prevAds => [adWithId, ...prevAds]);
  };

  // 1.0 balas už atnaujinimą
  const updateAd = (updatedAd) => {
    setAds(prevAds => 
      prevAds.map(ad => ad.id === updatedAd.id ? updatedAd : ad)
    );
  };

  // 1.0 balas už ištrynimą
  const deleteAd = (id) => {
    setAds(prevAds => prevAds.filter(ad => ad.id !== id));
  };
  
  // Apskaičiuota skelbimų sąrašo būsena pagal pasirinktą kategoriją (2.0 balas)
  const filteredAds = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'Visi') {
      return ads;
    }
    return ads.filter(ad => ad.category === selectedCategory);
  }, [ads, selectedCategory]);

  return (
    <AdsContext.Provider value={{ 
        ads: filteredAds, 
        addAd, 
        updateAd, 
        deleteAd, 
        selectedCategory, 
        setSelectedCategory 
    }}>
      {children}
    </AdsContext.Provider>
  );
};