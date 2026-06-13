"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Aperture,
  Gauge,
  ShieldCheck,
  Sparkles,
  RotateCw,
  Sun,
  Feather,
  CircleDot,
  ArrowRight,
  Plus,
  Quote,
  Star,
} from "lucide-react";
import { useRef } from "react";

const stats = [
  { value: "27", label: "Years in precision optics" },
  { value: "4,200+", label: "Surgeons fitted" },
  { value: "38", label: "Dealer hubs worldwide" },
  { value: "0.02mm", label: "Optical tolerance" },
];

const models = [
  {
    name: "Meridian",
    tagline: "Everyday clinical precision",
    magnification: "2.5x",
    weight: "38g",
    material: "Titanium / Acetate",
    price: "from $1,450",
    image: "/images/meridian.png",
  },
  {
    name: "Vantage Pro",
    tagline: "Extended depth of field",
    magnification: "3.5x",
    weight: "44g",
    material: "Forged titanium",
    price: "from $2,180",
    image: "/images/vantage.png",
  },
  {
    name: "Apex Carbon",
    tagline: "Microsurgical reference standard",
    magnification: "5.5x",
    weight: "51g",
    material: "Carbon fiber / Titanium",
    price: "from $3,690",
    image: "/images/apex.png",
  },
];

const features = [
  {
    icon: Aperture,
    title: "Optical fidelity, engineered to spec",
    description:
      "Each lens is ground and coated to a measured tolerance, then paired to your interpupillary distance and working angle before it ever leaves the bench.",
    image: "/images/hero.png", // Reusing hero image for feature context
  },
  {
    icon: Gauge,
    title: "Configured in minutes, built in days",
    description:
      "Walk through frame, lens, and headlight selection with live pricing at every step. Our dealer network ensures your fit is verified before delivery.",
    image: "/images/vantage.png",
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative flex min-h-screen flex-col bg-slate-950 text-white selection:bg-amber-200/30">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-slate-950/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-200 to-amber-500 p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-slate-950">
                  <CircleDot className="h-4 w-4 text-amber-300" />
                </div>
              </div>
              <span className="font-display text-lg tracking-tight">
                LOUPE<span className="text-amber-400">.</span>
              </span>
            </Link>
            <div className="hidden items-center gap-6 text-sm font-medium text-white/50 lg:flex">
              <Link href="/configurator" className="transition hover:text-white">Configurator</Link>
              <Link href="#" className="transition hover:text-white">Models</Link>
              <Link href="#" className="transition hover:text-white">Dealers</Link>
              <Link href="#" className="transition hover:text-white">About</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-white/60 transition hover:text-white sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/configurator"
              className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10">Launch Configurator</span>
              <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center px-6 pt-20 lg:px-12">
        <div className="mx-auto grid w-full max-w-7xl lg:grid-cols-2 lg:items-center lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 space-y-8"
          >
            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-400"
              >
                Precision Surgical Optics
              </motion.p>
              <h1 className="font-display text-5xl leading-[1.1] text-white sm:text-7xl lg:text-8xl">
                Redefining the <br />
                <span className="text-white/40 italic">Optical Bench.</span>
              </h1>
            </div>
            <p className="max-w-lg text-lg leading-relaxed text-white/60">
              Hand-built medical loupes customized to your exact working distance. Experience unparalleled clarity and ergonomic balance designed for the modern surgeon.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/configurator"
                className="group flex items-center justify-center gap-3 rounded-full bg-amber-400 px-8 py-4 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
              >
                Start Your Configuration
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin"
                className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/10"
              >
                Dealer Portal
              </Link>
            </div>
          </motion.div>

          <motion.div
            style={{ y: heroImageY, opacity: heroOpacity }}
            className="relative mt-12 lg:mt-0"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl lg:aspect-square">
              <Image
                src="/images/hero.png"
                alt="Premium Surgical Loupes"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>
            {/* Floating Specs Badge */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl md:p-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Resolution</p>
                  <p className="mt-1 font-display text-2xl text-amber-200">Hyper-HD</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Tolerance</p>
                  <p className="mt-1 font-display text-2xl text-amber-200">±0.02mm</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background Gradients */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
      </section>

      {/* Stats/Trust Bar */}
      <section className="border-y border-white/5 bg-slate-950 shadow-2xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-2 gap-px bg-white/5 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-slate-950 py-12 px-8">
                <p className="font-display text-4xl text-white md:text-5xl lg:text-6xl">{stat.value}</p>
                <p className="mt-2 text-xs uppercase tracking-widest text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Models Showcase Section */}
      <section className="relative py-32 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="font-display text-4xl text-white sm:text-5xl">The 2026 Collection</h2>
            <p className="mt-4 text-white/50">Select a base model to begin your optical journey.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {models.map((model, idx) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 transition hover:border-amber-400/30"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={model.image}
                    alt={model.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent group-hover:via-slate-900/20" />
                </div>

                <div className="space-y-6 p-8 relative">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-2xl text-white">{model.name}</h3>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase text-white/40">{model.material}</span>
                    </div>
                    <p className="mt-2 text-sm text-white/50">{model.tagline}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-tighter text-white/30">Magnification</p>
                      <p className="text-sm font-medium text-white">{model.magnification}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-tighter text-white/30">Chassis Weight</p>
                      <p className="text-sm font-medium text-white">{model.weight}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-lg font-semibold text-amber-200">{model.price}</p>
                    <Link
                      href="/configurator"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-950 transition hover:bg-amber-400"
                    >
                      <Plus className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Configurator Teaser */}
      <section className="relative overflow-hidden bg-slate-900/50 py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="font-display text-4xl text-white sm:text-6xl">Infinite Control.</h2>
                <p className="max-w-md text-lg text-white/50">
                  Every element is choice. From the frame architecture to the specific LED lumens, build the tool that matches your surgery style.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-amber-400/10 p-2 text-amber-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Live Price Visualization</h4>
                    <p className="text-sm text-white/50">See investment totals adjust in real-time as you upgrade components.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-amber-400/10 p-2 text-amber-400">
                    <Sun className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Integrated Optics</h4>
                    <p className="text-sm text-white/50">Add the Solaris headlight system with shadowless focus tech.</p>
                  </div>
                </div>
              </div>

              <Link
                href="/configurator"
                className="inline-flex items-center gap-3 rounded-full border border-amber-400/30 bg-amber-400/5 px-8 py-4 text-sm font-bold text-amber-400 transition hover:bg-amber-400/10"
              >
                Enter the Configurator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Mock 3D Viewer */}
            <div className="group relative aspect-square overflow-hidden rounded-[3rem] bg-slate-950 border border-white/5 ring-1 ring-white/10 shadow-2xl">
              <Image
                src="/images/hero.png"
                alt="Configurator Mock"
                fill
                className="object-cover opacity-60 grayscale transition-all duration-1000 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
              />

              {/* Viewer UI Overlays */}
              <div className="absolute inset-x-8 top-8 flex items-center justify-between">
                <div className="rounded-full bg-black/40 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
                  Active View: 360° Rotate
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-2 w-2 rounded-full bg-white/20" />
                  ))}
                </div>
              </div>

              <div className="absolute inset-x-8 bottom-8 flex items-end justify-between">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 cursor-pointer rounded-full border-2 border-amber-400 bg-slate-800 transition hover:scale-110" />
                    <div className="h-10 w-10 cursor-pointer rounded-full border border-white/10 bg-amber-600 transition hover:scale-110" />
                    <div className="h-10 w-10 cursor-pointer rounded-full border border-white/10 bg-slate-500 transition hover:scale-110" />
                  </div>
                  <div className="text-xs text-white/40">Select Surface Material</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl text-white">
                  <RotateCw className="h-5 w-5 animate-spin-slow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections (Editorial) */}
      <section className="py-32 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-32">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className={`grid gap-16 lg:grid-cols-2 lg:items-center ${idx % 2 === 1 ? 'lg:direction-rtl' : ''}`}
            >
              <div className={`${idx % 2 === 1 ? 'lg:order-2' : ''} space-y-8`}>
                <div className="h-12 w-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-400">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-4xl text-white leading-tight">{feature.title}</h3>
                <p className="text-lg text-white/60 leading-relaxed font-light">
                  {feature.description}
                </p>
                <ul className="space-y-4 pt-4">
                  {["Medical-grade titanium", "Custom focal alignment", "Antibacterial coatings"].map(point => (
                    <li key={point} className="flex items-center gap-3 text-sm text-white/80">
                      <div className="h-1 w-4 rounded-full bg-amber-400" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
                <Image src={feature.image} alt={feature.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-slate-950/20" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 lg:px-12 bg-slate-900/30">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20">
            <h2 className="font-display text-4xl text-white">Trusted by the best.</h2>
            <p className="mt-4 text-white/50">Voices from the operating theatre.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {[
              {
                quote: "The clarity is unlike anything I've used in 15 years of orthopedics. The weight distribution makes 8-hour cases feel significantly shorter.",
                author: "Dr. Elena Vance",
                role: "Senior Orthopedic Surgeon",
                stars: 5
              },
              {
                quote: "Being able to configure my specific working angle through the digital portal saved weeks of back-and-forth. The precision is surgical.",
                author: "Dr. Marcus Chen",
                role: "Neurosurgeon",
                stars: 5
              }
            ].map((test, idx) => (
              <div key={idx} className="rounded-3xl border border-white/5 bg-slate-950 p-10 space-y-8">
                <div className="flex gap-1">
                  {[...Array(test.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="font-display text-2xl text-white/90 leading-relaxed">"{test.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-amber-200/10 flex items-center justify-center text-amber-200 font-bold">
                    {test.author[4]}
                  </div>
                  <div>
                    <p className="font-bold text-white">{test.author}</p>
                    <p className="text-xs text-white/40 uppercase tracking-widest">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative py-24 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[4rem] relative">
          {/* Mesh Gradient Background */}
          <div className="absolute inset-0 bg-slate-950" />
          <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-amber-500/20 blur-[100px]" />
          <div className="absolute -left-20 -bottom-20 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[100px]" />

          <div className="relative z-10 py-24 px-12 text-center flex flex-col items-center">
            <h2 className="font-display text-5xl text-white mb-8 sm:text-7xl">
              Ready to see <br />
              <span className="italic text-amber-400">differently?</span>
            </h2>
            <p className="max-w-xl text-lg text-white/60 mb-12">
              Join thousands of surgeons who have upgraded their clinical workflow. Configure your custom optics today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/configurator"
                className="rounded-full bg-white px-10 py-5 text-sm font-bold text-slate-950 transition hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-400/20"
              >
                Configure Your Loupes
              </Link>
              <Link
                href="#"
                className="rounded-full border border-white/20 bg-white/5 px-10 py-5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Speak to a Specialist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-12 lg:grid-cols-4 lg:gap-8">
            <div className="col-span-2 lg:col-span-1 space-y-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-md bg-amber-500" />
                <span className="font-display text-lg">LOUPE.</span>
              </Link>
              <p className="text-sm text-white/40 leading-relaxed max-w-[240px]">
                Providing precision optical solutions for medical professionals worldwide. Built on titanium. Focused on life.
              </p>
            </div>

            <div>
              <h5 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white">Product</h5>
              <ul className="space-y-4 text-sm text-white/40">
                <li><Link href="/configurator" className="transition hover:text-amber-400">Configurator</Link></li>
                <li><Link href="#" className="transition hover:text-amber-400">Models</Link></li>
                <li><Link href="#" className="transition hover:text-amber-400">Headlights</Link></li>
                <li><Link href="#" className="transition hover:text-amber-400">Accessories</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white">Company</h5>
              <ul className="space-y-4 text-sm text-white/40">
                <li><Link href="#" className="transition hover:text-amber-400">Our Story</Link></li>
                <li><Link href="#" className="transition hover:text-amber-400">Dealers</Link></li>
                <li><Link href="#" className="transition hover:text-amber-400">Clinical Studies</Link></li>
                <li><Link href="#" className="transition hover:text-amber-400">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white">Stay Focused</h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-amber-400"
                />
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-slate-950">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-[10px] text-white/30 uppercase tracking-widest">Newsletter for surgical updates.</p>
            </div>
          </div>

          <div className="mt-16 flex flex-col justify-between gap-8 border-t border-white/5 pt-8 sm:flex-row sm:items-center">
            <p className="text-[10px] uppercase tracking-widest text-white/30">
              © 2026 Surgical Loupe Precision Optics. All rights reserved.
            </p>
            <div className="flex gap-6 text-[10px] uppercase tracking-widest text-white/30">
              <Link href="#" className="hover:text-white">Privacy</Link>
              <Link href="#" className="hover:text-white">Terms</Link>
              <Link href="/admin" className="text-amber-400/60 hover:text-amber-400">Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
