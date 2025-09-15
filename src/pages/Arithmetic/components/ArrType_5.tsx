"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import Check from "@/components/common/Check"
import Hint from "@/components/common/Hint"
import useResultTracker from "@/hooks/useResultTracker"
import { useQuestionMeta } from "@/context/QuestionMetaContext"
import { useQuestionControls } from "@/context/QuestionControlsContext"

type Item = {
  id: number
  result: number
  option: number
  answer: number // keep for reference / solution
}

interface Props {
  data: Item[]
  method: "addition" | "multiplication"
  hint: string
}

export default function ArrType_5({ data, method, hint }: Props) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [results, setResults] = useState<{ [key: number]: "correct" | "wrong" | null }>({})
  const [checked, setChecked] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handleShowHint = useCallback(() => setShowHint((v) => !v), [])

  const handleChange = useCallback((id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    if (checked) setChecked(false) // reset feedback when editing
  }, [checked])

  // calculate expected answer dynamically
  const calculateAnswer = useCallback((d: Item) => {
    if (method === "addition") {
      return d.result - d.option
    }
    if (method === "multiplication") {
      return d.result / d.option
    }
    return d.answer
  }, [method])

  const { addResult } = useResultTracker()
  const { id: qId, title: qTitle } = useQuestionMeta()

  const handleCheck = useCallback(() => {
    const newResults: typeof results = {}
    data.forEach((d) => {
      const expected = calculateAnswer(d)
      const userVal = answers[d.id]
      newResults[d.id] = userVal === String(expected) ? "correct" : "wrong"
    })
    setResults(newResults)
    const vals = Object.values(newResults)
    const allCorrect = vals.length > 0 && vals.every((r) => r === "correct")
    addResult({ id: qId, title: qTitle }, allCorrect)
    setChecked(true)
  }, [answers, data, calculateAnswer, addResult, qId, qTitle])

  const handleShowSolution = useCallback(() => {
    const newAnswers: typeof answers = {}
    const newResults: typeof results = {}
    data.forEach((d) => {
      const expected = calculateAnswer(d)
      newAnswers[d.id] = String(expected)
      newResults[d.id] = "correct"
    })
    setAnswers(newAnswers)
    setResults(newResults)
    setChecked(false) // 👈 don't show summary after solution
  }, [data, calculateAnswer])

  // ✅ Summary only when "Check" is clicked
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
      <div className="flex gap-8 items-center justify-center">
        {data.map((d) => (
          <div key={d.id} className="flex items-center flex-col">
            {/* Top number */}
            <p className="text-xl font-bold">{d.result}</p>
            <div className="w-20 h-0.5 bg-blue-400 my-1"></div>

            {/* Bottom row */}
            <div className="flex items-center gap-2">
              <p className="px-3 w-10 text-center font-bold">{d.option}</p>
              <div className="w-0.5 h-14 bg-blue-400"></div>
              <input
                type="text"
                value={answers[d.id] ?? ""}
                onChange={(e) => handleChange(d.id, e.target.value)}
                className={`border-b-2 px-3 w-10 text-center outline-none
                  ${
                    results[d.id] === "correct" && checked
                      ? "border-green-600 text-green-600"
                      : results[d.id] === "wrong" && checked
                      ? "border-red-600 text-red-600"
                      : "border-dashed border-black"
                  }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
    </div>
  )
}
