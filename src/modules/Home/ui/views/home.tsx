"use client";

import {
  HomeNavbar,
  HomeHero,
  HomeFeatures,
  HomeGlobe,
  HomeFooter,
} from "../components";

export const HomeView = () => {
  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      <HomeHero />
      <HomeFeatures />
      <HomeGlobe />
      <HomeFooter />
    </div>
  );
};