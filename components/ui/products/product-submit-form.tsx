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

// import { addProductAction } from "@/lib/products/product-actions";
import { cn } from "@/lib/utils";

// 1. Zod Schema
const formSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters long"),
    slug: z.string().min(2, "Slug must be at least 2 characters long").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)"),
    tagline: z.string().min(5, "tagline is required and must be at least 5 characters long").max(100, "tagline must be less than 100 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long").max(1000, "Description must be less than 1000 characters long"),
    websiteUrl: z.string().url("Must be a valid URL"),
    tags: z.string().min(1, "At least one tag is required"),
})

export default function ProductSubmitForm() {
    const form = useForm<z.infer<typeof formSchema>>({
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
    const OnSubmit = async (data: z.infer<typeof formSchema>) => {
        await addProductAction(data)
    }
    
    return (
        <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-6">
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

            <Button type="submit" size="lg" className="w-full">
                Submit Product
            </Button>
        </form>
    );
}