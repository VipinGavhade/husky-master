import { Skeleton } from "@/components/ui/skeleton";

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <Skeleton className="h-12 w-[600px] max-w-full" />
            <Skeleton className="h-6 w-[500px] max-w-full" />
            <Skeleton className="h-6 w-[400px] max-w-full" />
          </div>
          <div className="space-x-4 flex">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Feature Card Skeleton
export function FeatureCardSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

// Features Section Skeleton
export function FeaturesSkeleton() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-6 px-10">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-3 max-w-6xl">
        <FeatureCardSkeleton />
        <FeatureCardSkeleton />
        <FeatureCardSkeleton />
      </div>
    </section>
  );
}

// Testimonial Card Skeleton
export function TestimonialCardSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div className="flex items-center space-x-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-4" />
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}

// Testimonials Section Skeleton
export function TestimonialsSkeleton() {
  return (
    <section className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Skeleton className="h-9 w-80 mx-auto mb-4" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <TestimonialCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer Skeleton
export function FooterSkeleton() {
  return (
    <footer className="w-full flex items-center justify-center py-6 px-10">
      <div className="text-center">
        <Skeleton className="h-4 w-48" />
      </div>
    </footer>
  );
}

// Complete Page Loading Skeleton
function PageLoadingSkeleton() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <HeroSkeleton />

      {/* Features Section Skeleton */}
      <FeaturesSkeleton />

      {/* Testimonials Section Skeleton */}
      <TestimonialsSkeleton />

      {/* Footer Section Skeleton */}
      <FooterSkeleton />
    </>
  );
}

export default function Loading() {
  return <PageLoadingSkeleton />;
}
