import React, { useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "./../assets/meet.json";

export default function Animation() {
  const meetRef = useRef<LottieRefCurrentProps>(null);
  return (
    <div className="min-h-screen lg:w-[60%] flex items-center justify-center lg:mx-36 ">
      <div className="relative">
        <Lottie
          lottieRef={meetRef}
          animationData={animationData}
          loop={false}
          onComplete={() => {
            meetRef.current?.goToAndPlay(35, true);
          }}
        />

        <div className="text-center bg-gradient-to-r from-purple-400 lg:min-w-full min-h-48">
          {/* <h1 className="text-2xl font-bond">AttenSys</h1> */}
        </div>
      </div>
    </div>
  );
}
