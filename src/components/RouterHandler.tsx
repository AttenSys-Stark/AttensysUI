"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/Loader";

export const RouterHandler = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Add this line
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true); // Set isMounted to true after component mounts
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  if (!isMounted) return null; // Don't render anything until the component has mounted

  return (
    <>
      {isLoading && <Loading />}
      {children}
    </>
  );
};
