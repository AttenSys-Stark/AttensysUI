// components/DecorativeBanner.tsx
import React from "react";

const DecorativeBanner: React.FC = () => {
  return (
    <div className="h-32 rounded-lg mb-12 relative overflow-hidden">
      <img
        src="/img/banner.jpg"
        alt="Banner decorativo"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-purple-700/20 to-pink-600/20">
        <div className="absolute inset-0 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M10,50 Q30,20 50,50 T90,50"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M20,30 Q40,10 60,30 T90,30"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.3"
              fill="none"
            />
            <path
              d="M15,70 Q35,40 55,70 T95,70"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="0.4"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DecorativeBanner;
