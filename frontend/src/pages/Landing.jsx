import React from "react";
import Hero from "../components/Hero";
import FeedBack from "../components/FeedBack";
import FeaturedJobs from "../components/FeaturedJobs";
import Features from "../components/Features";

const LandingPage = () => {
  return (
    <main className="bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="py-4 bg-gray-900">
        <Hero />
      </section>

      {/* Features Section */}
      <section className="py-2 bg-gray-800">
        <Features />
      </section>

      {/* Featured Jobs Section */}
      <section className="py-2 bg-gray-900">
        <FeaturedJobs />
      </section>

      {/* Feedback Section */}
      <section className="py-2 bg-gray-800">
        <FeedBack />
      </section>
    </main>
  );
};

export default LandingPage;
