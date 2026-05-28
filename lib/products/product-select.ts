import {db} from "@/db/index"
import { products } from "@/db/schema"
import {eq, desc} from "drizzle-orm"
import { connection } from "next/dist/server/web/exports"

export async function getFeaturedProducts() {
    "use cache"
    const productsData = await db.select().from(products).where(eq(products.status, "approved")).orderBy(desc(products.voteCount))
    
    return productsData
}

export async function getAllProducts() {
    const productsData = await db.select().from(products).where(eq(products.status, "approved")).orderBy(desc(products.voteCount))
    
    return productsData
}

export async function getRecentProducts() {
    await connection();
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const Data = await getAllProducts()
    const recentProducts = Data.filter((product) => {
        return product.createdAt !== null && product.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    })
    
    return recentProducts
}