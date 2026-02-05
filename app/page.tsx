"use client";

import Link from "next/link";
import { ArrowRight, Map, Shield, Smartphone, Star } from "lucide-react";
import clsx from "clsx";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-charcoal to-brand-navy z-0"></div>
        {/* Abstract Shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-teal/20 rounded-full blur-[100px] animate-pulse"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block border border-brand-teal/30 bg-brand-teal/10 rounded-full px-4 py-1 mb-6 backdrop-blur-md">
            <span className="text-brand-teal text-sm font-bold tracking-wide uppercase">Launching in Chennai</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
            Find. Book. <span className="text-brand-teal">Park.</span>
          </h1>
          <p className="text-xl md:text-2xl text-brand-gray mb-10 max-w-2xl mx-auto font-light">
            The smartest way to park in Chennai. Secure spots, instant booking, and zero hassle.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="w-full sm:w-auto px-8 py-4 bg-brand-teal text-brand-navy font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-xl shadow-brand-teal/20 flex items-center justify-center gap-2"
            >
              Find Parking <Map className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              List Your Spot
            </Link>
            <Link
              href="/help"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Support
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-brand-charcoal md:px-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Parking made simple</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Map className="w-8 h-8 text-brand-teal" />,
                title: "1. Find a Spot",
                desc: "Browse secure parking spaces near you on our real-time map."
              },
              {
                icon: <Smartphone className="w-8 h-8 text-blue-400" />,
                title: "2. Book & Pay",
                desc: "Reserve your slot in seconds. Pay via UPI. Get a digital pass."
              },
              {
                icon: <Shield className="w-8 h-8 text-green-400" />,
                title: "3. Park Safely",
                desc: "Navigate to the location, scan your QR code, and park stress-free."
              }
            ].map((step, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-brand-gray">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
