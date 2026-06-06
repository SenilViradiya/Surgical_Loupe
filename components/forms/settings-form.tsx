"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { settingsSchema } from "@/lib/validations/setting";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// use native checkbox input

interface Props {
  defaultValues: z.input<typeof settingsSchema>;
}

export function SettingsForm({ defaultValues }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.input<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<z.input<typeof settingsSchema>> = (
    values
  ) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          toast.error(json.message ?? "Failed to save settings");
          return;
        }

        toast.success("Settings saved");
        router.refresh();
      } catch (err: any) {

        toast.error("Failed to save settings");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="siteTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Title</FormLabel>
              <FormControl>
                <Input placeholder="Surgical Loupe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supportEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Support Email</FormLabel>
              <FormControl>
                <Input placeholder="support@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supportPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Support Phone</FormLabel>
              <FormControl>
                <Input placeholder="+1 555 555 5555" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultFromName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default From Name</FormLabel>
              <FormControl>
                <Input placeholder="Surgical Loupe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enableRegistration"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 rounded border"
                />
              </FormControl>
              <div className="space-y-0.5">
                <FormLabel className="text-sm">Enable Registration</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Form>
  );
}
