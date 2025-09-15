"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import Xarrow from "react-xarrows"
import Check from "@/components/common/Check"
import Hint from "@/components/common/Hint"
import useResultTracker from "@/hooks/useResultTracker"
import { useQuestionMeta } from "@/context/QuestionMetaContext"
import { useQuestionControls } from "@/context/QuestionControlsContext"

type Between = { id: number; number: number; from: number; to: number }

export default function ArrType_3({ data, hint }: { data: Between[]; hint: string }) {
  const [connections, setConnections] = useState<
    { start: string; end: string; leftId: number; rightId: number }[]
  >([])
  const [selectedDot, setSelectedDot] = useState<string | null>(null)
  const [results, setResults] = useState<{ [key: number]: "correct" | "wrong" }>({})
  const [checked, setChecked] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handleShowHint = useCallback(() => setShowHint((v) => !v), [])

  // shuffle right column only once
  const shuffledRight = useMemo(() => {
    return [...data]
      .map((item, idx) => ({ ...item, rid: idx + 100 }))
      .sort(() => Math.random() - 0.5)
  }, [data])

  const handleDotClick = (id: string) => {
    if (!selectedDot) {
      setSelectedDot(id)
    } else {
      if (selectedDot.startsWith("dot-left") && id.startsWith("dot-right")) {
        const leftId = parseInt(selectedDot.split("-")[2])
        const rightId = parseInt(id.split("-")[2])

        setConnections((prev) => {
          const filtered = prev.filter((c) => c.leftId !== leftId)
          return [...filtered, { start: selectedDot, end: id, leftId, rightId }]
        })
      }
      setSelectedDot(null)
    }
  }

  const { addResult } = useResultTracker()
  const { id: qId, title: qTitle } = useQuestionMeta()

  const handleCheck = useCallback(() => {
    const newResults: { [key: number]: "correct" | "wrong" } = {}
    connections.forEach((conn) => {
      const leftItem = data.find((d) => d.id === conn.leftId)
      const rightItem = shuffledRight.find((d) => d.id === conn.rightId)
      if (leftItem && rightItem) {
        newResults[leftItem.id] =
          leftItem.number >= rightItem.from && leftItem.number <= rightItem.to
            ? "correct"
            : "wrong"
      }
    })
    setResults(newResults)
    const vals = Object.values(newResults)
    const allCorrect = vals.length > 0 && vals.every((r) => r === "correct")
    addResult({ id: qId, title: qTitle }, allCorrect)
    setChecked(true)
  }, [connections, data, shuffledRight, addResult, qId, qTitle])

  const handleShowSolution = useCallback(() => {
    const newResults: { [key: number]: "correct" | "wrong" } = {}
    data.forEach((d) => {
      newResults[d.id] =
        d.number >= d.from && d.number <= d.to ? "correct" : "wrong"
    })
    setResults(newResults)

    const autoConnections = data
      .map((left) => {
        const right = shuffledRight.find(
          (r) => left.number >= r.from && left.number <= r.to
        )
        return right
          ? {
              start: `dot-left-${left.id}`,
              end: `dot-right-${right.id}`,
              leftId: left.id,
              rightId: right.id,
            }
          : null
      })
      .filter(Boolean) as {
      start: string
      end: string
      leftId: number
      rightId: number
    }[]

    setConnections(autoConnections)
    setChecked(false) // 👈 no summary after solution
  }, [data, shuffledRight])

  // ✅ Summary (only after Check)
  const summary = useMemo(() => {
    if (!checked) return null
    const vals = Object.values(results)
    if (!vals.length) return null

    if (vals.every((r) => r === "correct")) {
      return {
        text: "🎉 Correct! Good Job",
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
      }
    }
    if (vals.some((r) => r === "wrong")) {
      return {
        text: "❌ Oops! Some answers are wrong",
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
      }
    }
    return null
  }, [results, checked])

  const { setControls } = useQuestionControls()

  // ✅ only update controls if different
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    }),
    [handleCheck, handleShowHint, handleShowSolution, hint, showHint, summary]
  )

  useEffect(() => {
    setControls((prev) => {
      const changed = Object.keys(controls).some(
        (k) => (controls as any)[k] !== (prev as any)[k]
      )
      return changed ? controls : prev
    })
  }, [controls, setControls])

  return (
    <div>
      <div className="flex items-center justify-between w-2/3 mx-auto relative">
        {/* Left column */}
        <div className="space-y-5">
          {data.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={item.number}
                className={`border-2 w-20 h-10 text-2xl font-bold text-center 
                  ${
                    results[item.id] === "correct" && checked
                      ? "border-green-500"
                      : results[item.id] === "wrong" && checked
                      ? "border-red-500"
                      : "border-primary"
                  }`}
              />
              <div
                id={`dot-left-${item.id}`}
                className="size-3 bg-black rounded-full cursor-pointer"
                onClick={() => handleDotClick(`dot-left-${item.id}`)}
              />
            </div>
          ))}
        </div>

        {/* Right column (shuffled order) */}
        <div className="space-y-5">
          {shuffledRight.map((item) => (
            <div key={item.rid} className="flex items-center gap-2">
              <div
                id={`dot-right-${item.id}`}
                className="size-3 bg-black rounded-full cursor-pointer"
                onClick={() => handleDotClick(`dot-right-${item.id}`)}
              />
              <input
                type="text"
                readOnly
                value={`${item.from}-${item.to}`}
                className={`border-2 w-28 h-10 text-2xl font-bold text-center 
                  ${
                    results[item.id] === "correct" && checked
                      ? "border-green-500"
                      : results[item.id] === "wrong" && checked
                      ? "border-red-500"
                      : "border-primary"
                  }`}
              />
            </div>
          ))}
        </div>

        {/* Draw connections */}
        {connections.map((c, idx) => (
          <Xarrow
            key={idx}
            start={c.start}
            end={c.end}
            strokeWidth={2}
            color="#ff6900"
            showHead={false}
            showTail={false}
            path="straight"
          />
        ))}
      </div>

      {/* Controls */}
      {/* <Check summary={summary} />
      {showHint && <Hint hint={hint} />} */}
    </div>
  )
}
