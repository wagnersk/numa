import { useNavigation } from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";
import LegendScreen from "./legend";

export default function AnalysisLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => <LegendScreen {...props} />}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Análise",
        }}
      />
      <Drawer.Screen
        name="legend"
        options={{
          title: "Legenda",
        }}
      />
    </Drawer>
  );
}