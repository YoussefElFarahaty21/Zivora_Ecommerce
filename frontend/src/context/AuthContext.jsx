import { createContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userRole = userDoc.exists() ? userDoc.data().role : 'customer';
          setUser(firebaseUser);
          setRole(userRole);
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error('AuthContext onAuthStateChanged error:', error);
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const token = await credential.user.getIdToken();

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Login failed');

      const userRole = data.data?.role || 'customer';
      setRole(userRole);
      return { user: credential.user, role: userRole };
    } catch (error) {
      console.error('AuthContext signIn error:', error);
      throw error;
    }
  };

  const signUp = async (email, password) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await credential.user.getIdToken();

      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Registration failed');

      setRole('customer');
      return credential.user;
    } catch (error) {
      console.error('AuthContext signUp error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('AuthContext signOut error:', error);
      throw error;
    }
  };

  const value = {
    user,
    role,
    loading,
    isAdmin: role === 'admin',
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
