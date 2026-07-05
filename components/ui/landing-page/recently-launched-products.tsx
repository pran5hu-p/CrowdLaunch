import { CalendarIcon, RocketIcon } from "lucide-react";
import SectionHeader from "@/components/ui/common/section-header";
import ProductCard from "@/components/ui/products/product-card";
import EmptyState from "@/components/ui/common/empty-state";
import { getRecentProducts } from "@/lib/products/product-select";

export default async function RecentlyLaunchedProducts() {
    // 1. Fetch the data directly at the top level
    const recentlyLaunchedProducts = await getRecentProducts();

    return (
        <section className="py-20 bg-muted/20">
            <div className="wrapper space-y-12">
                
                {/* 2. The Header */}
                <SectionHeader
                    title="Recently Launched"
                    icon={RocketIcon}
                    description="Discover the latest products from our community"
                />
                
                {/* 3. The conditional rendering */}
                {recentlyLaunchedProducts.length > 0 ? (
                    <div className="grid-wrapper">
                        {recentlyLaunchedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        message="No products launched in the last week. Check back soon for new launches."
                        icon={CalendarIcon}
                    />
                )}

            </div>
        </section>
    );
}