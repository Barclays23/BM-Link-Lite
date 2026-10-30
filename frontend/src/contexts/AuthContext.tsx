import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { authService } from '../services/auth.service';
import { getErrorMessage } from '../utils/getErrorMessage';
import type {
  AuthUser,
  LoginData,
  RegisterData,
} from '../types/auth.types';




interface AuthContextValue {
   user: AuthUser | null;
   isLoading: boolean;
   login: (data: LoginData) => Promise<void>;
   register: (data: RegisterData) => Promise<void>;
   logout: () => Promise<void>;
}




const AuthContext = createContext<AuthContextValue | undefined>(
   undefined,
);


export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<AuthUser | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   // Restore the session after a browser refresh.
   useEffect(() => {
      const restoreSession = async () => {
         const token = localStorage.getItem('access_token');

         if (!token) {
            setIsLoading(false);
            return;
         }

         try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
         } catch {
            localStorage.removeItem('access_token');
            setUser(null);
         } finally {
            setIsLoading(false);
         }
      };

      void restoreSession();
   }, []);

   const login = useCallback(async (data: LoginData) => {
      try {
         const result = await authService.login(data);

         const token =
            result.access_token ??
            result.accessToken ??
            result.token;

         if (!token) {
         throw new Error(
            'The login response does not contain a supported JWT field.',
         );
         }

         localStorage.setItem('access_token', token);

         // Confirm the token works and get the user's details.
         const currentUser = await authService.getCurrentUser();
         setUser(currentUser);
      } catch (error) {
         localStorage.removeItem('access_token');
         setUser(null);

         throw new Error(getErrorMessage(error, 'Login failed.'));
      }
   }, []);



   const register = useCallback(async (data: RegisterData) => {
      try {
         await authService.register(data);
      } catch (error) {
         throw new Error(
         getErrorMessage(error, 'Registration failed.'),
         );
      }
   }, []);


   const logout = useCallback(async () => {
      try {
         await authService.logout();
      } catch {
         // Clear the local session even if the API call fails.
      } finally {
         localStorage.removeItem('access_token');
         setUser(null);
      }
   }, []);



   return (
      <AuthContext.Provider
         value={{ 
            user, 
            isLoading, 
            login, 
            register, 
            logout 
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}



export function useAuth(): AuthContextValue {
   const context = useContext(AuthContext);

   if (!context) {
      throw new Error('useAuth must be used inside AuthProvider');
   }

   return context;
}