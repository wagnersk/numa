import {
  View,
  TextInput,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  Image
} from "react-native";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useUserDatabase } from "@/database/useUserDatabase";
import { useSessionDatabase } from "@/database/useSessionDatabase";
import { Button } from "@/components/Button";
import { colors } from "@/theme/colors";
import { fontFamily } from "@/theme";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useTranslations } from "@/libs/i18n";

// imagem de fundo
import LoginBackground from "@/assets/Login.png";
import NumaLogo from "@/assets/NumaLogo.png";

export default function RegisterScreen() {
  const userDatabase = useUserDatabase();
  const sessionDatabase = useSessionDatabase();
  const { register, isLoading } = useUserStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={LoginBackground}
        resizeMode="cover"
        style={styles.background}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* TOPO - LOGO */}
          <View style={styles.header}>
            <Image source={NumaLogo} style={styles.logo} resizeMode="contain" />
          </View>

          {/* CENTRO - FORM */}
          <View style={styles.content}>
            <View style={styles.form}>
              {/* Nome */}
              <BlurView intensity={20} tint="dark" style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.gray[800]}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder={t.login.name}
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  editable={!isLoading}
                  placeholderTextColor={colors.gray[800]}
                />
              </BlurView>

              {/* Email */}
              <BlurView intensity={20} tint="dark" style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.gray[800]}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="exemplo@email.com"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                  placeholderTextColor={colors.gray[800]}
                />
              </BlurView>

              {/* Senha */}
              <BlurView intensity={20} tint="dark" style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.gray[800]}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder={t.login.createPassword}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  editable={!isLoading}
                  placeholderTextColor={colors.gray[800]}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.gray[800]}
                  />
                </TouchableOpacity>
              </BlurView>
            </View>

            <Button
              title={t.signup.title}
              onPress={() =>
                register(
                  name,
                  email,
                  password,
                  "pt-br",
                  userDatabase,
                  sessionDatabase
                )
              }
              isProcessing={isLoading}
            />
          </View>

          {/* RODAPÉ */}
          <BlurView intensity={40} tint="light" style={styles.blurBox}>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.linkRow}
                onPress={() => router.push("/auth/login")}
              >
                <Ionicons
                  name="arrow-back-outline"
                  size={20}
                  color={colors.black}
                  style={styles.icon}
                />
                <Text style={styles.linkText}>{t.login.backToLogin}</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingTop: 40, // espaço para notch
  },
  logo: {
    width: 200,
    height: 120,
  },
  content: {
    flex: 1,
    justifyContent: "center", // garante centralização vertical
    gap: 20,
  },
  form: {
    gap: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    overflow: "hidden",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.black,
  },
  inputIcon: {
    marginRight: 8,
  },
  eyeButton: {
    paddingHorizontal: 4,
  },
  blurBox: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  footer: {
    alignItems: "center",
    paddingTop: 20,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  linkText: {
    color: colors.gray[600],
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  icon: {
    marginLeft: 6,
  },
});