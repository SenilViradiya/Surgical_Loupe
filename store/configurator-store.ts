import { create } from "zustand";

interface ConfiguratorState {
  frameUrl?: string;

  lensUrl?: string;

  headlightUrl?: string;

  setFrame: (
    url: string
  ) => void;

  setLens: (
    url: string
  ) => void;

  setHeadlight: (
    url: string
  ) => void;
}

export const useConfiguratorStore =
  create<ConfiguratorState>(
    (set) => ({
      frameUrl: undefined,

      lensUrl: undefined,

      headlightUrl: undefined,

      setFrame: (url) =>
        set({
          frameUrl: url,
        }),

      setLens: (url) =>
        set({
          lensUrl: url,
        }),

      setHeadlight: (url) =>
        set({
          headlightUrl: url,
        }),
    })
  );