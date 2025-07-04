"use client";

import React, { useState, useEffect, useRef } from "react";
import component1 from "./../assets/Component1.png";
import component2 from "./../assets/Component2.png";
import component3 from "./../assets/Component3.png";
import component4 from "./../assets/Component4.png";
import component5 from "./../assets/component5.png";
import component6 from "./../assets/component6.png";
import Image from "next/image";
import ControllerConnector from "@cartridge/connector/controller";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./ui/LoadingSpinner";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { loginorsignup } from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import { AccountHandler } from "@/helpers/accounthandler";
import { Button } from "@headlessui/react";
import CourseNews from "@/components/courses/CourseNews";

const HomePage = () => {
  const [grid, setGrid] = useState({
    cols: 0,
    rows: 0,
    widthRemainder: 0,
    heightRemainder: 0,
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const backgroundRef = useRef(null);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const controller = connectors[0] as ControllerConnector;
  const [username, setUsername] = useState<string>();
  const [iswalletconnecting, setiswalletconnecting] = useState(false);
  const router = useRouter();
  const [loginorsignupstat, setLoginorsignupstat] = useAtom(loginorsignup);
  const [mobileView, setMobileView] = useState<"welcome" | "login" | "signup">(
    "welcome",
  );

  useEffect(() => {
    // if (!address) return;
    // controller?.username()?.then((n) => setUsername(n));
    // if (address) {
    //   router.push("/Home");
    // }
  }, [address, controller]);

  const handleConnect = async () => {
    console.log("clicked");
    setiswalletconnecting(true);
    const connectionTimeout = setTimeout(() => {
      setiswalletconnecting(false);
    }, 25000);
    if (!address) {
      connect({ connector: controller });
      if (address) {
        router.push("/Home");
      }
      // setiswalletconnecting(false);
    }
  };

  useEffect(() => {
    const updateGrid = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const boxWidth = 80.23;
      const boxHeight = 81.37;

      setGrid({
        cols: Math.floor(vw / boxWidth),
        rows: Math.floor(vh / boxHeight),
        widthRemainder: vw % boxWidth,
        heightRemainder: vh % boxHeight,
      });
    };

    const handleMouseMove = (e: any) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    updateGrid();
    window.addEventListener("mousemove", handleMouseMove);
    const resizeObserver = new ResizeObserver(updateGrid);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const xRatio = (mouseX / window.innerWidth) * 2 - 1;
      const yRatio = (mouseY / window.innerHeight) * 2 - 1;

      const elements = document.querySelectorAll(
        ".background-element, .background-circle",
      );

      elements.forEach((el) => {
        const moveX = xRatio * 30;
        const moveY = yRatio * 30;
        const scale = 1 + (Math.abs(xRatio) * 0.03 + Math.abs(yRatio) * 0.03);

        const htmlEl = el as HTMLElement;
        htmlEl.style.setProperty("--tx", `${moveX}px`);
        htmlEl.style.setProperty("--ty", `${moveY}px`);
        htmlEl.style.setProperty("--scale", scale.toString());

        const blur = 200 - (Math.abs(xRatio) * 30 + Math.abs(yRatio) * 30);
        htmlEl.style.filter = `blur(${Math.max(100, blur)}px)`;
      });
    };

    const handleMouseLeave = () => {
      const elements = document.querySelectorAll(
        ".background-element, .background-circle",
      );
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.setProperty("--tx", "0px");
        htmlEl.style.setProperty("--ty", "0px");
        htmlEl.style.setProperty("--scale", "1");
        htmlEl.style.filter = "blur(200px)";
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <CourseNews />
      <div
        ref={backgroundRef}
        className="absolute inset-0 z-0 transition-all duration-300"
        style={{
          background: "linear-gradient(175deg, #2D3A4B 4.2%, #9B51E0 180.81%)",
        }}
      />

      <div className="absolute inset-0 z-10 pointer-events-none ">
        <div
          className="background-element"
          style={{
            width: "500.36px",
            height: "404.36px",
            left: "600.23px",
            top: "50px",
            position: "absolute",
            transform: "rotate(30deg)",
            transformOrigin: "top left",
            background: "#001AFF",
            boxShadow: "150px 150px 150px",
            filter: "blur(200px)",
          }}
        />
        <div
          className="background-element"
          style={{
            width: "400.36px",
            height: "600.36px",
            left: "600.23px",
            top: "200px",
            position: "absolute",
            transform: "rotate(30deg)",
            transformOrigin: "top left",
            background: "#DB00FF",
            boxShadow: "30px 30px 30px",
            filter: "blur(200px)",
          }}
        />
        <div
          className="background-circle"
          style={{
            width: "700px",
            height: "600px",
            left: "900.35px",
            top: "150.14px",
            position: "absolute",
            background: "#00C2FF",
            boxShadow: "150px 150px 150px",
            borderRadius: "9999px",
            filter: "blur(200px)",
          }}
        />
      </div>

      <div
        className="absolute inset-0 z-20 grid"
        style={{
          gridTemplateColumns: `repeat(${grid.cols + 1}, ${
            grid.cols > 0 ? "80.23px" : "100vw"
          })`,
          gridTemplateRows: `repeat(${grid.rows + 1}, ${
            grid.rows > 0 ? "81.37px" : "100vh"
          })`,
          width: `${grid.cols * 80.23 + (grid.widthRemainder || 80.23)}px`,
          height: `${grid.rows * 81.37 + (grid.heightRemainder || 81.37)}px`,
        }}
      >
        {Array.from({ length: (grid.cols + 1) * (grid.rows + 1) }).map(
          (_, i) => {
            const isLastCol = i % (grid.cols + 1) === grid.cols;
            const isLastRow = Math.floor(i / (grid.cols + 1)) === grid.rows;

            const col = i % (grid.cols + 1);
            const row = Math.floor(i / (grid.cols + 1));

            const getFillColor = () => {
              if (isLastCol || isLastRow) return null;

              const colors = [
                "#9B51E0",
                "#7E3AC2",
                "#4A90E2",
                "#2D8EFF",
                "#5801A9",
                "#A01B9B",
                "#6E3AFF",
                "#4D7CFF",
                "#B84DFF",
              ];

              const shapes = [
                // Top-left L-shape
                {
                  color: colors[0],
                  positions: (r: number, c: number) =>
                    (r === 1 && c === 2) ||
                    (r === 2 && c === 2) ||
                    (r === 2 && c === 3),
                },
                // Top-center square
                {
                  color: colors[1],
                  positions: (r: number, c: number) =>
                    (r === 1 && c === Math.floor(grid.cols / 2)) ||
                    (r === 1 && c === Math.floor(grid.cols / 2) + 1) ||
                    (r === 2 && c === Math.floor(grid.cols / 2)) ||
                    (r === 2 && c === Math.floor(grid.cols / 2) + 1),
                },
                // Right-side diagonal
                {
                  color: colors[2],
                  positions: (r: number, c: number) =>
                    (r === 3 && c === grid.cols - 4) ||
                    (r === 4 && c === grid.cols - 5) ||
                    (r === 5 && c === grid.cols - 6),
                },
                // Center T-shape
                {
                  color: colors[3],
                  positions: (r: number, c: number) =>
                    (r === Math.floor(grid.rows / 2) &&
                      c === Math.floor(grid.cols / 2)) ||
                    (r === Math.floor(grid.rows / 2) + 1 &&
                      c === Math.floor(grid.cols / 2) - 1) ||
                    (r === Math.floor(grid.rows / 2) + 1 &&
                      c === Math.floor(grid.cols / 2)) ||
                    (r === Math.floor(grid.rows / 2) + 1 &&
                      c === Math.floor(grid.cols / 2) + 1),
                },
                // Bottom-left cluster
                {
                  color: colors[4],
                  positions: (r: number, c: number) =>
                    (r === grid.rows - 4 && c === 3) ||
                    (r === grid.rows - 3 && c === 3) ||
                    (r === grid.rows - 3 && c === 4) ||
                    (r === grid.rows - 2 && c === 4),
                },
                // Bottom-right Z-shape
                {
                  color: colors[5],
                  positions: (r: number, c: number) =>
                    (r === grid.rows - 3 && c === grid.cols - 4) ||
                    (r === grid.rows - 3 && c === grid.cols - 3) ||
                    (r === grid.rows - 2 && c === grid.cols - 3),
                },
                // Middle vertical line
                {
                  color: colors[6],
                  positions: (r: number, c: number) =>
                    r >= Math.floor(grid.rows / 2) - 2 &&
                    r <= Math.floor(grid.rows / 2) + 2 &&
                    c === Math.floor(grid.cols / 3),
                },
                // Top-right single cell
                {
                  color: colors[7],
                  positions: (r: number, c: number) =>
                    r === 3 && c === grid.cols - 2,
                },
                // Bottom-center horizontal line
                {
                  color: colors[8],
                  positions: (r: number, c: number) =>
                    r === grid.rows - 2 &&
                    c >= Math.floor(grid.cols / 2) - 1 &&
                    c <= Math.floor(grid.cols / 2) + 1,
                },
              ];

              for (const shape of shapes) {
                if (shape.positions(row, col)) {
                  return shape.color;
                }
              }

              return null;
            };

            const fillColor = getFillColor();

            return (
              <div
                key={i}
                className="border border-[#FFFFFF]"
                style={{
                  width: isLastCol
                    ? `${grid.widthRemainder || 80.23}px`
                    : "80.23px",
                  height: isLastRow
                    ? `${grid.heightRemainder || 81.37}px`
                    : "81.37px",
                  boxSizing: "border-box",
                  backgroundColor: fillColor || "transparent",
                  opacity: fillColor ? 0.2 : 0.05,
                  borderColor: "#FFFFFF",
                  borderWidth: "1px",
                  ...(fillColor && {
                    transition: "opacity 0.2s ease",
                  }),
                }}
              />
            );
          },
        )}
      </div>

      <div className="absolute inset-0 z-50">
        <div className="absolute bottom-[15%] left-[45%] w-12 h-12 md:w-16 md:h-16 floating-element">
          <Image
            src={component2}
            alt="Document Icon"
            layout="fill"
            objectFit="contain"
            className="z-50"
          />
        </div>

        <div className="absolute top-[10%] right-[25%] w-12 h-12 md:w-16 md:h-16 floating-element">
          <Image
            src={component1}
            alt="Certificate Icon"
            layout="fill"
            objectFit="contain"
          />
        </div>

        <div className="absolute top-[65%] left-[15%] w-12 h-12 md:w-16 md:h-16 floating-element">
          <Image
            src={component3}
            alt="User Icon"
            layout="fill"
            objectFit="contain"
          />
        </div>

        <div className="absolute top-[55%] right-[15%] w-12 h-12 md:w-16 md:h-16 floating-element">
          <Image
            src={component4}
            alt="Calendar Icon"
            layout="fill"
            objectFit="contain"
          />
        </div>

        <div className="absolute top-[20%] left-[25%] w-12 h-12 md:w-16 md:h-16 floating-element">
          <Image
            src={component5}
            alt="Analytics Icon"
            layout="fill"
            objectFit="contain"
          />
        </div>

        <div className="absolute bottom-[20%] right-[28%] w-12 h-12 md:w-16 md:h-16 floating-element">
          <Image
            src={component6}
            alt="Settings Icon"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>

      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-white px-4">
        {/* Desktop layout: side-by-side */}
        <div className="hidden md:flex items-center justify-between w-full max-w-5xl">
          <div className="text-left w-[50%]">
            <h1 className="font-extrabold text-2xl md:text-[30px] lg:mb-2 text-center">
              Atten<span className="text-[#9B51E0]">sys</span>
            </h1>
            <p className="text-3xl md:text-[48px] font-bold mb-2 lg:mb-4 lg:leading-[60px]">
              Buy Courses to Learn, Sell Courses to Earn
            </p>
            <p className="text-sm md:text-[17px] font-light mb-4 max-w-3xl opacity-90">
              Simplifying certificate issuance for courses, course management,
              STRK-powered course purchases, secure access, and learning.
            </p>
          </div>
          {loginorsignupstat ? <SignupForm /> : <LoginForm />}
        </div>

        {/* Mobile layout: stacked, flow-based */}
        <div className="md:hidden w-full max-w-md">
          {mobileView === "welcome" && (
            <div className="flex flex-col items-center text-center">
              <h1 className="font-extrabold text-2xl mb-2">
                Atten<span className="text-[#9B51E0]">sys</span>
              </h1>
              <p className="text-2xl font-bold mb-2">
                Buy Courses to Learn, Sell Courses to Earn
              </p>
              <p className="text-sm font-light mb-6 opacity-90">
                Simplifying certificate issuance for courses, course management,
                STRK-powered course purchases, secure access, and learning.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => setMobileView("login")}
                  className="w-full py-2 rounded-lg bg-white text-indigo-700 font-semibold text-lg shadow hover:bg-indigo-50 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => setMobileView("signup")}
                  className="w-full py-2 rounded-lg bg-[#9B51E0] text-white font-semibold text-lg shadow hover:bg-[#7E3AC2] transition"
                >
                  Signup
                </button>
              </div>
            </div>
          )}
          {mobileView === "login" && (
            <div className="relative">
              <button
                onClick={() => setMobileView("welcome")}
                className="absolute left-0 top-0 text-[#9B51E0] font-bold text-lg mb-2"
              >
                ← Back
              </button>
              <div className="pt-8">
                <LoginForm onSignupClick={() => setMobileView("signup")} />
              </div>
            </div>
          )}
          {mobileView === "signup" && (
            <div className="relative">
              <button
                onClick={() => setMobileView("welcome")}
                className="absolute left-0 top-0 text-[#9B51E0] font-bold text-lg mb-2"
              >
                ← Back
              </button>
              <div className="pt-8">
                <SignupForm onLoginClick={() => setMobileView("login")} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
