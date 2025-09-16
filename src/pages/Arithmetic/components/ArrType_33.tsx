import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";

// Dummy data 
const problemsJSON = [
  {
    id: 1,
    leftText: "20% is $50.",
    correctMatch: 3, 
  },
  {
    id: 2,
    leftText: "50% is $1700.",
    correctMatch: 0, 
  },
  {
    id: 3,
    leftText: "10% is $350.",
    correctMatch: 2, 
  },
  {
    id: 4,
    leftText: "40% is $56.",
    correctMatch: 1, 
  },
];

const rightSideValues = ["$3400.", "$140.", "$3500.", "$250."];

const areEqualSets = (a, b) => {
  if (a.length !== b.length) return false;
  const aSet = new Set(a.map(JSON.stringify));
  const bSet = new Set(b.map(JSON.stringify));
  if (aSet.size !== bSet.size) return false;
  for (const item of aSet) {
    if (!bSet.has(item)) {
      return false;
    }
  }
  return true;
};

export default function ArrType_33({ hint }: { hint: string }) {
  const [connections, setConnections] = useState([]);
  const [selectedDot, setSelectedDot] = useState(null);
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const leftRefs = useRef([]);
  const rightRefs = useRef([]);
  const containerRef = useRef(null);

  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const handleDotClick = useCallback(
    (side, index) => {
      if (showSolution) return;

      if (!selectedDot) {
        setSelectedDot({ side, index });
        setConnections((prev) =>
          prev.filter(
            (conn) =>
              conn.source.side !== side ||
              conn.source.index !== index
          )
        );
      } else if (selectedDot.side !== side) {
        const newConnection = {
          source: selectedDot,
          target: { side, index },
        };
        setConnections((prev) => {
          const filteredPrev = prev.filter(
            (conn) =>
              (conn.source.side !== selectedDot.side ||
                conn.source.index !== selectedDot.index) &&
              (conn.target.side !== side ||
                conn.target.index !== index)
          );
          return [...filteredPrev, newConnection];
        });
        setSelectedDot(null);
        setStatus(null);
      } else {
        setSelectedDot({ side, index });
        setConnections((prev) =>
          prev.filter(
            (conn) =>
              conn.source.side !== side ||
              conn.source.index !== index
          )
        );
      }
    },
    [selectedDot, showSolution]
  );

  const handleCheck = useCallback(() => {
    const correctConnections = problemsJSON.map((p) => ({
      source: { side: "left", index: p.id - 1 },
      target: { side: "right", index: p.correctMatch },
    }));

    const isCorrect = areEqualSets(connections, correctConnections);
    setStatus(isCorrect ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, isCorrect);
  }, [connections, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    const correctConnections = problemsJSON.map((p) => ({
      source: { side: "left", index: p.id - 1 },
      target: { side: "right", index: p.correctMatch },
    }));
    setConnections(correctConnections);
    setShowSolution(true);
    setStatus("match");
  }, []);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const summary = useMemo(() => {
    if (!status) return null;
    return status === "match"
      ? { text: "🎉 Correct! Good Job", color: "text-green-600" }
      : { text: "❌ Some connections are wrong", color: "text-red-600" };
  }, [status]);

  useEffect(() => {
    setControls({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    });
  }, [setControls, handleCheck, handleShowHint, handleShowSolution, hint, showHint, summary]);

  const getLineCoordinates = (connection) => {
    if (
      !containerRef.current ||
      !leftRefs.current[connection.source.index] ||
      !rightRefs.current[connection.target.index]
    ) {
      return null;
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    const leftRect = leftRefs.current[connection.source.index].getBoundingClientRect();
    const rightRect = rightRefs.current[connection.target.index].getBoundingClientRect();

    return {
      x1: leftRect.right - containerRect.left,
      y1: leftRect.top + leftRect.height / 2 - containerRect.top,
      x2: rightRect.left - containerRect.left,
      y2: rightRect.top + rightRect.height / 2 - containerRect.top,
    };
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-center gap-x-20 px-6 py-8 relative" ref={containerRef}>
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {connections.map((conn, index) => {
            const coords = getLineCoordinates(conn);
            if (!coords) return null;
            return (
              <line
                key={index}
                x1={coords.x1}
                y1={coords.y1}
                x2={coords.x2}
                y2={coords.y2}
                stroke={status === "match" ? "green" : "#f97316"}
                strokeWidth="2"
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Left Side */}
        <div className="flex flex-col items-start space-y-8">
          <h3 className="text-lg font-semibold text-gray-700">
            percentage of the savings
          </h3>
          {problemsJSON.map((p, idx) => (
            <div key={p.id} className="flex items-center space-x-4">
              <p className="text-md text-gray-800">{p.leftText}</p>
              <div
                ref={(el) => (leftRefs.current[idx] = el)}
                className={`w-4 h-4 rounded-full border-2 cursor-pointer ${
                  selectedDot?.side === "left" && selectedDot.index === idx
                    ? "bg-blue-500 border-blue-500"
                    : "bg-orange-500 border-orange-500"
                }`}
                onClick={() => handleDotClick("left", idx)}
              />
            </div>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-start space-y-8">
          <h3 className="text-lg font-semibold text-gray-700">
            total amount of savings
          </h3>
          {rightSideValues.map((text, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <div
                ref={(el) => (rightRefs.current[idx] = el)}
                className={`w-4 h-4 rounded-full border-2 cursor-pointer ${
                  selectedDot?.side === "right" && selectedDot.index === idx
                    ? "bg-blue-500 border-blue-500"
                    : "bg-orange-500 border-orange-500"
                }`}
                onClick={() => handleDotClick("right", idx)}
              />
              <p className="text-md text-gray-800">{text}</p>
            </div>
          ))}
        </div>
      </div>

  
    </div>
  );
}