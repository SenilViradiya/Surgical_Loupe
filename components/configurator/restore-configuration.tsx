"use client";

import { useEffect } from "react";

import {
  Configuration,
  Frame,
  Lens,
  Headlight,
} from "@/lib/generated/prisma";

import { useConfiguratorStore } from "@/store/configurator-store";

interface Props {
  configuration: Configuration & {
    frame: Frame;

    lens: Lens;

    headlight: Headlight | null;
  };
}

export function RestoreConfiguration({
  configuration,
}: Props) {
  const {
    setFrame,
    setLens,
    setHeadlight,
  } =
    useConfiguratorStore();

  useEffect(() => {
    setFrame({
      id:
        configuration.frame.id,

      name:
        configuration.frame.name,

      price:
        configuration.frame.price,

      modelUrl:
        configuration.frame.modelUrl,
    });

    setLens({
      id:
        configuration.lens.id,

      name:
        configuration.lens.name,

      price:
        configuration.lens.price,

      modelUrl:
        configuration.lens.modelUrl ??
        "",
    });

    if (
      configuration.headlight
    ) {
      setHeadlight({
        id:
          configuration.headlight.id,

        name:
          configuration.headlight.name,

        price:
          configuration.headlight.price,

        modelUrl:
          configuration.headlight.modelUrl ??
          "",
      });
    }
  }, [
    configuration,
    setFrame,
    setLens,
    setHeadlight,
  ]);

  return null;
}