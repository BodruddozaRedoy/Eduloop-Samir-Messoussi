import React, { createContext, useContext } from "react";

export type QuestionMeta = {
  id: number;
  title: string;
};

const QuestionMetaContext = createContext<QuestionMeta | null>(null);

export function QuestionMetaProvider({ value, children }: { value: QuestionMeta; children: React.ReactNode }) {
  return <QuestionMetaContext.Provider value={value}>{children}</QuestionMetaContext.Provider>;
}

export function useQuestionMeta() {
  const ctx = useContext(QuestionMetaContext);
  if (!ctx) throw new Error("useQuestionMeta must be used within a QuestionMetaProvider");
  return ctx;
}

