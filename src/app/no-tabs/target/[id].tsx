import { useRouter } from "expo-router";
import { TargetForm } from "@/components/TargetForm";
 
import { useLocalSearchParams } from "expo-router";

export default function NewTargetScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{id: string}>()
    
  return (
    <TargetForm
      onEditColor={() => router.push("/stack/target/select-color")}
      onEditPhoto={() => router.push("/stack/target/select-image")}
      editting={params.id!=='[id]'?true:false}
      paramsId={params.id!=='[id]'?params.id:undefined}
    />
  );
}