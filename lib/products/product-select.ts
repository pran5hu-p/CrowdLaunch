import {db} from "@/db/index"
import { products } from "@/db/schema"
import {eq, desc} from "drizzle-orm"

export async function getFeaturedProducts() {
    const productsData = await db.select().from(products).where(eq(products.status, "approved")).orderBy(desc(products.voteCount))
    
    return productsData
}

export async function getRecentProducts() {
    const productsData = (await db.select().from(products).where(eq(products.status, "approved")).orderBy(desc(products.createdAt))).filter((product) => {
        return product.createdAt !== null && product.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    })
    
    return productsData
}