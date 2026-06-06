"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Frame, Headlight, Lens } from "@/lib/generated/prisma";

import { ConfiguratorScene, type ConfiguratorSceneHandle } from "@/components/3d/configurator-scene";
import { FrameSelector } from "@/components/configurator/frame-selector";
import { LensSelector } from "@/components/configurator/lens-selector";
import { HeadlightSelector } from "@/components/configurator/headlight-selector";
import { ConfigSummary } from "@/components/configurator/config-summary";
import { LeadForm } from "@/components/configurator/lead-form";
import ConfiguratorStepper from "@/components/configurator/configurator-stepper";
import ConfiguratorLayout from "@/components/configurator/configurator-layout";
import StickySummary from "@/components/configurator/sticky-summary";

type StepId = "frame" | "lens" | "headlight" | "review" | "quote";

interface Props {
  frames: Frame[];
  lenses: Lens[];
  headlights: Headlight[];
}

const STEP_IDS: StepId[] = ["frame", "lens", "headlight", "review", "quote"];

export function ConfiguratorWorkspace({
  frames,
  lenses,
  headlights,
}: Props) {
  const sceneRef = useRef<ConfiguratorSceneHandle | null>(null);
  const sectionRefs = useRef<Record<StepId, HTMLElement | null>>({
    frame: null,
    lens: null,
    headlight: null,
    review: null,
    quote: null,
  });
  const [activeStep, setActiveStep] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState<Record<StepId, boolean>>({
    frame: true,
    lens: false,
    headlight: false,
    review: false,
    quote: false,
  });

  const steps = useMemo(
    () => [
      { label: "Frame", id: "frame" },
      { label: "Lens", id: "lens" },
      { label: "Headlight", id: "headlight" },
      { label: "Review", id: "review" },
      { label: "Quote Request", id: "quote" },
    ],
    []
  );

  useEffect(() => {
    const elements = STEP_IDS.map((id) => sectionRefs.current[id]).filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible?.target) return;

        const stepId = visible.target.getAttribute("data-step-id") as StepId | null;

        if (stepId) {
          setRevealedSteps((current) => ({
            ...current,
            [stepId]: true,
          }));
        }

        const index = STEP_IDS.findIndex((id) => id === stepId);

        if (index >= 0) {
          setActiveStep(index);
        }
      },
      {
        threshold: [0.2, 0.35, 0.5, 0.75],
        rootMargin: "-18% 0px -55% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const scrollToStep = (index: number) => {
    const id = STEP_IDS[index];

    setRevealedSteps((current) => ({
      ...current,
      [id]: true,
    }));

    setActiveStep(index);

    const element = sectionRefs.current[id] ?? document.getElementById(id);

    if (!element) return;

    const stickyOffset = 132;
    const targetTop = element.getBoundingClientRect().top + window.scrollY - stickyOffset;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  };

  return (
    <ConfiguratorLayout
      aside={
        <StickySummary>
          <ConfigSummary />
        </StickySummary>
      }
    >
      <div className="space-y-6 sm:space-y-8">
        <div className="space-y-4 animate-[fadeInUp_600ms_ease-out]">
          <p className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/80 px-4 py-1 text-xs font-medium tracking-[0.24em] text-slate-600 uppercase shadow-sm backdrop-blur">
            Precision configurator
          </p>

          <h1 className="max-w-3xl font-display text-4xl leading-tight text-slate-950 md:text-5xl lg:text-6xl">
            Build a loupe setup that feels calibrated for the clinic, not just configured on a screen.
          </h1>

          <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Compare frame, lens, and headlight combinations in one flow. The preview updates as you select each part, while the page gives your customer a clear explanation of what they are choosing and why it matters.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Precision fit",
                value: "Frame, lens, and light stay aligned as you browse",
              },
              {
                label: "Guided selection",
                value: "Every option is presented with context, pricing, and preview",
              },
              {
                label: "Fast quote flow",
                value: "Submit a polished request without leaving the page",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur"
              >
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <section id="preview" className="space-y-4 scroll-mt-28 animate-[fadeInUp_700ms_ease-out]">
          <div className="relative rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_32px_80px_-34px_rgba(15,23,42,0.4)] sm:p-5">
            <div className="mb-4 flex flex-col gap-4 px-1 pt-1 sm:flex-row sm:items-center sm:justify-between sm:px-2">
              <div>
                <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">Live preview</p>
                <h2 className="mt-2 font-heading text-2xl text-slate-950">Main configuration</h2>
              </div>

              <div className="self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
                3D canvas
              </div>
            </div>

            <ConfiguratorScene ref={sceneRef} initialFrame={undefined} />
          </div>
        </section>

        <ConfiguratorStepper current={activeStep} steps={steps} onStepClick={scrollToStep} />

        <section
          id="frame"
          ref={(node) => {
            sectionRefs.current.frame = node;
          }}
          data-step-id="frame"
          className={
            "scroll-mt-32 rounded-[2rem] border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur transition-all duration-500 sm:p-5 " +
            (revealedSteps.frame ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")
          }
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">Step 1</p>
          <div className="mt-4">
            <FrameSelector frames={frames} />
          </div>
        </section>

        <section
          id="lens"
          ref={(node) => {
            sectionRefs.current.lens = node;
          }}
          data-step-id="lens"
          className={
            "scroll-mt-32 rounded-[2rem] border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur transition-all duration-500 sm:p-5 " +
            (revealedSteps.lens ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")
          }
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">Step 2</p>
          <div className="mt-4">
            <LensSelector lenses={lenses} />
          </div>
        </section>

        <section
          id="headlight"
          ref={(node) => {
            sectionRefs.current.headlight = node;
          }}
          data-step-id="headlight"
          className={
            "scroll-mt-32 rounded-[2rem] border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur transition-all duration-500 sm:p-5 " +
            (revealedSteps.headlight ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")
          }
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">Step 3</p>
          <div className="mt-4">
            <HeadlightSelector headlights={headlights} />
          </div>
        </section>

        <section
          id="review"
          ref={(node) => {
            sectionRefs.current.review = node;
          }}
          data-step-id="review"
          className={
            "scroll-mt-32 rounded-[2rem] border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur transition-all duration-500 sm:p-6 " +
            (revealedSteps.review ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")
          }
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">Step 4</p>
          <h2 className="mt-2 font-heading text-2xl text-slate-950">Review configuration</h2>

          <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
            <p>
              Share your contact details and our team can review the selected configuration, confirm compatibility, and prepare the next recommendation.
            </p>

            <p>
              The quote request keeps the experience focused on the customer journey, with enough context to feel reassuring without becoming cluttered.
            </p>
          </div>
        </section>

        <section
          id="quote"
          ref={(node) => {
            sectionRefs.current.quote = node;
          }}
          data-step-id="quote"
          className={
            "scroll-mt-32 transition-all duration-500 " +
            (revealedSteps.quote ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")
          }
        >
          <div className="transition-shadow duration-300">
            <LeadForm />
          </div>
        </section>
      </div>
    </ConfiguratorLayout>
  );
}

export default ConfiguratorWorkspace;