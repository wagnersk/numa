import { create } from "zustand";
import { Alert } from "react-native";
import { router } from "expo-router";
import * as Crypto from "expo-crypto";
import { useUserDatabase, Language, User } from "@/database/useUserDatabase";
import { useSessionDatabase } from "@/database/useSessionDatabase";
import { i18n } from "@/libs/i18n";

type UserState = {
  user: { id: number; name: string; email: string; language: Language } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingSession: boolean;

  login: (email: string, password: string, userDb: ReturnType<typeof useUserDatabase>, sessionDb: ReturnType<typeof useSessionDatabase>) => Promise<void>;
  logout: (sessionDb: ReturnType<typeof useSessionDatabase>) => Promise<void>;
  register: (name: string, email: string, password: string, language: Language, userDb: ReturnType<typeof useUserDatabase>, sessionDb: ReturnType<typeof useSessionDatabase>) => Promise<void>;
  updateProfile: (id: number, data: { name?: string; email?: string; password?: string; language?: Language }, userDb: ReturnType<typeof useUserDatabase>) => Promise<void>;
  checkSession: (userDb: ReturnType<typeof useUserDatabase>, sessionDb: ReturnType<typeof useSessionDatabase>) => Promise<void>;
};

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingSession: true,

  login: async (email, password, userDb, sessionDb) => {
    set({ isLoading: true });
    try {
      // Login errors are not language-dependent as the user is not yet logged in.
      // We use the default language.
      const t = i18n['pt-br'];
      const userWithPassword = await userDb.findByEmail(email);
      if (!userWithPassword) {
        Alert.alert(t.common.error, t.alerts.invalidCredentials);
        return;
      }

      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      if (userWithPassword.password !== hashedPassword) {
        Alert.alert(t.common.error, t.alerts.invalidCredentials);
        return;
      }

      await sessionDb.save(userWithPassword.id);
      set({ user: { id: userWithPassword.id, name: userWithPassword.name, email: userWithPassword.email, language: userWithPassword.language }, isAuthenticated: true });
      router.replace("/tabs");
    } catch (error) {
      console.log(error);
      Alert.alert(i18n['pt-br'].common.error, i18n['pt-br'].alerts.loginError);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async (sessionDb) => {
    await sessionDb.clear();
    set({ user: null, isAuthenticated: false, isLoading: false });
    router.replace("/auth/login");
  },

  register: async (name, email, password, language, userDb, sessionDb) => {
    set({ isLoading: true });
    try {
      // Register errors use the selected language from the form.
      const t = i18n[language];
      const existingUser = await userDb.findByEmail(email);
      if (existingUser) {
        Alert.alert(t.common.error, t.alerts.emailInUse);
        return;
      }

      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      const userId = await userDb.create({ name, email, password: hashedPassword, language });
      console.log(`userId 1->`,userId)
      await sessionDb.save(userId);
      console.log(`userId 2->`,userId)
      set({ user: { id: userId, name, email, language }, isAuthenticated: true });
      console.log(`userId 3->`,userId)
      router.replace("/tabs");
    } catch (error) {
      console.log(error);
      Alert.alert(i18n[language].common.error, i18n[language].alerts.registerError);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (id, data, userDb) => {
    set({ isLoading: true });
    try {
      const lang = get().user?.language || 'pt-br';
      const t = i18n[lang];
      const dataToUpdate = { ...data };
      if (data.password && data.password.trim().length > 0) {
        dataToUpdate.password = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          data.password
        );
      } else {
        delete dataToUpdate.password;
      }
      
      await userDb.update({ id, ...dataToUpdate });
      const { password, ...updatedData } = data;
      const updatedUser = { ...get().user!, ...updatedData };

      // Atualiza o estado local
      set({ user: updatedUser as User });

      Alert.alert(t.common.success, t.alerts.profileUpdated);
    } catch (error) {
      console.log(error);
      Alert.alert(i18n[get().user?.language || 'pt-br'].common.error, i18n[get().user?.language || 'pt-br'].alerts.profileUpdateError);
    } finally {
      set({ isLoading: false });
    }
  },

  checkSession: async (userDb, sessionDb) => {
    try {
      const userId = await sessionDb.get();
      if (userId) {
        const user = await userDb.findById(userId);
        if (user) {
          set({ user, isAuthenticated: true });
        }
      }
    } catch (error) {
      console.log("Failed to check session:", error);
    } finally {
      set({ isCheckingSession: false });
    }
  },
}));