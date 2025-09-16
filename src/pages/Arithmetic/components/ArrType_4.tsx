"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import Check from "@/components/common/Check"
import Hint from "@/components/common/Hint"
import useResultTracker from "@/hooks/useResultTracker"
import { useQuestionMeta } from "@/context/QuestionMetaContext"
import { useQuestionControls } from "@/context/QuestionControlsContext"

type Item = {
  id: number
  number: number
  firstNumber: number
  lastNumber: number
}

interface Props {
  data: Item[]
  hint?: string
}

export default function ArrType_4({ data, hint }: Props) {
  const [answers, setAnswers] = useState<{ [key: number]: { first?: string; last?: string } }>({})
  const [results, setResults] = useState<{
    [key: number]: { first?: "correct" | "wrong"; last?: "correct" | "wrong" }
  }>({})
  const [checked, setChecked] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handleShowHint = useCallback(() => setShowHint((v) => !v), [])

  const handleChange = useCallback((id: number, field: "first" | "last", value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
    if (checked) setChecked(false) // reset feedback when editing
  }, [checked])

  const { addResult } = useResultTracker()
  const { id: qId, title: qTitle } = useQuestionMeta()

  const handleCheck = useCallback(() => {
    const newResults: typeof results = {}
    data.forEach((d) => {
      const userFirst = answers[d.id]?.first
      const userLast = answers[d.id]?.last

      newResults[d.id] = {
        first: userFirst === String(d.firstNumber) ? "correct" : "wrong",
        last: userLast === String(d.lastNumber) ? "correct" : "wrong",
      }
    })
    setResults(newResults)
    const all = Object.values(newResults).flatMap((r) => [r.first, r.last])
    const allCorrect = all.length > 0 && all.every((r) => r === "correct")
    addResult({ id: qId, title: qTitle }, allCorrect)
    setChecked(true)
  }, [answers, data, addResult, qId, qTitle])

  const handleShowSolution = useCallback(() => {
    const newAnswers: typeof answers = {}
    const newResults: typeof results = {}
    data.forEach((d) => {
      newAnswers[d.id] = { first: String(d.firstNumber), last: String(d.lastNumber) }
      newResults[d.id] = { first: "correct", last: "correct" }
    })
    setAnswers(newAnswers)
    setResults(newResults)
    setChecked(false) // 👈 no summary after solution
  }, [data])

  // ✅ Summary (same logic as other components)
  const summary = useMemo(() => {
    if (!checked) return null

    const allResults = Object.values(results).flatMap((r) => [r.first, r.last])
    if (!allResults.length) return null

    if (allResults.every((r) => r === "correct")) {
      return {
        text: "🎉 Correct! Good Job",
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
      }
    }
    if (allResults.some((r) => r === "wrong")) {
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

  // ✅ memoize controls object
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
      {data?.map((d) => (
        <div key={d.id} className="flex items-center gap-2 my-2">
          <p className="font-bold">{d.number}</p>
          <p>lies between</p>

          {/* First input */}
          <input
            type="text"
            value={answers[d.id]?.first ?? ""}
            onChange={(e) => handleChange(d.id, "first", e.target.value)}
            className={`border-b-2 border-dashed px-3 w-16 text-center outline-none
              ${
                results[d.id]?.first === "correct" && checked
                  ? "text-green-600 border-green-600"
                  : results[d.id]?.first === "wrong" && checked
                  ? "text-red-600 border-red-600"
                  : "border-black"
              }`}
          />

          <p>and</p>

          {/* Last input */}
          <input
            type="text"
            value={answers[d.id]?.last ?? ""}
            onChange={(e) => handleChange(d.id, "last", e.target.value)}
            className={`border-b-2 border-dashed px-3 w-16 text-center outline-none
              ${
                results[d.id]?.last === "correct" && checked
                  ? "text-green-600 border-green-600"
                  : results[d.id]?.last === "wrong" && checked
                  ? "text-red-600 border-red-600"
                  : "border-black"
              }`}
          />
        </div>
      ))}

      {/* Controls */}
    </div>
  )
}
