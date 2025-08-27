import { router } from "expo-router";
import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useUserDatabase } from "@/database/useUserDatabase";
import { useSessionDatabase } from "@/database/useSessionDatabase";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export default function Index() {
  const { isAuthenticated, isCheckingSession, checkSession } = useUserStore();
  const userDatabase = useUserDatabase();
  const sessionDatabase = useSessionDatabase();
  
console.log(`isAuthenticated`,isAuthenticated)
console.log(`isCheckingSession`,isCheckingSession)


  useEffect(() => {
    checkSession(userDatabase, sessionDatabase);
  }, []);

  useEffect(() => {
    if (!isCheckingSession) {
      if (isAuthenticated) {
        router.replace("/tabs");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [isAuthenticated, isCheckingSession]);

  // Exibe uma tela de carregamento enquanto a sessão está sendo verificada.
  // Isso evita um "flash" da tela de login antes de redirecionar.
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.black} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray[100],
  },
});