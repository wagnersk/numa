import { Tabs } from "expo-router"
 
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

 function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom > 0 ? insets.bottom - 8 : 16 }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Definindo o ícone conforme sua configuração original
        let iconName: keyof typeof MaterialIcons.glyphMap = "home";
        //if (route.name === "index") iconName = "home";

        if (route.name === "index") {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.sideButton}
              activeOpacity={0.8}
            >

            {isFocused ? (
                <MaterialCommunityIcons name="home-variant" size={26} color="black" />
            ) : (   
                <MaterialCommunityIcons name="home-variant-outline" size={26} color="black" />
            )
            }
            </TouchableOpacity>
          );
        }

        if (route.name === "analysis") {
            isFocused ? iconName = "pie-chart" : iconName = "pie-chart-outlined";
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.sideButton}
              activeOpacity={1}
            >
              <MaterialIcons name={iconName} size={28} color="#000" />
              
            </TouchableOpacity>
          );
        }

       // if (route.name === "analysis") iconName = "insert-chart";
        

        // Botão central maior (target)
        if (route.name === "target") {
              iconName = "add";
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress} 
              style={styles.centerButton}
              activeOpacity={1}
            >
              <MaterialIcons name={iconName} size={isFocused ? 32 : 28} color="#000" />
            </TouchableOpacity>
          );
        }

        // Botões normais
        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={1}
          >
            <MaterialIcons name={iconName} size={24} color="#000" />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


export default function TabsLayout(){
    return ( 
            <Tabs
               screenOptions={{  headerShown:false }}
               tabBar={(props) => <CustomTabBar {...props} />}
            >
                <Tabs.Screen name='index' options={{ title:'Home'}}/>
                <Tabs.Screen name='target' options={{title:'Metas'}}/>
                <Tabs.Screen name='analysis' options={{title:'Análise'}}/>
                
            </Tabs>

    )
} 

export const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor:  colors.gray[300],
    marginHorizontal: 24,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    height: 64,
    paddingHorizontal: 16, // garante centralização horizontal
  },
  tabButton: {
    height: "100%", // ocupa a altura da barra
    justifyContent: "center", // centraliza verticalmente
    alignItems: "center",
    flex: 1,
  },
  sideButton: {
    borderRadius: 41,
    top: 12, // sobe para cima da barra
  },
  centerButton: {
    width: 82,
    height: 82,
    backgroundColor: colors.gray[300],
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32, // sobe para cima da barra
    borderWidth: 2, // borda branca
    borderColor: colors.white,
    
  },
});