import React, { createContext, useContext, useState } from 'react'

export type Summary = {
  text: string
  color: string
  bgColor: string
  borderColor: string
} | null

export type QuestionControls = {
  handleCheck?: () => void
  handleShowHint?: () => void
  handleShowSolution?: () => void
  hint?: string
  showHint?: boolean
  summary?: Summary
}

type Ctx = {
  controls: QuestionControls
  setControls: React.Dispatch<React.SetStateAction<QuestionControls>>
}

const QuestionControlsContext = createContext<Ctx | undefined>(undefined)

export function QuestionControlsProvider({ children }: { children: React.ReactNode }) {
  const [controls, setControls] = useState<QuestionControls>({})
  return (
    <QuestionControlsContext.Provider value={{ controls, setControls }}>
      {children}
    </QuestionControlsContext.Provider>
  )
}

export function useQuestionControls() {
  const ctx = useContext(QuestionControlsContext)
  if (!ctx) throw new Error('useQuestionControls must be used within QuestionControlsProvider')
  return ctx
}

