import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { requireActionRole } from "@/lib/authorization";
import { UserRole } from "@/lib/generated/prisma";

const schema = z.object({
  siteTitle: z.string().optional(),
  supportEmail: z.string().email().optional(),
  supportPhone: z.string().optional(),
  defaultFromName: z.string().optional(),
  enableRegistration: z.boolean().optional(),
});

const SETTINGS_PATH = path.resolve(process.cwd(), "config", "settings.json");

async function readSettings() {
  try {
    const raw = await fs.readFile(SETTINGS_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

async function writeSettings(obj: any) {
  await fs.mkdir(path.dirname(SETTINGS_PATH), { recursive: true });
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(obj, null, 2), "utf-8");
}

export async function GET() {
  try {
    const data = await readSettings();

    return NextResponse.json({ settings: data });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ settings: {} }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireActionRole([UserRole.ADMIN]);

    const body = await req.json();

    const parsed = schema.parse(body);

    const current = await readSettings();

    const updated = {
      ...current,
      ...parsed,
      updatedAt: new Date().toISOString(),
    };

    await writeSettings(updated);

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error?.message ?? "Failed" }, { status: 500 });
  }
}
