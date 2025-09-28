// Authentication service for DESocial
import {
    createUserWithEmailAndPassword,
    User as FirebaseUser,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// If your '../config/firebase' does not export typed 'auth' and 'db', update it as follows:
// export const auth: Auth = getAuth(app);
// export const db: Firestore = getFirestore(app);
import { LoginForm, RegisterForm, User } from '../types';

class AuthService {
  // Listen to authentication state changes
  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Email-based login
  async loginWithEmail(loginData: LoginForm): Promise<User> {
    try {
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Email:', loginData.email);
      console.log('Email trimmed:', loginData.email.trim());
      console.log('Password length:', loginData.password.length);
      console.log('Password first 3 chars:', loginData.password.substring(0, 3) + '...');
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email.trim(),
        loginData.password
      );

      console.log('Firebase auth successful, user ID:', userCredential.user.uid);

      // Get additional user data from Firestore with timeout and fallback
      console.log('Attempting to fetch user document from Firestore...');
      let userData: User;
      
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firestore timeout')), 5000)
        );
        
        const userDoc = await Promise.race([
          getDoc(doc(db, 'users', userCredential.user.uid)),
          timeoutPromise
        ]) as any;
        
        console.log('Firestore query completed, document exists:', userDoc.exists());
        
        if (!userDoc.exists()) {
          console.error('User document not found in Firestore for UID:', userCredential.user.uid);
          throw new Error('User profile not found. Please contact support.');
        }

        userData = userDoc.data() as User;
        console.log('User data retrieved successfully:', userData.displayName);
        
        // Update last active timestamp (don't wait for it)
        console.log('Updating last active timestamp...');
        updateDoc(doc(db, 'users', userCredential.user.uid), {
          lastActive: new Date()
        }).then(() => {
          console.log('Last active timestamp updated successfully');
        }).catch((error) => {
          console.log('Failed to update last active timestamp:', error);
        });
        
      } catch (firestoreError) {
        console.warn('Firestore query failed, using basic user data:', firestoreError);
        // Fallback to basic user data from Firebase Auth
        userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || loginData.email.trim(),
          displayName: userCredential.user.displayName || 'User',
          prn: '',
          year: 0,
          branch: '',
          isAdmin: false,
          isVerified: false,
          joinedTribes: [],
          createdAt: new Date(),
          lastActive: new Date()
        };
        console.log('Using fallback user data for login');
      }

      return userData;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide more specific error messages
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      } else if (error.message.includes('User profile not found')) {
        throw new Error('Account exists but profile is incomplete. Please contact support.');
      }
      throw error;
    }
  }

  // Register new user with email
  async registerWithEmail(registerData: RegisterForm): Promise<User> {
    try {
      console.log('=== REGISTRATION ATTEMPT ===');
      console.log('Email:', registerData.email);
      console.log('Email trimmed:', registerData.email.trim());
      console.log('Password length:', registerData.password.length);
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerData.email.trim(),
        registerData.password
      );

      // Update Firebase Auth profile
      await updateProfile(userCredential.user, {
        displayName: registerData.displayName
      });

      // Skip email verification for now
      // await sendEmailVerification(userCredential.user);

      // Create user document in Firestore
      const userData: User = {
        uid: userCredential.user.uid,
        prn: registerData.prn || '',
        email: registerData.email.trim(),
        displayName: registerData.displayName,
        year: registerData.year,
        branch: registerData.branch,
        isAdmin: false,
        isVerified: false, // Will be true after barcode verification
        joinedTribes: [],
        createdAt: new Date(),
        lastActive: new Date()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Send password reset email
  async resetPassword(prn: string): Promise<void> {
    try {
      const email = `${prn}@des.edu`;
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Get current user from Firestore
  async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (!userDoc.exists()) return null;

      return userDoc.data() as User;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Validate PRN format (customize based on DES PRN format)
  private validatePRN(prn: string): boolean {
    // PRN is just a number with no specific format requirement
    const prnRegex = /^[0-9]+$/;
    return prnRegex.test(prn) && prn.length >= 3;
  }

  // Validate barcode data against PRN
  private validateBarcodeData(barcodeData: string, prn: string): boolean {
    // Barcode contains only the PRN number when scanned
    if (!barcodeData || barcodeData.trim().length === 0) {
      return false;
    }
    
    // Remove any whitespace and compare with entered PRN
    const scannedPRN = barcodeData.trim();
    
    // The scanned barcode should match the entered PRN exactly
    return scannedPRN === prn;
  }

  // Update user profile
  async updateUserProfile(updates: Partial<User>): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not authenticated');

      await updateDoc(doc(db, 'users', currentUser.uid), {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Verify user with barcode (for admin verification)
  async verifyUser(userId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isVerified: true,
        verifiedAt: new Date()
      });
    } catch (error) {
      console.error('User verification error:', error);
      throw error;
    }
  }

  // Debug helper to test credentials
  async testCredentials(email: string, password: string): Promise<void> {
    try {
      console.log('=== TESTING CREDENTIALS ===');
      console.log('Attempting to sign in with:', email.trim());
      
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log('SUCCESS: Credentials are valid!', result.user.uid);
      
      // Sign out immediately after test
      await signOut(auth);
      console.log('Signed out after test');
      
    } catch (error: any) {
      console.log('FAILED: Credentials test failed');
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);
      throw error;
    }
  }
}

export const authService = new AuthService();