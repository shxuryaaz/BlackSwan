import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign up with email and password
export const signUp = async (email: string, password: string, fullName: string): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user profile in Firestore
  await setDoc(doc(db, 'profiles', userCredential.user.uid), {
    user_id: userCredential.user.uid,
    full_name: fullName,
    email: email,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  return userCredential;
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  const result = await signInWithPopup(auth, googleProvider);
  
  // Check if user profile exists, if not create one
  const userDoc = await getDoc(doc(db, 'profiles', result.user.uid));
  
  if (!userDoc.exists()) {
    // Create user profile in Firestore for new Google users
    await setDoc(doc(db, 'profiles', result.user.uid), {
      user_id: result.user.uid,
      full_name: result.user.displayName || 'Google User',
      email: result.user.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  return result;
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, 'profiles', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}; 