"use client";
import { useState } from "react";
import { Monogram } from "./Monogram";

export function DishImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`grid place-items-center bg-[radial-gradient(circle_at_50%_40%,rgba(201,162,74,0.22),transparent_65%)] bg-surface-2 ${className}`}>
        <Monogram className="size-12 text-2xl opacity-80" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
