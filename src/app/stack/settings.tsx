import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import { colors } from "@/theme/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontFamily } from "@/theme";
import { useUserStore } from "@/store/useUserStore";
import { Language, useUserDatabase } from "@/database/useUserDatabase";
import { useSessionDatabase } from "@/database/useSessionDatabase";
import { Button } from "@/components/Button";
import { useTranslations } from "@/libs/i18n";

export default function Settings() {
    const { user, logout, updateProfile, isLoading } = useUserStore();
    const userDatabase = useUserDatabase();
    const sessionDatabase = useSessionDatabase();

    const [language, setLanguage] = useState<Language>('pt-br');
    const [name, setName] = useState('');
    const t = useTranslations(language);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setLanguage(user.language);
        }
    }, [user]);

    const languages = [
        { code: 'pt-br', label: t.settings.portuguese },
        { code: 'en', label: t.settings.english },
        { code: 'es', label: t.settings.spanish },
    ];

    function handleSave() {
        if (!user) return;
        const updates: { name?: string; email?: string; password?: string; language?: Language } = {};
        if (name.trim() && name.trim() !== user.name) updates.name = name.trim();
        if (email.trim() && email.trim() !== user.email) updates.email = email.trim();
        if (password.trim()) updates.password = password.trim();
        if (language !== user.language) updates.language = language;

        if (Object.keys(updates).length > 0) {
            updateProfile(user.id, updates, userDatabase);
            setPassword(''); // Limpa o campo de senha após salvar
            router.back();
        } else {
            Alert.alert(t.settings.noChanges, t.settings.noChangesMessage);
        }
    };  

    function handleLogout() {
        logout(sessionDatabase);
    }

    function handleDeleteAccount() {
        // Aqui você pode implementar a lógica para deletar a conta do usuário
        console.log('Conta deletada');
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[100] }}>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.keyboardAvoiding}
            >
                   <ScrollView 
                        contentContainerStyle={{ flexGrow: 1 }} 
                        keyboardShouldPersistTaps="handled"
                      >
                        
          
            <View style={styles.container}>
                {/* Botão de voltar */}

                <View  style={styles.backButtonContainer} >
                    <View >
                        <TouchableOpacity style={styles.backButton} onPress={router.back}>
                            <AntDesign name="arrowleft" size={24} color={colors.black} />
                        </TouchableOpacity>
                    </View>

                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.title}>{t.settings.title}</Text>
                </View>
                </View>

                {/* Seleção de idioma */}
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

                {/* Informações da conta */}
                <View style={styles.form}>
                    <Text style={styles.label}>{t.settings.newName}</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor={colors.gray[700]}
                        value={name}
                        onChangeText={setName}
                        editable={!isLoading}
                    />
                    <Text style={styles.label}>{t.common.email}</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor={colors.gray[700]}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isLoading}
                    />
                    <Text style={styles.label}>{t.settings.newPassword}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder={t.settings.newPasswordPlaceholder}
                            placeholderTextColor={colors.gray[700]}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather
                                name={showPassword ? "eye" : "eye-off"}
                                size={22}
                                color={colors.gray[700]}
                                style={{ marginLeft: 8 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Botões */}
                <View style={styles.bottomButtons}>
                    <Button
                        title={t.settings.saveChanges}
                        onPress={handleSave}
                        isProcessing={isLoading}
                    />
                    <Button
                        title={t.settings.logout}
                        onPress={handleLogout}
                    />
                    <TouchableOpacity
                        onPress={handleDeleteAccount}
                        activeOpacity={0.7}
                        >
                        <Text style={styles.deleteButtonText}>{t.settings.deleteAccount}</Text>
                    </TouchableOpacity>
                </View>
            </View>
                    </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
   keyboardAvoiding: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 8,
  },
    backButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },  
    backButton: {
        position: 'absolute',
        top: -26,
        left: 0,
        zIndex: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '400',
        marginBottom: 32,
        color: colors.black,
        alignSelf: 'center',
        fontFamily: fontFamily.regular
    },
    languageRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 32,
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
    form: {
        marginBottom: 32,
    },
    label: {
        fontSize: 16,
        color: colors.black,
        fontFamily: fontFamily.regular,
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 16,
        fontSize: 14,
        backgroundColor: colors.white,
    },
    bottomButtons: {
        marginTop: 'auto',
        marginBottom: 32,
        alignItems: 'center',
        gap: 16,
    },
    deleteButtonText: {
        color: colors.red[400],
        fontSize: 14,
    },
});