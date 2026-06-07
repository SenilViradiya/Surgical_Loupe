import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { z } from "zod";
import path from "path";

const schema = z.object({
  templateId: z.string().min(1),
  subject: z.string().optional(),
});

const TEMPLATES_PATH = path.resolve(process.cwd(), "config", "email-templates.json");

async function readTemplates() {
  try {
    const raw = await fs.readFile(TEMPLATES_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

async function writeTemplates(obj: any) {
  await fs.mkdir(path.dirname(TEMPLATES_PATH), { recursive: true });
  await fs.writeFile(TEMPLATES_PATH, JSON.stringify(obj, null, 2), "utf-8");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const templateId = url.searchParams.get("templateId");

    const data = await readTemplates();

    if (templateId) {
      return NextResponse.json({ template: data[templateId] ?? null });
    }

    return NextResponse.json({ templates: data });
  } catch (error: any) {

    return NextResponse.json({ templates: {} });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = schema.parse(body);

    const data = await readTemplates();

    data[parsed.templateId] = {
      ...(data[parsed.templateId] ?? {}),
      subject: parsed.subject ?? data[parsed.templateId]?.subject ?? "",
      updatedAt: new Date().toISOString(),
    };

    await writeTemplates(data);

    return NextResponse.json({ success: true });
  } catch (error: any) {

    return NextResponse.json({ success: false, message: error?.message ?? "Failed" }, { status: 500 });
  }
}
