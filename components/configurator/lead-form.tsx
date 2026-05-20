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
      onSubmit={
        handleSubmit
      }
      className="space-y-4 rounded-2xl border bg-white p-6"
    >
      <h2 className="text-xl font-semibold">
        Request Quote
      </h2>

      <Input
        placeholder="Full Name"
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
        value={form.pincode}
        onChange={(e) =>
          setForm({
            ...form,

            pincode:
              e.target.value,
          })
        }
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Submitting..."
          : "Generate Quote"}
      </Button>
    </form>
  );
}