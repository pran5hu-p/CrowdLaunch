import FeaturedProducts from "@/components/ui/landing-page/featured-products";
import HeroSection from "@/components/ui/landing-page/hero-section";
import RecentlyLauchedProducts from "@/components/ui/landing-page/recently-launched-products";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <RecentlyLauchedProducts />
    </div>
  );
}
