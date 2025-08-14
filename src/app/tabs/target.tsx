// app/target/index.tsx
import React from "react";
import { useRouter } from "expo-router";
import { TargetForm } from "@/components/TargetForm";

export default function NewTargetScreen() {
  const router = useRouter();

  return (
    <TargetForm
    onEditColor={() => router.push("/stack/target/select-color")}
    onEditPhoto={() => router.push("/stack/target/select-image")}
    paramsId={undefined}
    editting={false}
    />
  );
}