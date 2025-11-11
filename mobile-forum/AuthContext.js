import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import 'react-native-get-random-values'; 
import { v4 as uuidv4 } from 'uuid';

// Dizainas ir spalvos
export const COLORS = {
  primary: '#00e0b8', // Akcento spalva (mygtukai, pabrėžimas)
  background: '#1c1c28', // Tamsus fonas
  card: '#2a2a3d', // Kortelių ir blokų fonas
  text: '#ffffff', // Šviesus tekstas
  secondaryText: '#a0a0b0', // Antrinis tekstas
  error: '#ff5252', // Klaidos spalva
  success: '#4caf50',
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined reiškia krovimą (loading)

  const USER_STORAGE_KEY = 'loggedInUser';
  const USERS_DB_KEY = 'usersDatabase'; // Išsaugoti visus registruotus vartotojus

  // --- 1. Pradinis krovimas ir įsiminimas (Remember Me) ---
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Būsenos nustatymas į null, jei nerandama nieko (naudotojas neprisijungęs)
        const savedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null); 
        }
      } catch (error) {
        console.error("Klaida kraunant vartotoją:", error);
        setUser(null);
      }
    };
    loadUser();
  }, []);

  // --- 2. Registracija ---
  const register = async (username, email, password) => {
    try {
      // Įkelti esamus vartotojus
      const usersData = await AsyncStorage.getItem(USERS_DB_KEY);
      const users = usersData ? JSON.parse(usersData) : [];

      // Patikrinti, ar vartotojas jau egzistuoja
      if (users.find(u => u.email === email)) {
        Alert.alert("Klaida", "Vartotojas su šiuo el. paštu jau egzistuoja.");
        return false;
      }

      // Sukurti naują vartotoją
      const newUser = { id: uuidv4(), username, email, password, isGuest: false };
      
      // Įrašyti į DB ir prisijungti
      users.push(newUser);
      await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser)); // Prisijungimo duomenų saugojimas
      setUser(newUser);
      Alert.alert("Sėkmė", "Jūs sėkmingai užsiregistravote ir prisijungėte!");
      return true;
    } catch (error) {
      console.error("Registracijos klaida:", error);
      Alert.alert("Klaida", "Nepavyko užregistruoti.");
      return false;
    }
  };

  // --- 3. Prisijungimas ---
  const login = async (email, password) => {
    try {
      const usersData = await AsyncStorage.getItem(USERS_DB_KEY);
      const users = usersData ? JSON.parse(usersData) : [];
      
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (foundUser) {
        const loggedInUser = { ...foundUser, isGuest: false };
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser)); // Įsiminti
        setUser(loggedInUser);
        Alert.alert("Sveiki!", `Sėkmingai prisijungėte kaip ${foundUser.username}.`);
        return true;
      } else {
        Alert.alert("Klaida", "Neteisingas el. paštas ar slaptažodis.");
        return false;
      }
    } catch (error) {
      console.error("Prisijungimo klaida:", error);
      Alert.alert("Klaida", "Nepavyko prisijungti.");
      return false;
    }
  };

  // --- 4. Prisijungimas kaip Svečiui ---
  const loginAsGuest = async () => {
    const guestUser = { id: 'guest', username: 'Svečias', isGuest: true };
    // Svečio prisijungimo NEsaugome su "Remember Me"
    await AsyncStorage.removeItem(USER_STORAGE_KEY); 
    setUser(guestUser);
    Alert.alert("Sveiki", "Prisijungėte kaip Svečias. Galite peržiūrėti skelbimus.");
  };

  // --- 5. Atsijungimas ---
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY); // Išvalyti įsimintą vartotoją
      setUser(null);
      Alert.alert("Išėjimas", "Sėkmingai atsijungėte.");
    } catch (error) {
      console.error("Atsijungimo klaida:", error);
      Alert.alert("Klaida", "Nepavyko atsijungti.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        setUser, 
        register, 
        login, 
        loginAsGuest, 
        logout, 
        isLoaded: user !== undefined, // Nurodo ar duomenys pakrauti is AsyncStorage
        COLORS 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);