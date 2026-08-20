import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../Firebase';

export type AuthContextValue = {
  isAuthenticated: boolean;
  isAuthReady: boolean;
  user: string | null;
  token: string | null;
  login: (email: string, password: string, callback?: (user: string) => void) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string, callback?: (user: string, failed: boolean) => void) => Promise<void>;
  resetPassword: (email: string, callback?: (message: string) => void) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
     if (currentUser) {
       const authToken = await currentUser.getIdToken();
       const userId = currentUser.uid;
       setUser(userId);
       setToken(authToken);
       localStorage.setItem('user', userId);
       localStorage.setItem('token', authToken);
     } else {
       setUser(null);
       setToken(null);
       localStorage.removeItem('user');
       localStorage.removeItem('token');
     }

     setIsAuthReady(true);
   });

   return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string, callback?: (user: string) => void) => {
   if (!email || !password) {
     throw new Error('Email and password are required.');
   }

  const result = await signInWithEmailAndPassword(auth, email.trim(), password);
  const signedInUser = result.user.uid;
  const authToken = await result.user.getIdToken();
  localStorage.setItem('user', signedInUser);
  localStorage.setItem('token', authToken);
  setUser(signedInUser);
  setToken(authToken);
  callback?.(signedInUser);
  }, []);

  const register = useCallback(async (firstName: string, lastName: string, email: string, password: string, callback?: (user: string, failed: boolean) => void) => {
   if (!firstName || !lastName || !email || !password) {
     callback?.('', true);
     throw new Error('All registration fields are required.');
   }

   try {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const registeredUser = result.user.uid;
    const authToken = await result.user.getIdToken();
    localStorage.setItem('user', registeredUser);
    localStorage.setItem('token', authToken);
    setUser(registeredUser);
    setToken(authToken);
    callback?.(registeredUser, false);
   } catch (error) {
     callback?.('', true);
     throw error;
   }
  }, []);

  const resetPassword = useCallback(async (email: string, callback?: (message: string) => void) => {
   if (!email) {
     throw new Error('Email is required.');
   }

   await sendPasswordResetEmail(auth, email.trim());
   callback?.(`Password reset instructions have been sent to ${email}.`);
  }, []);

  const logout = useCallback(async () => {
   await signOut(auth);
   localStorage.removeItem('user');
    localStorage.removeItem('token');
   setUser(null);
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
   isAuthenticated: Boolean(user),
    isAuthReady,
   user,
    token,
   login,
   register,
   resetPassword,
   logout,
    }), [isAuthReady, login, logout, register, resetPassword, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
