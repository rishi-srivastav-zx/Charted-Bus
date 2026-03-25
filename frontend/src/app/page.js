"use client";
import React from 'react';
import { Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';


import Navbar from '../components/header';
import Hero from '../components/hero';


const BusTypes = dynamic(() => import('../components/bustype'), {
  loading: () => <SectionSkeleton title="Our Fleet" />,
  ssr: true
});

const WhyChooseUs = dynamic(() => import('../components/whychooseus'), {
  loading: () => <SectionSkeleton title="Why Choose Us" />,
  ssr: true
});

const BusFeatures = dynamic(() => import('../components/busfeatures'), {
  loading: () => <SectionSkeleton title="Features" />,
  ssr: true
});

const InteractiveView = dynamic(() => import('../components/interactiveview'), {
  loading: () => <SectionSkeleton title="Interactive Tour" />,
  ssr: true
});

const HowItWorks = dynamic(() => import('../components/workandform').then(mod => mod.HowItWorks), {
  loading: () => <SectionSkeleton title="How It Works" />,
  ssr: true
});

const Testimonials = dynamic(() => import('../components/testimonials'), {
  loading: () => <SectionSkeleton title="Testimonials" />,
  ssr: true
});

const FAQ = dynamic(() => import('../components/faq'), {
  loading: () => <SectionSkeleton title="FAQ" />,
  ssr: true
});

const CTASection = dynamic(() => import('../components/ctasection'), {
  loading: () => <SectionSkeleton title="Ready to Book?" />,
  ssr: true
});

const Footer = dynamic(() => import('../components/footer'), {
  loading: () => <div className="h-64 bg-slate-900 animate-pulse" />,
  ssr: true
});


function SectionSkeleton({ title }) {
  return (
    <section className="w-full py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-8 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy component failed to load:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full py-20 text-center">
          <p className="text-slate-500">Failed to load section. Please refresh.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <Hero />

      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton title="Loading..." />}>
          <BusTypes />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton title="Loading..." />}>
          <WhyChooseUs />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton title="Loading..." />}>
          <BusFeatures />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton title="Loading..." />}>
          <InteractiveView />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton title="Loading..." />}>
          <HowItWorks />
        </Suspense>
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton title="Loading..." />}>
          <Testimonials />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton title="Loading..." />}>
          <FAQ />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton title="Loading..." />}>
          <CTASection />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<div className="h-64 bg-slate-900 animate-pulse" />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}   

