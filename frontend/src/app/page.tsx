"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, PawPrint, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="relative w-full overflow-x-hidden">
      {/* Hero Section with Cover Image */}
      <div className="relative h-[85vh] min-h-[500px] sm:h-[90vh] sm:min-h-[600px] flex items-center justify-center w-full">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1920&h=1080&fit=crop&q=80"
            alt="Happy pets"
            fill
            priority
            className="object-cover"
            quality={90}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>

        {/* Animated Background Elements - Hidden on mobile */}
        <div className="absolute inset-0 z-10 overflow-hidden hidden sm:block">
          <div className="absolute top-20 left-10 animate-bounce delay-300">
            <PawPrint className="w-8 h-8 text-white/20" />
          </div>
          <div className="absolute top-40 right-20 animate-bounce delay-700">
            <Heart className="w-6 h-6 text-white/20" />
          </div>
          <div className="absolute bottom-40 left-20 animate-bounce delay-1000">
            <Sparkles className="w-7 h-7 text-white/20" />
          </div>
          <div className="absolute bottom-20 right-10 animate-bounce delay-500">
            <PawPrint className="w-8 h-8 text-white/20" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
          {/* Main Heading with Animation */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 animate-fade-in-up">
            <span className="inline-block animate-fade-in-up delay-100">
              Find Your New
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-gradient delay-200">
              Best Friend
            </span>
          </h1>

          {/* Subtitle with Animation */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8 px-2 animate-fade-in-up delay-300">
            Browse our list of lovable pets looking for a forever home.
            <br className="hidden sm:block" />
            <span className="block sm:inline"> </span>
            <span className="font-semibold text-yellow-300">Adopt, don&apos;t shop!</span>
          </p>

          {/* CTA Buttons with Animation */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in-up delay-500 px-4">
            <Link href="/pets" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <PawPrint className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Browse Pets
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Scroll Indicator - Hidden on mobile */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-30 bg-background py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center animate-fade-in-up delay-100">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Loving Homes</h3>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                Every pet deserves a loving family and a forever home.
              </p>
            </div>
            <div className="text-center animate-fade-in-up delay-200">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4">
                <PawPrint className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Easy Process</h3>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                Simple application process to find your perfect companion.
              </p>
            </div>
            <div className="text-center animate-fade-in-up delay-300 sm:col-span-2 lg:col-span-1">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Trusted Care</h3>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                All pets are healthy, vaccinated, and ready for adoption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
