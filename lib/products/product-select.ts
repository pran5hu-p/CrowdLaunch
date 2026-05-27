import {db} from "@/db/index"
import { products } from "@/db/schema"
import {eq, desc} from "drizzle-orm"

export default async function getFeaturedProducts() {
    const productsData = await db.select().from(products).where(eq(products.status, "approved")).orderBy(desc(products.voteCount))
    
    return productsData
}