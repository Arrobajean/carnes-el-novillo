import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { ExampleReviews } from "@/components/home/example-reviews";
import { HowItWorks } from "@/components/home/how-it-works";
import { VisitSection } from "@/components/home/visit-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <HowItWorks />
      <ExampleReviews />
      <VisitSection />
    </>
  );
}
