import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  createdAt?: number;
  lastLogin?: number;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    defaultWatchlistId?: string;
    defaultPortfolioId?: string;
  };
}

class AuthService {
  static async register(email: string, password: string, displayName: string): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName });
      
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        createdAt: Date.now(),
        lastLogin: Date.now(),
        preferences: {
          theme: 'light',
          notifications: true
        }
      };
      
      await setDoc(doc(firestore, 'users', user.uid), userProfile);
      
      return userProfile;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to register user');
    }
  }
  
  static async login(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, { lastLogin: Date.now() });
      
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      } else {
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          createdAt: Date.now(),
          lastLogin: Date.now(),
          preferences: {
            theme: 'light',
            notifications: true
          }
        };
        
        await setDoc(userRef, userProfile);
        
        return userProfile;
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to login');
    }
  }
  
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to logout');
    }
  }
  
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send password reset email');
    }
  }
  
  static async updateUserProfile(user: User, data: Partial<UserProfile>): Promise<void> {
    try {
      if (data.displayName || data.photoURL) {
        await updateProfile(user, {
          displayName: data.displayName || user.displayName,
          photoURL: data.photoURL || user.photoURL
        });
      }
      
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, { ...data, updatedAt: Date.now() });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user profile');
    }
  }
  
  static async changePassword(user: User, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      await updatePassword(user, newPassword);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to change password');
    }
  }
  
  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        return null;
      }
      
      const userRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      
      return null;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get user profile');
    }
  }
  
  static async updateUserPreferences(userId: string, preferences: Partial<UserProfile['preferences']>): Promise<void> {
    try {
      const userRef = doc(firestore, 'users', userId);
      await updateDoc(userRef, { 
        'preferences': preferences,
        updatedAt: Date.now() 
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user preferences');
    }
  }
}

export default AuthService;
