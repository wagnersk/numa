import {
  View,
  TextInput,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useUserDatabase } from "@/database/useUserDatabase";
import { useSessionDatabase } from "@/database/useSessionDatabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { colors } from "@/theme/colors";
import { fontFamily } from "@/theme";
import { router } from "expo-router";
import { useTranslations } from "@/libs/i18n";

export default function LoginScreen() {
  const userDatabase = useUserDatabase();
  const sessionDatabase = useSessionDatabase();
  const { login, isLoading } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const t = useTranslations();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View />
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>{t.login.title}</Text>
            <Text style={styles.subtitle}>{t.login.subtitle}</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>{t.common.email}</Text>
            <TextInput
              placeholder="exemplo@email.com"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />

            <Text style={styles.label}>{t.common.password}</Text>
            <TextInput
              placeholder="************"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              editable={!isLoading}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title={t.login.title}
            onPress={() => login(email, password, userDatabase, sessionDatabase)}
            isProcessing={isLoading}
          />
          <TouchableOpacity onPress={() => router.push("/auth/signup")}>
            <Text style={styles.linkText}>
              {t.login.noAccount}{" "}
              <Text style={styles.linkHighlight}>{t.login.createOne}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: fontFamily.bold,
    color: colors.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.gray[600],
    textAlign: "center",
  },
  form: {},
  label: {
    color: colors.gray[600],
    fontSize: 16,
    fontFamily: fontFamily.regular,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.white,
    height: 52,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  footer: {
    alignItems: "center",
    gap: 16,
    paddingTop: 32,
  },
  linkText: {
    color: colors.gray[600],
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },
  linkHighlight: {
    color: colors.goalColors.blue_option,
    fontFamily: fontFamily.bold,
  },
});