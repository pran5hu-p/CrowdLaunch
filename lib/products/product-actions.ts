"use server";

import { db } from "@/db/index";
import { products } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { formSchema, type ProductFormValues } from "./product-validations";


export const addProductAction = async (data: ProductFormValues) => {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return { success: false, message: "You must be signed in to submit a product." };
    }

    if (!orgId) {
      return { success: false, message: "You must be a member of an organization to submit a product." };
    }

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress || "anonymous";

    // 3. Server-side validation using the imported schema
    const validatedData = formSchema.safeParse(data);

    if (!validatedData.success) {
      console.log(validatedData.error.flatten().fieldErrors);
      return { success: false, message: "Invalid data. Please check your inputs." };
    }

    const { name, slug, tagline, description, websiteUrl, tags } = validatedData.data;
    
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);


    await db.insert(products).values({
      name,
      slug,
      tagline,
      description,
      websiteUrl,
      tags: tagsArray,
      status: "pending",
      submittedBy: userEmail,
      organizationId: orgId,
      userId,
    });

    revalidatePath("/");

    return { 
      success: true, 
      message: "Product submitted successfully! It will be reviewed shortly." 
    };

  } catch (error) {
    console.error("Database Insert Error:", error);
    
    if (error instanceof Error && error.message.includes("duplicate key value")) {
        return { success: false, message: "That slug is already taken. Please choose another." };
    }

    return { 
      success: false, 
      message: "Failed to submit product. Please try again later." 
    };
  }
};