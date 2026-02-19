"use client";

import React from "react";
import LandingPage from "@/components/LandingPage";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLaunch = () => {
    // Standard navigation to the watch route
    router.push("/watch");
  };

  return <LandingPage onLaunch={handleLaunch} />;
}
