"use server";

import { promises as fs } from "fs";
import path from "path";
import { Settings } from "@/lib/validations/setting";

const SETTINGS_PATH = path.resolve(process.cwd(), "config", "settings.json");

export async function getSettings(): Promise<Settings> {
  try {
    const raw = await fs.readFile(SETTINGS_PATH, "utf-8");
    const data = JSON.parse(raw);

    return data as Settings;
  } catch (err) {
    return {} as Settings;
  }
}
