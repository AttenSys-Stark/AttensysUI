"use client";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <LoadingSpinner
      variant="fullscreen"
      size="lg"
      speed="normal"
      thickness="normal"
    />
  );
}
