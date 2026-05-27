"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateDealerProfile } from "@/actions/dealers/update-profile";
import { ImageUpload } from "@/components/shared/image-upload";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function DealerOnboardingProfilePage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [businessDetails, setBusinessDetails] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [address, setAddress] = useState("");
  const [serviceRegions, setServiceRegions] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await updateDealerProfile({
        companyName,
        businessDetails,
        address,
        serviceRegions,
        phone,
        city,
        state: stateVal,
        photoUrl,
      });

      if (!res || !res.success) {
        toast.error(res?.message ?? "Unable to update profile");
        return;
      }

      toast.success("Profile completed — welcome aboard");

      router.push("/dealer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-6 rounded-2xl border bg-white p-8 shadow-sm"
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Complete your dealer profile</h1>
          <p className="text-muted-foreground text-sm">
            Fill company details and service regions to activate your dealer dashboard.
          </p>
        </div>

        <ImageUpload value={photoUrl} onChange={(url) => setPhotoUrl(url)} />

        <Input
          placeholder="Company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <Textarea
          placeholder="Business details (GST, licenses, etc.)"
          value={businessDetails}
          onChange={(e) => setBusinessDetails(e.target.value)}
        />

        <Textarea
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <Input
          placeholder="Service regions (comma-separated pincodes or cities)"
          value={serviceRegions}
          onChange={(e) => setServiceRegions(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <Input
          placeholder="State"
          value={stateVal}
          onChange={(e) => setStateVal(e.target.value)}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Complete Profile"}
        </Button>
      </form>
    </div>
  );
}
