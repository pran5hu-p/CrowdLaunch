"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { Loader2Icon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { addProductAction } from "@/lib/products/product-actions";
import { cn } from "@/lib/utils";
import { formSchema, type ProductFormValues } from "@/lib/products/product-validations";

export default function ProductSubmitForm() {
    const [isPending, startTransition] = useTransition();
    const [submitState, setSubmitState] = useState<{ success: boolean; message: string } | null>(null);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            tagline: "",
            description: "",
            websiteUrl: "",
            tags: "",
        }
    })
    function onSubmit(values: ProductFormValues) {
        setSubmitState(null);
        startTransition(async () => {
            const result = await addProductAction(values);
            setSubmitState({ success: result.success, message: result.message });
            if (result.success) {
                form.reset();
            }
        });
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex flex-col gap-2 my-2">
                        <FieldLabel htmlFor={field.name}>Product Name</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="My Awesome Product"
                            autoComplete="off"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex flex-col gap-2 my-2">
                        <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="my-awesome-product"
                            autoComplete="off"
                        />
                        <FieldDescription>URL-friendly version of your product name</FieldDescription>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            {/* Tagline */}
            <Controller
                name="tagline"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex flex-col gap-2 my-2">
                        <FieldLabel htmlFor={field.name}>Tagline</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="A brief, catchy description"
                            autoComplete="off"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            {/* Description */}
            <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex flex-col gap-2 my-2">
                        <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                        <Textarea
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="Tell us more about your product..."
                            className="resize-none"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            {/* Website URL */}
            <Controller
                name="websiteUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex flex-col gap-2 my-2">
                        <FieldLabel htmlFor={field.name}>Website URL</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="https://yourproduct.com"
                            autoComplete="off"
                        />
                        <FieldDescription>Enter your product's website or landing page</FieldDescription>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            {/* Tags */}
            <Controller
                name="tags"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex flex-col gap-2 my-2">
                        <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="AI, Productivity, SaaS"
                            autoComplete="off"
                        />
                        <FieldDescription>Comma-separated tags (e.g., AI, SaaS, Productivity)</FieldDescription>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                {isPending ? (
                    <Loader2Icon className="size-4 animate-spin mr-2" />
                ) : (
                    <SparklesIcon className="size-4 mr-2" />
                )}
                {isPending ? "Submitting..." : "Submit Product"}
            </Button>
        </form>
    );
}