import { LuSparkles, LuZap } from "react-icons/lu";
import TruthOrDareGame from "./menu/page";
import { useState } from "react";

export default function Home() {
  const [hoveredTruth, setHoveredTruth] = useState(false);
  const [hoveredDare, setHoveredDare] = useState(false);
  return (
    <div className="m-auto">
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-purple-800 to-blue-500 p-6">
        <div className="mb-8 flex flex-col items-center">
          <div className="relative flex items-center gap-3 text-4xl font-extrabold tracking-tighter text-white md:text-5xl lg:text-6xl">
            <span
              className={`transition-all duration-300 ${
                hoveredTruth ? "scale-110" : ""
              }`}
              onMouseEnter={() => setHoveredTruth(true)}
              onMouseLeave={() => setHoveredTruth(false)}
            >
              TRUTH
              {hoveredTruth && (
                <LuSparkles className="absolute -right-6 -top-4 h-6 w-6 text-yellow-300" />
              )}
            </span>
            <span className="text-2xl font-light md:text-3xl lg:text-4xl">
              or
            </span>
            <span
              className={`transition-all duration-300 ${
                hoveredDare ? "scale-110" : ""
              }`}
              onMouseEnter={() => setHoveredDare(true)}
              onMouseLeave={() => setHoveredDare(false)}
            >
              DARE
              {hoveredDare && (
                <LuZap className="absolute -right-6 -top-4 h-6 w-6 text-red-400" />
              )}
            </span>
          </div>
          <p className="mt-2 text-center text-sm font-medium text-blue-100 md:text-base">
            The ultimate party game of choices and challenges
          </p>
        </div>
        <TruthOrDareGame />
      </div>
    </div>
  );
}
