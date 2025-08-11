import { create } from "zustand";
import { UnsplashPhoto } from "@/services/UnsplashService";

export interface TempTargetData {
  photo: UnsplashPhoto | null;
  color: string | null;
}

interface TargetStore {
  target: TempTargetData;
  setTempTarget: (target: Partial<TempTargetData>) => void; // atualizar parcialmente
  resetTempTarget: () => void; // resetar para estado inicial
}

const initialTarget: TempTargetData = {
  photo: null,
  color: null,
};

export const useTargetStore = create<TargetStore>((set) => ({
  target: initialTarget,

  setTempTarget: (newData: Partial<TempTargetData>) =>
    set((state) => ({
      target: { ...state.target, ...newData },
    })),

  resetTempTarget: () => set({ target: initialTarget }),
}));