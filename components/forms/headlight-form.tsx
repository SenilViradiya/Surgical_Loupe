"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { useForm, type SubmitHandler } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import {
  ProductStatus,
} from "@/lib/generated/prisma";

import {
  headlightSchema,
} from "@/lib/validations/headlight";

import { updateHeadlight } from "@/actions/headlights/update-headlight";

import { createHeadlight } from "@/actions/headlights/create-headlight";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ImageUpload } from "@/components/shared/image-upload";

import { ModelUpload } from "@/components/shared/model-upload";

import { Headlight } from "@/lib/generated/prisma";

interface Props {
  initialData?: Headlight | null;

  isEdit?: boolean;
}

export function HeadlightForm({
  initialData,
  isEdit,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const form = useForm<z.input<typeof headlightSchema>>({
    resolver: zodResolver(headlightSchema),

    defaultValues: {
      name:
        initialData?.name ?? "",

      slug:
        initialData?.slug ?? "",

      description:
        initialData?.description ?? "",

      thumbnailUrl:
        initialData?.thumbnailUrl ?? "",

      modelUrl:
        initialData?.modelUrl ?? "",

      price:
        initialData?.price ?? 0,

      status:
        initialData?.status ??
        ProductStatus.ACTIVE,
    },
  });

  const onSubmit: SubmitHandler<
    z.input<typeof headlightSchema>
  > = (values) => {
    startTransition(async () => {
      const response = isEdit
        ? await updateHeadlight(
            initialData!.id,
            values
          )
        : await createHeadlight(values);

      if (!response.success) {
        toast.error(response.message);

        return;
      }

      toast.success(response.message);

      router.push("/admin/headlights");
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit
        )}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Headlight name"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Slug
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="headlight-slug"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Thumbnail
              </FormLabel>

              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={(url) => {
                    form.setValue(
                      "thumbnailUrl",
                      url,
                      {
                        shouldValidate: true,
                      }
                    );
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="modelUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                GLB Model
              </FormLabel>

              <FormControl>
                <ModelUpload
                  value={field.value ?? ""}
                  onChange={(url) => {
                    form.setValue(
                      "modelUrl",
                      url,
                      {
                        shouldValidate: true,
                      }
                    );
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Price
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  value={field.value as unknown as number | undefined}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Status
              </FormLabel>

              <Select
                onValueChange={
                  field.onChange
                }
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {Object.values(
                    ProductStatus
                  ).map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
        >
          {isEdit ? "Update" : "Create"} Headlight
        </Button>
      </form>
    </Form>
  );
}
