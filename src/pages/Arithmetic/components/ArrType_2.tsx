"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Controllers from "@/components/common/Controllers";
import Check from "@/components/common/Check";
import Hint from "@/components/common/Hint";
import { IoMdArrowRoundForward } from "react-icons/io";
import useResultTracker from "@/hooks/useResultTracker";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import { useQuestionControls } from "@/context/QuestionControlsContext";

type Mode = "connectThenType" | "preConnected" | "preFilledBoxes";
type PresetPair = { dotIndex: number; lineNum: number };

type Props = {
  mode: Mode;
  presetLineNums?: PresetPair[];
  presetBoxNumbers?: number[];
  dotCount?: number;
  hint?: string;
};

type Connection = {
  dotIndex: number;
  lineNum: number;
  x: number;
  y: number;
};

const BRAND = "#ff6900";
const TICK_GAP = 17;
const SNAP_RADIUS = 8;

export default function ArrType_2({
  mode,
  presetLineNums = [],
  presetBoxNumbers = [12, 50, 97, 3, 88],
  dotCount = 5,
  hint,
}: Props) {
  const lines = useMemo(() => Array.from({ length: 100 }, (_, i) => i + 1), []);
  const [activeDot, setActiveDot] = useState<number | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [typed, setTyped] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, "correct" | "wrong" | null>>({});
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const connectDotToTick = (dotIndex: number, lineNum: number, tickEl: HTMLDivElement) => {
    const container = containerRef.current?.getBoundingClientRect();
    const tickRect = tickEl.getBoundingClientRect();
    if (!container) return;

    const x = tickRect.left - container.left + tickRect.width / 2;
    const y = tickRect.bottom - container.top;

    setConnections((prev) => {
      const filtered = prev.filter((c) => c.dotIndex !== dotIndex);
      return [...filtered, { dotIndex, lineNum, x, y }];
    });
  };

  const handleDotClick = (dotIndex: number) => {
    if (mode === "preConnected") return;
    setActiveDot(dotIndex);
    if (checked) setChecked(false); // reset feedback when editing
  };

  const handleScaleClick = (lineNum: number) => {
    if (mode === "preConnected") return;
    if (activeDot === null) return;
    const tickEl = document.getElementById(`tick-${lineNum}`) as HTMLDivElement | null;
    if (!tickEl) return;
    connectDotToTick(activeDot, lineNum, tickEl);
    setActiveDot(null);
  };

  const handleScaleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;
    const x = e.clientX - container.left;
    let guess = Math.round(x / TICK_GAP);
    guess = Math.max(1, Math.min(100, guess));
    const tickX = guess * TICK_GAP;
    setHoveredLine(Math.abs(x - tickX) <= SNAP_RADIUS ? guess : null);
  };
  const handleScaleMouseLeave = () => setHoveredLine(null);

  const handleScaleContainerClick = () => {
    if (mode === "preConnected") return;
    if (activeDot === null || hoveredLine == null) return;
    const tickEl = document.getElementById(`tick-${hoveredLine}`) as HTMLDivElement | null;
    if (!tickEl) return;
    connectDotToTick(activeDot, hoveredLine, tickEl);
    setActiveDot(null);
  };

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();

  const handleCheck = useCallback(() => {
    const newResults: Record<number, "correct" | "wrong" | null> = {};
    if (mode === "preFilledBoxes") {
      presetBoxNumbers.slice(0, dotCount).forEach((targetNum, dotIndex) => {
        const conn = connections.find((c) => c.dotIndex === dotIndex);
        newResults[dotIndex] = conn && conn.lineNum === targetNum ? "correct" : "wrong";
      });
    } else {
      for (let dotIndex = 0; dotIndex < dotCount; dotIndex++) {
        const conn = connections.find((c) => c.dotIndex === dotIndex);
        const asNum = typed[dotIndex]?.trim() ? Number(typed[dotIndex]) : NaN;
        newResults[dotIndex] =
          conn && !Number.isNaN(asNum) && asNum === conn.lineNum ? "correct" : "wrong";
      }
    }
    setResults(newResults);
    const vals = Object.values(newResults);
    const allCorrect = vals.length > 0 && vals.every((r) => r === "correct");
    addResult({ id: qId, title: qTitle }, allCorrect);
    setChecked(true);
  }, [mode, presetBoxNumbers, dotCount, connections, typed, addResult, qId, qTitle]);

  // Preset connections for preConnected mode
  useEffect(() => {
    if (mode !== "preConnected" || !presetLineNums.length) return;
    const compute = () => {
      const container = containerRef.current?.getBoundingClientRect();
      if (!container) return;
      const next: Connection[] = [];
      for (const { dotIndex, lineNum } of presetLineNums) {
        const tickEl = document.getElementById(`tick-${lineNum}`) as HTMLDivElement | null;
        if (!tickEl) continue;
        const r = tickEl.getBoundingClientRect();
        const x = r.left - container.left + r.width / 2;
        const y = r.bottom - container.top;
        next.push({ dotIndex, lineNum, x, y });
      }
      setConnections(next);
      setActiveDot(null);
      setResults({});
    };
    const raf = requestAnimationFrame(compute);
    const onResize = () => compute();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [mode, presetLineNums]);

  const handleShowSolution = useCallback(() => {
    if (mode === "preFilledBoxes") {
      const container = containerRef.current?.getBoundingClientRect();
      if (!container) return;
      const next: Connection[] = [];
      for (let dotIndex = 0; dotIndex < dotCount; dotIndex++) {
        const targetNum = presetBoxNumbers[dotIndex];
        if (!targetNum) continue;
        const tickEl = document.getElementById(`tick-${targetNum}`) as HTMLDivElement | null;
        if (!tickEl) continue;
        const r = tickEl.getBoundingClientRect();
        const x = r.left - container.left + r.width / 2;
        const y = r.bottom - container.top;
        next.push({ dotIndex, lineNum: targetNum, x, y });
      }
      setConnections(next);
      const solved: Record<number, "correct" | "wrong" | null> = {};
      for (let i = 0; i < dotCount; i++) solved[i] = "correct";
      setResults(solved);
    } else {
      const nextTyped: Record<number, string> = {};
      for (let dotIndex = 0; dotIndex < dotCount; dotIndex++) {
        const conn = connections.find((c) => c.dotIndex === dotIndex);
        if (conn) nextTyped[dotIndex] = String(conn.lineNum);
      }
      setTyped(nextTyped);
      const solved: Record<number, "correct" | "wrong" | null> = {};
      for (let i = 0; i < dotCount; i++) {
        const has = connections.find((c) => c.dotIndex === i);
        solved[i] = has ? "correct" : "wrong";
      }
      setResults(solved);
    }
    setChecked(false); // 👈 no summary after solution
  }, [mode, dotCount, presetBoxNumbers, connections]);

  // ✅ Summary (only after Check)
  const summary = useMemo(() => {
    if (!checked) return null;
    const vals = Object.values(results);
    if (vals.length === 0) return null;

    const allCorrect = vals.every((r) => r === "correct");
    const anyWrong = vals.some((r) => r === "wrong");

    if (allCorrect) {
      return {
        text: "🎉 Correct! Good Job",
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
      };
    }
    if (anyWrong) {
      return {
        text: "❌ Oops! Some answers are wrong",
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
      };
    }
    return null;
  }, [results, checked]);

  const { setControls } = useQuestionControls();

  const controls = useMemo(() => ({
    handleCheck,
    handleShowHint,
    handleShowSolution,
    hint,
    showHint,
    summary,
  }), [handleCheck, handleShowHint, handleShowSolution, hint, showHint, summary]);

  useEffect(() => {
    setControls(controls);
  }, [controls, setControls]);

  return (
    <>
      <div ref={containerRef} className="relative">
        {/* Scale */}
        <div
          className="relative h-24"
          onMouseMove={handleScaleMouseMove}
          onMouseLeave={handleScaleMouseLeave}
          onClick={handleScaleContainerClick}
        >
          <div className="w-full h-1 bg-black absolute bottom-6 " />
          {lines.map((num) => {
            const isFirst = num === 1;
            const isLast = num === 100;
            const isMiddle = num === 50;
            const isLarge = num % 10 === 0 || isFirst || isLast;
            const isMedium = num % 5 === 0 && !isLarge;

            const isConnectedLine = connections.some((c) => c.lineNum === num);
            const isSnapped = hoveredLine === num;

            return (
              <div
                key={num}
                id={`tick-${num}`}
                onClick={() => handleScaleClick(num)}
                className={`absolute bottom-6 ${mode === "preConnected" ? "cursor-default" : "cursor-pointer"}`}
                style={{
                  left: `${num * TICK_GAP}px`,
                  width: isLarge ? "3px" : isMedium ? "2px" : "1px",
                  height: isLarge ? "40px" : isMedium ? "28px" : "20px",
                  backgroundColor: isConnectedLine ? BRAND : isSnapped ? BRAND : "black",
                  boxShadow: isSnapped && !isConnectedLine ? `0 0 0 2px ${BRAND}33` : "none",
                }}
              >
                {(isFirst || isMiddle || isLast) && (
                  <span className="absolute top-full mt-1 font-semibold text-lg text-black">
                    {num}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Dots + Inputs */}
        <div className="mt-[100px] flex items-center gap-2 justify-center">
          {Array.from({ length: dotCount }).map((_, dotIndex) => {
            const isConnectedDot = connections.some((c) => c.dotIndex === dotIndex);
            const isActive = activeDot === dotIndex;
            const isReadOnly = mode === "preFilledBoxes";
            const presetValue = presetBoxNumbers[dotIndex] ?? "";

            return (
              <div key={dotIndex} className="flex flex-col items-center">
                {/* Dot */}
                <div
                  id={`dot-${dotIndex}`}
                  onClick={() => handleDotClick(dotIndex)}
                  className="size-4 mb-3 rounded-full"
                  style={{
                    backgroundColor:
                      isActive || isConnectedDot || mode === "preConnected" ? BRAND : "black",
                    cursor: mode === "preConnected" ? "default" : "pointer",
                  }}
                />

                {/* Input */}
                <input
                  id={`input-${dotIndex}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={isReadOnly ? String(presetValue) : (typed[dotIndex] ?? "")}
                  readOnly={isReadOnly}
                  onChange={(e) => {
                    if (isReadOnly) return;
                    const onlyDigits = e.target.value.replace(/[^0-9]/g, "");
                    setTyped((prev) => ({ ...prev, [dotIndex]: onlyDigits }));
                    setResults((prev) => ({ ...prev, [dotIndex]: null }));
                  }}
                  className={`border-2 size-15 text-3xl font-bold text-center appearance-none focus:outline-none
                    ${results[dotIndex] === "correct" && checked
                      ? "border-green-500"
                      : results[dotIndex] === "wrong" && checked
                        ? "border-red-500"
                        : "border-primary"
                    }`}
                />
              </div>
            );
          })}
        </div>

        {/* SVG connectors */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {connections.map((c, i) => {
            const dotRect = document.getElementById(`dot-${c.dotIndex}`)?.getBoundingClientRect();
            const containerRect = containerRef.current?.getBoundingClientRect();
            if (!dotRect || !containerRect) return null;

            const dotX = dotRect.left - containerRect.left + dotRect.width / 2;
            const dotY = dotRect.top - containerRect.top + dotRect.height / 2;

            return (
              <line
                key={i}
                x1={dotX}
                y1={dotY}
                x2={c.x}
                y2={c.y}
                stroke={BRAND}
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>

      {/* Controls */}
      {/* <Controllers handleCheck={handleCheck} handleShowSolution={handleShowSolution} handleShowHint={handleShowHint} />
      {showHint && <Hint hint={hint} />}
      <Check summary={summary} />  */}
    </>
  );
}