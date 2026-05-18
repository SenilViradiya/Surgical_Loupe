import { create } from "zustand";

interface ConfiguratorState {
  frame?: {
    id: string;
    name: string;
    price: number;
    modelUrl: string;
  };

  lens?: {
    id: string;
    name: string;
    price: number;
    modelUrl: string;
  };

  headlight?: {
    id: string;
    name: string;
    price: number;
    modelUrl: string;
  };

  setFrame: (
    frame: ConfiguratorState["frame"]
  ) => void;

  setLens: (
    lens: ConfiguratorState["lens"]
  ) => void;

  setHeadlight: (
    headlight: ConfiguratorState["headlight"]
  ) => void;
}

export const useConfiguratorStore =
  create<ConfiguratorState>(
    (set) => ({
      frame: undefined,

      lens: undefined,

      headlight: undefined,

      setFrame: (
        frame
      ) =>
        set({
          frame,
        }),

      setLens: (
        lens
      ) =>
        set({
          lens,
        }),

      setHeadlight: (
        headlight
      ) =>
        set({
          headlight,
        }),
    })
  );