import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontFamily } from "@/theme";

export default function Settings() {
    const [language, setLanguage] = useState<'pt-br' | 'en' | 'es'>('pt-br');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const languages = [
        { code: 'pt-br', label: 'Português' },
        { code: 'en', label: 'English' },
        { code: 'es', label: 'Español' },
    ];

    function handleSave(){
        // Aqui você pode implementar a lógica para salvar as configurações do usuário
        console.log('Configurações salvas:', { language, name, email, password });
    };  

    function handleDeleteAccount() {
        // Aqui você pode implementar a lógica para deletar a conta do usuário
        console.log('Conta deletada');
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[100] }}>
            <View style={styles.container}>
                {/* Botão de voltar */}

                <View  style={styles.backButtonContainer} >
                    <View >
                        <TouchableOpacity style={styles.backButton} onPress={router.back}>
                            <AntDesign name="arrowleft" size={24} color={colors.black} />
                        </TouchableOpacity>
                    </View>

                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.title}>Configurações</Text>
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
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu nome completo"
                        placeholderTextColor={colors.gray[400]}
                        value={name}
                        onChangeText={setName}
                    />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="exemplo@email.com"
                        placeholderTextColor={colors.gray[400]}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Text style={styles.label}>Senha</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="************"
                            placeholderTextColor={colors.gray[400]}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Feather
                                name={showPassword ? "eye-off" : "eye"}
                                size={22}
                                color={colors.gray[400]}
                                style={{ marginLeft: 8 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Botões */}
                <View style={styles.bottomButtons}>
                    <TouchableOpacity 
                        onPress={handleSave}
                        activeOpacity={0.7}
                        style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleDeleteAccount}
                        activeOpacity={0.7}
                        >
                        <Text
                         style={styles.deleteButtonText}>DELETAR CONTA</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
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
        gap: 24,
    },
    saveButton: {
        backgroundColor: colors.gray[700],
        paddingVertical: 14,
        borderRadius: 50,
        alignItems: 'center',
        width: '100%',
        marginBottom: 12,
    },
    saveButtonText: {
        color: colors.black,
        fontSize: 16,
    },
    deleteButtonText: {
        color: colors.red[400],
        fontSize: 14,
    },
});