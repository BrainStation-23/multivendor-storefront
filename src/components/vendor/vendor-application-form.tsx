"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/lib/api/client";
import { submitVendorApplication } from "@/lib/api/vendors";
import { useAuth } from "@/lib/hooks/use-auth";

const vendorApplicationSchema = z.object({
  businessName: z.string().min(2, "Business name required"),
  businessType: z.enum(["individual", "company", "partnership"]),
  taxId: z.string().optional(),
  description: z.string().optional(),
});

type VendorApplicationValues = z.infer<typeof vendorApplicationSchema>;

type VendorApplicationFormProps = {
  locale: string;
};

type UploadResult = {
  doc?: { id?: string };
  id?: string;
};

function getMediaUploadUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api";
  return `${apiUrl.replace(/\/api$/, "")}/api/media`;
}

function getAdminPanelUrl() {
  const explicit = process.env.NEXT_PUBLIC_ADMIN_PANEL_URL;
  if (explicit) {
    return explicit;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010/api";
  return `${apiUrl.replace(/\/api$/, "")}/admin`;
}

async function uploadDocuments(files: FileList | null): Promise<string[]> {
  if (!files || files.length === 0) {
    return [];
  }

  const mediaUploadUrl = getMediaUploadUrl();
  const uploadedIds: string[] = [];

  for (const file of Array.from(files)) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(mediaUploadUrl, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const payload = (await response.json()) as UploadResult;
    const mediaId = payload?.doc?.id || payload?.id;

    if (!response.ok || !mediaId) {
      throw new Error("Unable to upload one or more documents.");
    }

    uploadedIds.push(mediaId);
  }

  return uploadedIds;
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    const body = error.body;
    if (body && typeof body === "object" && "message" in body) {
      const message = body.message;
      if (typeof message === "string") {
        return message;
      }
    }
    return `Request failed with status ${error.status}.`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to submit your application right now.";
}

export function VendorApplicationForm({ locale }: VendorApplicationFormProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const documentsInputRef = useRef<HTMLInputElement | null>(null);

  const loginHref = `/${locale}/auth/login?redirect=${encodeURIComponent(
    `/${locale}/become-a-vendor`,
  )}`;
  const adminPanelUrl = useMemo(() => getAdminPanelUrl(), []);

  const form = useForm<VendorApplicationValues>({
    resolver: zodResolver(vendorApplicationSchema),
    defaultValues: {
      businessName: "",
      businessType: "individual",
      taxId: "",
      description: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: VendorApplicationValues) {
    setSubmitError(null);
    try {
      const documentIds = await uploadDocuments(documentsInputRef.current?.files ?? null);

      await submitVendorApplication({
        businessName: values.businessName,
        businessType: values.businessType,
        taxId: values.taxId?.trim() || undefined,
        description: values.description?.trim() || undefined,
        documents: documentIds.length > 0 ? documentIds : undefined,
      });

      setIsSubmitted(true);
      form.reset();
      if (documentsInputRef.current) {
        documentsInputRef.current.value = "";
      }
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
        <p className="text-sm text-slate-600 dark:text-slate-300">Checking your account...</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
        <h2 className="text-lg font-semibold">Login to apply</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Sign in with your customer account to submit your vendor application.
        </p>
        <Link
          href={loginHref}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          Go to Login
        </Link>
      </section>
    );
  }

  if (user?.role === "vendor") {
    return (
      <section className="rounded-xl border border-slate-200 p-6 text-center dark:border-slate-800">
        <h2 className="text-lg font-semibold">You are already a vendor</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Your account already has vendor access. Open your vendor dashboard to manage products.
        </p>
        <Link
          href={adminPanelUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          Open Vendor Dashboard
        </Link>
      </section>
    );
  }

  if (isSubmitted) {
    return (
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/40">
        <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
          Application submitted
        </h2>
        <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
          Thanks for applying. Our team will review your request and contact you soon.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
      <h2 className="text-lg font-semibold">Vendor Application</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Provide your business information to apply as a marketplace vendor.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Business name</span>
          <input
            {...form.register("businessName")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
          {form.formState.errors.businessName ? (
            <p className="text-xs text-rose-600 dark:text-rose-300">
              {form.formState.errors.businessName.message}
            </p>
          ) : null}
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Business type</span>
          <select
            {...form.register("businessType")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="individual">Individual</option>
            <option value="company">Company</option>
            <option value="partnership">Partnership</option>
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Tax ID (optional)</span>
          <input
            {...form.register("taxId")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Business description (optional)</span>
          <textarea
            rows={4}
            {...form.register("description")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">KYC documents (optional)</span>
          <input
            ref={documentsInputRef}
            id="vendor-documents"
            type="file"
            multiple
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload documents if your verification flow requires them.
          </p>
        </label>

        {submitError ? (
          <p className="text-sm text-rose-600 dark:text-rose-300">{submitError}</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </section>
  );
}
