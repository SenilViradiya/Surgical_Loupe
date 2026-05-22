"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { useForm, type SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { dealerProfileSchema } from "@/lib/validations/dealer";
import { z } from "zod";

import { updateDealerProfile } from "@/actions/dealers/update-profile";

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

interface Props {
  initialData?: any;
}

export default function DealerProfileForm({ initialData }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof dealerProfileSchema>>({
    resolver: zodResolver(dealerProfileSchema),
    defaultValues: {
      companyName: initialData?.companyName ?? "",
      businessDetails: initialData?.businessDetails ?? "",
      address: initialData?.address ?? "",
      serviceRegions: initialData?.serviceRegions ?? "",
      phone: initialData?.phone ?? "",
      city: initialData?.city ?? "",
      state: initialData?.state ?? "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof dealerProfileSchema>> = (
    values
  ) => {
    startTransition(async () => {
      const res = await updateDealerProfile(values as any);

      if (!res?.success) {
        toast.error(res?.message ?? "Could not save profile");

        return;
      }

      toast.success(res.message);

      router.push("/dealer");
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>

              <FormControl>
                <Input placeholder="Company" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>

              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>

              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceRegions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Regions</FormLabel>

              <FormControl>
                <Input placeholder="Regions" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            Save Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
