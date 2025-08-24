import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer screenOptions={{ headerShown: true }}>
            <Drawer.Screen name="legend" options={{ title: "Metas" }} />
          </Drawer>
        </GestureHandlerRootView>
  );
}