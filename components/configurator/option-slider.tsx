"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function OptionSlider({
  title,
  description,
  children,
  className,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const element = scrollerRef.current;

    if (!element) return;

    setCanScrollLeft(element.scrollLeft > 0);
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 1
    );
  };

  useEffect(() => {
    updateScrollState();

    const element = scrollerRef.current;

    if (!element) return;

    const handleResize = () => updateScrollState();

    element.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      element.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };

    function handleScroll() {
      updateScrollState();
    }
  }, []);

  const scrollByCard = (direction: "left" | "right") => {
    const element = scrollerRef.current;

    if (!element) return;

    const distance = Math.min(element.clientWidth * 0.8, 880);

    element.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-heading text-lg text-slate-950">{title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => scrollByCard("left")}
            disabled={!canScrollLeft}
            aria-label={`Scroll ${title.toLowerCase()} left`}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => scrollByCard("right")}
            disabled={!canScrollRight}
            aria-label={`Scroll ${title.toLowerCase()} right`}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300/80 px-2"
        onScroll={updateScrollState}
        // Improve mobile touch behavior: enable native momentum scrolling and prioritize horizontal pan
        style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
      >
        {children}
      </div>
    </div>
  );
}
