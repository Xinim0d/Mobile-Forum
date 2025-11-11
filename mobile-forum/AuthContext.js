import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Konteksto kūrimas
const AuthContext = React.createContext();

// Spalvų tema (įtraukta ir čia, kad komponentai galėtų dinamiškai reaguoti)
const COLORS = {
  background: '#12121e',
  accent: '#00ff7f', 
  text: '#f5f5f5',
  card: '#1e1e2d',
  button: '#00cc66',
  error: '#ff5555',
};

// Vartotojo duomenų pavyzdys
const MOCK_USER = {
  id: 'mock-user-123', // Naudosime šį ID
  username: 'test',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funkcija, kuri tikrina, ar vartotojas prisimintas
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Klaida kraunant vartotojo duomenis:', e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Prisijungimo funkcija
  const login = async (username, password, rememberMe) => {
    // Vartotojo tikrinimas (tikriname tik pavyzdinius duomenis)
    if (username === 'test' && password === '123') {
      const newUser = { 
        ...MOCK_USER, 
      }; 
      setUser(newUser);

      // Jei "Prisiminti mane" pažymėta, išsaugome duomenis
      if (rememberMe) {
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
      } else {
        await AsyncStorage.removeItem('user');
      }
      return true; // Prisijungimas sėkmingas
    }
    return false; // Prisijungimas nesėkmingas
  };

  // Atsijungimo funkcija
  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem('user');
    } catch (e) {
      console.error('Klaida šalinant vartotojo duomenis:', e);
    }
  };

  const value = {
    user,
    loading,
    COLORS, 
    login,
    logout, // Svarbu: pridėta atsijungimo funkcija
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook'as naudojimui
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth turi būti naudojamas AuthProvider viduje');
  }
  return context;
}