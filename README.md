# numa
# 📱 Numa – Aplicativo de Metas Financeiras

**Numa** é um aplicativo mobile desenvolvido em **React Native** com **Expo** e **TypeScript**, que demonstra boas práticas de arquitetura, navegação e integração de serviços externos.  
O objetivo é oferecer uma experiência completa de **gestão de metas financeiras**, servindo também como **projeto de portfólio**.

---

## 🚀 Tecnologias Utilizadas

- **React Native 0.79** + **Expo 53**
- **TypeScript 5**
- **expo-router 5** (com os 3 tipos de navegação: stack, drawer e tabs)
- **SQLite (expo-sqlite)** para persistência local
- **Zustand** para gerenciamento de estado
- **Unsplash API** para seleção de imagens
- **Day.js** para manipulação de datas
- **React Native Gifted Charts** para gráficos
- **React Native Currency Input** para entrada monetária
- **React Native Circular Progress** para indicadores visuais
- **React Native BlurHash / Expo Blur / Expo Linear Gradient** para efeitos visuais
- **@expo-google-fonts/urbanist** para tipografia

---

## 🛠️ Funcionalidades

- 📋 **Cadastro de usuários** com suporte a múltiplos idiomas  
- 🎯 **Criação de metas financeiras** em diferentes moedas (BRL, USD, EUR)  
- 🖼️ **Customização de metas** com imagens da API do Unsplash  
- 🔎 **Filtros e listagem** para análise das metas  
- 📊 **Visualização gráfica** do progresso com dashboards dinâmicos  
- 🎨 UI moderna com **Blur, Gradients e animações suaves**

---

## 📂 Estrutura do Projeto

```
/numa
 ┣ 📂 app/              # Telas e rotas (expo-router)
 ┣ 📂 src/              # Lógica de negócios, stores e utils
 ┣ 📂 assets/           # Fonts e imagens
 ┣ 📂 android/ios/      # Configurações nativas
 ┣ 📜 package.json
 ┣ 📜 tsconfig.json
 ┗ 📜 app.json
```

---

## ▶️ Como Rodar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/wagnersk/numa.git
cd numa
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Rodar em dispositivo/emulador
```bash
➜  npx expo run:android     # Android
➜  npx expo run:ios        # iOS
```

---


| Tela inicial | Criação de meta | Dashboard |
|--------------|----------------|-----------|
| (img)        | (img)          | (img)     |

### 📸 Screenshots

| 🏠 Tela Inicial | 🏠 Tela com meta escolhida | ✍️ Tela detalhes |
|---------------|----------------|--------------------------|
|<img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2025-08-31 at 01 34 52" src="https://github.com/user-attachments/assets/ad0f7360-4150-4eb1-8817-85b0fec3e8d5" /> | <img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2025-08-31 at 01 35 12" src="https://github.com/user-attachments/assets/7ad9be7d-4924-46f7-be5e-7bebd5970749" /> | <img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2025-08-31 at 01 35 16" src="https://github.com/user-attachments/assets/cac7c598-b31e-40cf-aca4-42e6cc894bc2" />



| 📊 Tela Nova meta | 📊 Tela com meta escolhida  | 📈 Análise |
|-----------------|----------------------------|------------------|
|  <img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2025-08-31 at 01 51 37" src="https://github.com/user-attachments/assets/e6ed8175-bc2a-41c0-b842-b7e8e033afcc" /> |  <img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2025-08-31 at 01 51 31" src="https://github.com/user-attachments/assets/1ce291fb-796e-4885-bc63-dc4a79cf3dae" /> |  <img width="1206" height="2622" alt="Simulator Screenshot - iPhone 16 Pro - 2025-08-31 at 01 51 43" src="https://github.com/user-attachments/assets/23a0cd79-da45-4858-adf7-4e40e582e84d" /> |


---

## 🎯 Objetivo do Projeto

Este app foi criado como **projeto de portfólio** para demonstrar:  
- Uso avançado do **expo-router** com múltiplos tipos de navegação  
- Persistência local com **SQLite**  
- Integrações com APIs externas (Unsplash)  
- Criação de experiências ricas de **UI/UX** com gráficos e efeitos visuais  

---

## 📜 Licença

Este projeto é de uso pessoal e portfólio, sem fins comerciais.
