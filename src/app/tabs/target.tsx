// app/target/index.tsx
import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { TargetForm } from "@/components/TargetForm";

export default function NewTargetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  return (
    <TargetForm
      onEditColor={() => router.push("/stack/target/select-color")}
      onEditPhoto={() => router.push("/stack/target/select-image")}
      paramsId={params.id}
      editting={!!params.id}
    />
  );
}