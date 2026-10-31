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
   AuthResponse,
  AuthUser,
  CurrentUserResponse,
  LoginData,
  RegisterData,
} from '../types/auth.types';
import { AUTH_SESSION_EXPIRED_EVENT, clearAuthSession, saveAuthSession } from '../api/axios';




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


const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<AuthUser | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   const clearSession = useCallback(() => {
      clearAuthSession();
      setUser(null);
   }, []);

   // Restore the session after a browser refresh.
   useEffect(() => {
      const restoreSession = async () => {
         const token = localStorage.getItem('access_token');
         console.log('token :', token);

         if (!token) {
            setIsLoading(false);
            return;
         }

         try {
            const response: CurrentUserResponse = await authService.getCurrentUser();
            setUser(response.user);

            localStorage.setItem(USER_KEY, JSON.stringify(response.user));

         } catch {
            clearSession();

         } finally {
            setIsLoading(false);
         }
      };

      void restoreSession();
   }, [clearSession]);



   useEffect(() => {
      const handleSessionExpired = () => {
         clearSession();
      };

      window.addEventListener(
         AUTH_SESSION_EXPIRED_EVENT,
         handleSessionExpired,
      );

      return () => {
         window.removeEventListener(
            AUTH_SESSION_EXPIRED_EVENT,
            handleSessionExpired,
         );
      };
   }, [clearSession]);




   const login = useCallback(async (data: LoginData) => {
      try {
         const result: AuthResponse = await authService.login(data);

         saveAuthSession(result.accessToken, result.user);

         setUser(result.user);

      } catch (error) {
         throw new Error(getErrorMessage(error, 'Login failed.'), {
            cause: error,
         });
      }
   }, []);



   const register = useCallback(async (data: RegisterData) => {
      try {
         await authService.register(data);
      } catch (error) {
         throw new Error(getErrorMessage(error, 'Registration failed.'), {
            cause: error,
         });
      }
   }, []);


   const logout = useCallback(async () => {
      try {
         await authService.logout();
      } catch {
         // Ignored: silent cleanup/refresh failure
      } finally {
         clearSession();
      }
   }, [clearSession]);



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



// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
   const context = useContext(AuthContext);

   if (!context) {
      throw new Error('useAuth must be used inside AuthProvider');
   }

   return context;
}