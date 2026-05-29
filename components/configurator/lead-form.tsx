"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { createConfiguration } from "@/actions/configurations/create-configuration";

import { createLead } from "@/actions/leads/create-lead";

import { useConfiguratorStore } from "@/store/configurator-store";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { sendLeadEmail } from "@/actions/emails/send-lead-email";

export function LeadForm() {
  const router = useRouter();

  const {
    frame,
    lens,
    headlight,
  } =
    useConfiguratorStore();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      fullName: "",

      email: "",

      phone: "",

      city: "",

      state: "",

      pincode: "",
    });

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (
        !frame ||
        !lens
      ) {
        toast.error(
          "Please select frame and lens"
        );

        return;
      }

      try {
        setLoading(true);

        const configuration =
          await createConfiguration({
            frameId: frame.id,

            lensId: lens.id,

            headlightId:
              headlight?.id,
          });

        if (
          !configuration.success ||
          !configuration.configurationId
        ) {
          toast.error(
            "Failed to save configuration"
          );

          return;
        }

        const lead =
          await createLead({
            ...form,

            configurationId:
              configuration.configurationId,
          });

        if (
          !lead.success
        ) {
          toast.error(
            "Failed to submit lead"
          );

          return;
        }
        await sendLeadEmail({
          customerEmail:
            form.email,

          customerName:
            form.fullName,

          frameName:
            frame.name,

          lensName:
            lens.name,
        });

        toast.success(
          "Quote request submitted"
        );

        router.push(
          `/configurator/${configuration.configurationId}`
        );
      } catch (error) {
        console.log(error);

        toast.error(
          "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <form
      id="lead-form"
      onSubmit={
        handleSubmit
      }
      className="space-y-4 rounded-[2rem] border border-slate-200/80 bg-white/88 p-4 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.28)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_22px_54px_-28px_rgba(15,23,42,0.32)] sm:p-6"
    >
      <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
        Request quote
      </p>

      <h2 className="font-heading text-2xl text-slate-950">
        Request Quote
      </h2>

      <p className="text-sm leading-6 text-slate-600">
        Leave your details and we will prepare a tailored response based on the exact configuration you built.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          placeholder="Full Name"
          className="h-11 rounded-xl border-slate-200/80 bg-slate-50/85 transition-all duration-200 hover:bg-white focus-visible:bg-white sm:col-span-2"
          value={
            form.fullName
          }
          onChange={(e) =>
            setForm({
              ...form,

              fullName:
                e.target.value,
            })
          }
        />

        <Input
          placeholder="Email"
          type="email"
          className="h-11 rounded-xl border-slate-200/80 bg-slate-50/85 transition-all duration-200 hover:bg-white focus-visible:bg-white sm:col-span-2"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,

              email:
                e.target.value,
            })
          }
        />

        <Input
          placeholder="Phone"
          className="h-11 rounded-xl border-slate-200/80 bg-slate-50/85 transition-all duration-200 hover:bg-white focus-visible:bg-white"
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,

              phone:
                e.target.value,
            })
          }
        />

        <Input
          placeholder="City"
          className="h-11 rounded-xl border-slate-200/80 bg-slate-50/85 transition-all duration-200 hover:bg-white focus-visible:bg-white"
          value={form.city}
          onChange={(e) =>
            setForm({
              ...form,

              city:
                e.target.value,
            })
          }
        />

        <Input
          placeholder="State"
          className="h-11 rounded-xl border-slate-200/80 bg-slate-50/85 transition-all duration-200 hover:bg-white focus-visible:bg-white"
          value={form.state}
          onChange={(e) =>
            setForm({
              ...form,

              state:
                e.target.value,
            })
          }
        />

        <Input
          placeholder="Pincode"
          className="h-11 rounded-xl border-slate-200/80 bg-slate-50/85 transition-all duration-200 hover:bg-white focus-visible:bg-white"
          value={form.pincode}
          onChange={(e) =>
            setForm({
              ...form,

              pincode:
                e.target.value,
            })
          }
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-full bg-slate-950 text-white shadow-[0_12px_28px_-16px_rgba(15,23,42,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-18px_rgba(15,23,42,0.68)] active:translate-y-0"
      >
        {loading
          ? "Submitting..."
          : "Generate Quote"}
      </Button>
    </form>
  );
}