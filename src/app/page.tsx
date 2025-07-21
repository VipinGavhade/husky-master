import React from "react";
import { Pencil, Shield, UsersRound } from "lucide-react";
import FeatureCard from "@/components/layouts/feature-card";
import TestimonialCard from "@/components/layouts/testimonials-card";
import Hero from "@/components/layouts/hero";

const testimonials = [
  {
    quote:
      "This product has completely transformed how we handle our daily operations. The interface is intuitive and the features are exactly what we needed.",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@company.com",
    rating: 5,
    userImage: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "Outstanding customer service and a product that delivers on all its promises. I've recommended it to several colleagues already.",
    userName: "Michael Chen",
    userEmail: "m.chen@business.org",
    rating: 5,
  },
  {
    quote:
      "The automation features have saved us countless hours each week. It's rare to find a tool that's both powerful and easy to use.",
    userName: "Emily Rodriguez",
    userEmail: "emily.r@startup.io",
    rating: 4,
    userImage: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "Great value for money and excellent performance. The team behind this product clearly understands what businesses need.",
    userName: "David Thompson",
    userEmail: "david.t@enterprise.com",
    rating: 5,
  },
  {
    quote:
      "Implementation was smooth and the learning curve was minimal. Our team was up and running in no time.",
    userName: "Lisa Wang",
    userEmail: "lisa.wang@tech.co",
    rating: 4,
    userImage: "/placeholder.svg?height=40&width=40",
  },
  {
    quote:
      "The analytics and reporting features provide insights we never had before. It's become an essential part of our workflow.",
    userName: "James Miller",
    userEmail: "j.miller@agency.net",
    rating: 5,
  },
];

const page = () => {
  return (
    <>
      {/* Home Section */}
      <Hero />

      {/* Features Section */}
      <section className="w-full flex flex-col items-center justify-center py-6 px-10">
        <h1 className="font-bold text-2xl">Features</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-3 max-w-6xl">
          <FeatureCard
            title="Manage tasks"
            description="Create and Manage your task easily with Husky."
            icon={Pencil}
          />
          <FeatureCard
            title="Secure"
            description="Your tasks is secure with Husky only you can see."
            icon={Shield}
          />
          <FeatureCard
            title="Collaborate"
            description="Collaborate with others and manage tasks in group."
            icon={UsersRound}
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what real customers have
              to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                userName={testimonial.userName}
                userEmail={testimonial.userEmail}
                rating={testimonial.rating}
                userImage={testimonial.userImage}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full flex items-center justify-center py-6 px-10">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Husky. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default page;
