"use client";

import { useState } from "react";

import { toast } from "sonner";

import { createDealer } from "@/actions/dealers/create-dealer";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

export function DealerForm() {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",

      email: "",

      phone: "",

      city: "",

      state: "",
    });

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        setLoading(true);

        const response =
          await createDealer(
            form
          );

        if (
          response.success
        ) {
          toast.success(
            "Dealer created"
          );

          setForm({
            name: "",

            email: "",

            phone: "",

            city: "",

            state: "",
          });
        } else {
          toast.error(
            "Failed to create dealer"
          );
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="grid gap-4 rounded-2xl border bg-white p-6 md:grid-cols-2"
    >
      <Input
        placeholder="Dealer Name"
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name:
              e.target.value,
          })
        }
      />

      <Input
        placeholder="Email"
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

      <Button
        disabled={loading}
        type="submit"
        className="md:col-span-2"
      >
        {loading
          ? "Creating..."
          : "Create Dealer"}
      </Button>
    </form>
  );
}