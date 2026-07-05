"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
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

    const validatedData = formSchema.safeParse(data);

    if (!validatedData.success) {
      console.log(validatedData.error.flatten().fieldErrors);
      return { success: false, message: "Invalid data. Please check your inputs." };
    }

    const { name, slug, tagline, description, websiteUrl, tags } = validatedData.data;
    
    const tagsArray = tags
      .split(",")
      .map((tag: string) => tag.trim().toLowerCase())
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

export const upvoteProductAction = async (productId: number) => {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      console.log("User not signed in");
      return {
        success: false,
        message: "You must be signed in to submit a product",
      };
    }

    if (!orgId) {
      console.log("User not a member of an organization");
      return {
        success: false,
        message: "You must be a member of an organization to submit a product",
      };
    }

    await db
      .update(products)
      .set({
        voteCount: sql`GREATEST(0, vote_count + 1)`,
      })
      .where(eq(products.id, productId));

    // Refreshes the home page grid
    revalidatePath("/");
    // Refreshes the individual product page cache
    revalidatePath("/products/[slug]", "page"); 

    return {
      success: true,
      message: "Product upvoted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to upvote product",
      voteCount: 0,
    };
  }
};

export const downvoteProductAction = async (productId: number) => {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      console.log("User not signed in");
      return {
        success: false,
        message: "You must be signed in to submit a product",
      };
    }

    if (!orgId) {
      console.log("User not a member of an organization");
      return {
        success: false,
        message: "You must be a member of an organization to submit a product",
      };
    }

    await db
      .update(products)
      .set({
        voteCount: sql`GREATEST(0, vote_count - 1)`,
      })
      .where(eq(products.id, productId));

    // Refreshes the home page grid
    revalidatePath("/");
    // Refreshes the individual product page cache
    revalidatePath("/products/[slug]", "page"); 

    return {
      success: true,
      message: "Product downvoted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to downvote product",
      voteCount: 0,
    };
  }
};