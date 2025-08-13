// app/target/index.tsx
import { useRouter } from "expo-router";
import { TargetForm } from "@/components/TargetForm";
 
import { useLocalSearchParams } from "expo-router";



export default function NewTargetScreen() {
  const router = useRouter();
 

  const params = useLocalSearchParams<{id: string}>()
 console.log(typeof params.id)

  return (
    <TargetForm
      onEditColor={() => router.push("/stack/target/select-color")}
      onEditPhoto={() => router.push("/stack/target/select-image")}
      editting={params.id!=='[id]'?true:false}
      paramsId={params.id!=='[id]'===undefined?params.id:undefined}
    />
  );
}