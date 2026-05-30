"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import { toast } from "sonner";

import { updateCompatibility } from "@/actions/compatibility/update-compatibility";
import type {
  CompatibilityCatalog,
  CompatibilitySnapshot,
} from "@/lib/compatibility/compatibility-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props extends CompatibilityCatalog {}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    totalPages,
    page: safePage,
  };
}

function getSourceTargets(snapshot: CompatibilitySnapshot, sourceType: "FRAME" | "LENS", sourceId: string, targetType: "LENS" | "HEADLIGHT") {
  if (sourceType === "FRAME" && targetType === "LENS") {
    return snapshot.frameLens.filter((relation) => relation.sourceId === sourceId).map((relation) => relation.targetId);
  }

  if (sourceType === "FRAME" && targetType === "HEADLIGHT") {
    return snapshot.frameHeadlight.filter((relation) => relation.sourceId === sourceId).map((relation) => relation.targetId);
  }

  if (sourceType === "LENS" && targetType === "HEADLIGHT") {
    return snapshot.lensHeadlight.filter((relation) => relation.sourceId === sourceId).map((relation) => relation.targetId);
  }

  return [] as string[];
}

export function CompatibilityManager({ frames, lenses, headlights, snapshot }: Props) {
  const [activeTab, setActiveTab] = useState<"frame" | "lens">("frame");
  const [isPending, startTransition] = useTransition();

  const [frameSearch, setFrameSearch] = useState("");
  const [lensSearch, setLensSearch] = useState("");
  const [headlightSearch, setHeadlightSearch] = useState("");

  const [framePage, setFramePage] = useState(1);
  const [lensPage, setLensPage] = useState(1);

  const [selectedFrameId, setSelectedFrameId] = useState(frames[0]?.id ?? "");
  const [selectedLensId, setSelectedLensId] = useState(lenses[0]?.id ?? "");

  const [frameLensSelection, setFrameLensSelection] = useState<string[]>([]);
  const [frameHeadlightSelection, setFrameHeadlightSelection] = useState<string[]>([]);
  const [lensHeadlightSelection, setLensHeadlightSelection] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedFrameId) return;

    const existingLensTargets = getSourceTargets(snapshot, "FRAME", selectedFrameId, "LENS");
    const existingHeadlightTargets = getSourceTargets(snapshot, "FRAME", selectedFrameId, "HEADLIGHT");

    setFrameLensSelection(existingLensTargets.length > 0 ? existingLensTargets : lenses.map((item) => item.id));
    setFrameHeadlightSelection(existingHeadlightTargets.length > 0 ? existingHeadlightTargets : headlights.map((item) => item.id));
  }, [headlights, lenses, selectedFrameId, snapshot]);

  useEffect(() => {
    if (!selectedLensId) return;

    const existingTargets = getSourceTargets(snapshot, "LENS", selectedLensId, "HEADLIGHT");
    setLensHeadlightSelection(existingTargets.length > 0 ? existingTargets : headlights.map((item) => item.id));
  }, [headlights, selectedLensId, snapshot]);

  const filteredFrames = useMemo(
    () =>
      frames.filter((frame) =>
        [frame.name, frame.slug].some((value) => value.toLowerCase().includes(frameSearch.toLowerCase()))
      ),
    [frameSearch, frames]
  );

  const filteredLenses = useMemo(
    () =>
      lenses.filter((lens) =>
        [lens.name, lens.slug, lens.magnification].some((value) => value.toLowerCase().includes(lensSearch.toLowerCase()))
      ),
    [lensSearch, lenses]
  );

  const filteredHeadlights = useMemo(
    () =>
      headlights.filter((headlight) =>
        [headlight.name, headlight.slug].some((value) => value.toLowerCase().includes(headlightSearch.toLowerCase()))
      ),
    [headlightSearch, headlights]
  );

  const frameSourcePage = paginate(filteredFrames, framePage, 6);
  const lensSourcePage = paginate(filteredLenses, lensPage, 6);

  const saveFrameRules = () => {
    if (!selectedFrameId) return;

    startTransition(async () => {
      const [lensResult, headlightResult] = await Promise.all([
        updateCompatibility({
          sourceType: "FRAME",
          sourceId: selectedFrameId,
          targetType: "LENS",
          targetIds: frameLensSelection,
        }),
        updateCompatibility({
          sourceType: "FRAME",
          sourceId: selectedFrameId,
          targetType: "HEADLIGHT",
          targetIds: frameHeadlightSelection,
        }),
      ]);

      if (!lensResult.success || !headlightResult.success) {
        toast.error("Failed to update frame compatibility");
        return;
      }

      toast.success("Frame compatibility saved");
    });
  };

  const saveLensRules = () => {
    if (!selectedLensId) return;

    startTransition(async () => {
      const result = await updateCompatibility({
        sourceType: "LENS",
        sourceId: selectedLensId,
        targetType: "HEADLIGHT",
        targetIds: lensHeadlightSelection,
      });

      if (!result.success) {
        toast.error("Failed to update lens compatibility");
        return;
      }

      toast.success("Lens compatibility saved");
    });
  };

  const toggleTarget = (selected: string[], id: string) =>
    selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "frame" | "lens")} className="space-y-6">
      <TabsList>
        <TabsTrigger value="frame">Frame Compatibility</TabsTrigger>
        <TabsTrigger value="lens">Lens Compatibility</TabsTrigger>
      </TabsList>

      <TabsContent value="frame" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <div className="space-y-2">
              <Input placeholder="Search frames" value={frameSearch} onChange={(event) => { setFrameSearch(event.target.value); setFramePage(1); }} />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Page {frameSourcePage.page} of {frameSourcePage.totalPages}</span>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" disabled={frameSourcePage.page <= 1} onClick={() => setFramePage((page) => Math.max(1, page - 1))}>Prev</Button>
                  <Button type="button" variant="outline" size="sm" disabled={frameSourcePage.page >= frameSourcePage.totalPages} onClick={() => setFramePage((page) => page + 1)}>Next</Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {frameSourcePage.items.map((frame) => (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => setSelectedFrameId(frame.id)}
                  className={`w-full rounded-2xl border p-3 text-left transition ${selectedFrameId === frame.id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                >
                  <div className="text-sm font-semibold">{frame.name}</div>
                  <div className="text-xs opacity-70">{frame.slug}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">Compatible Lenses</h3>
                  <p className="text-sm text-slate-500">Select which lenses can be paired with this frame.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setFrameLensSelection(lenses.map((item) => item.id))}>Select all</Button>
              </div>
              <Input placeholder="Search lenses" value={lensSearch} onChange={(event) => setLensSearch(event.target.value)} className="mb-4" />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredLenses.map((lens) => {
                  const selected = frameLensSelection.includes(lens.id);

                  return (
                    <button
                      key={lens.id}
                      type="button"
                      onClick={() => setFrameLensSelection((current) => toggleTarget(current, lens.id))}
                      className={`rounded-2xl border p-3 text-left transition ${selected ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{lens.name}</div>
                          <div className="text-xs text-slate-500">{lens.magnification}</div>
                        </div>
                        <div className="text-xs font-medium">{selected ? "Selected" : "Excluded"}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">Compatible Headlights</h3>
                  <p className="text-sm text-slate-500">Select which headlights can be paired with this frame.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setFrameHeadlightSelection(headlights.map((item) => item.id))}>Select all</Button>
              </div>
              <Input placeholder="Search headlights" value={headlightSearch} onChange={(event) => setHeadlightSearch(event.target.value)} className="mb-4" />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredHeadlights.map((headlight) => {
                  const selected = frameHeadlightSelection.includes(headlight.id);

                  return (
                    <button
                      key={headlight.id}
                      type="button"
                      onClick={() => setFrameHeadlightSelection((current) => toggleTarget(current, headlight.id))}
                      className={`rounded-2xl border p-3 text-left transition ${selected ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{headlight.name}</div>
                          <div className="text-xs text-slate-500">₹{headlight.price}</div>
                        </div>
                        <div className="text-xs font-medium">{selected ? "Selected" : "Excluded"}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={saveFrameRules} disabled={isPending}>Save Frame Compatibility</Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="lens" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <Input placeholder="Search lenses" value={lensSearch} onChange={(event) => { setLensSearch(event.target.value); setLensPage(1); }} />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Page {lensSourcePage.page} of {lensSourcePage.totalPages}</span>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" disabled={lensSourcePage.page <= 1} onClick={() => setLensPage((page) => Math.max(1, page - 1))}>Prev</Button>
                <Button type="button" variant="outline" size="sm" disabled={lensSourcePage.page >= lensSourcePage.totalPages} onClick={() => setLensPage((page) => page + 1)}>Next</Button>
              </div>
            </div>
            <div className="space-y-2">
              {lensSourcePage.items.map((lens) => (
                <button
                  key={lens.id}
                  type="button"
                  onClick={() => setSelectedLensId(lens.id)}
                  className={`w-full rounded-2xl border p-3 text-left transition ${selectedLensId === lens.id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                >
                  <div className="text-sm font-semibold">{lens.name}</div>
                  <div className="text-xs opacity-70">{lens.magnification}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">Compatible Headlights</h3>
                  <p className="text-sm text-slate-500">Select which headlights can be paired with this lens.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setLensHeadlightSelection(headlights.map((item) => item.id))}>Select all</Button>
              </div>
              <Input placeholder="Search headlights" value={headlightSearch} onChange={(event) => setHeadlightSearch(event.target.value)} className="mb-4" />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredHeadlights.map((headlight) => {
                  const selected = lensHeadlightSelection.includes(headlight.id);

                  return (
                    <button
                      key={headlight.id}
                      type="button"
                      onClick={() => setLensHeadlightSelection((current) => toggleTarget(current, headlight.id))}
                      className={`rounded-2xl border p-3 text-left transition ${selected ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{headlight.name}</div>
                          <div className="text-xs text-slate-500">₹{headlight.price}</div>
                        </div>
                        <div className="text-xs font-medium">{selected ? "Selected" : "Excluded"}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={saveLensRules} disabled={isPending}>Save Lens Compatibility</Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
