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
import Feather from "@expo/vector-icons/Feather";
import { useTranslations } from "@/libs/i18n";

export default function RegisterScreen() {
  const userDatabase = useUserDatabase();
  const sessionDatabase = useSessionDatabase();
  const { register, isLoading } = useUserStore();
  const [name, setName] = useState("");
  const [language, setLanguage] = useState<'pt-br' | 'en' | 'es'>('pt-br');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const t = useTranslations(language);

  const languages = [
      { code: 'pt-br', label: 'Português' },
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View />
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.title}>{t.signup.title}</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Idioma</Text>
            <View style={styles.languageRow}>
                {languages.map(lang => (
                    <TouchableOpacity
                        key={lang.code}
                        style={[
                            styles.langButton,
                            language === lang.code && styles.langButtonSelected
                        ]}
                        onPress={() => setLanguage(lang.code as any)}
                    >
                        <Text style={[
                            styles.langText,
                            language === lang.code && styles.langTextSelected
                        ]}>
                            {lang.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.label}>{t.settings.newName}</Text>
            <TextInput
              placeholder="Seu nome completo"
              value={name}
              onChangeText={setName}
              style={styles.input}
              editable={!isLoading}
            />

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
              placeholder="Crie uma senha forte"
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
            title={t.signup.title}
            onPress={() => register(name, email, password, language, userDatabase, sessionDatabase)}
            isProcessing={isLoading}
          />
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.linkText}>
              Já tem uma conta?{" "}
              <Text style={styles.linkHighlight}>Faça login</Text>
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
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: fontFamily.bold,
    color: colors.black,
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
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
  },
  langButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 50,
    backgroundColor: colors.gray[200],
  },
  langButtonSelected: {
    backgroundColor: colors.black
  },
  langText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    fontWeight: '400',
  },
  langTextSelected: {
    color: colors.white,
  },
});