import useResultTracker from "@/hooks/useResultTracker";
import VocabularyFillBlank from "./VocabularyFillBlank";
import VocabularyMCQ from "./VocabularyMCQ";
import VocabularyShort from "./VocabularyShort";

type QuestionRecord = {
  type?: string;
  metadata?: {
    question?: string;
    options?: unknown[];
    correctAnswer?: unknown;
    hint?: unknown;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type Props = {
  question: QuestionRecord;
  serial?: number;
};

export default function VocabularyQuestionRenderer({ question, serial = 1 }: Props) {
  const { addResult } = useResultTracker();
  const qType = String(question?.type ?? "");
  const meta = (question?.metadata ?? {}) as QuestionRecord["metadata"];

  if (qType === "mcq") {
    return (
      <VocabularyMCQ
        key={serial}
        qid={serial}
        question={String(meta?.question ?? "")}
        options={Array.isArray(meta?.options) ? (meta?.options as string[]) : []}
        correctAnswer={Array.isArray(meta?.correctAnswer) ? (meta?.correctAnswer as string[]) : []}
        hint={String(meta?.hint ?? "")}
        addResult={addResult}
      />
    );
  }

  if (qType === "fill") {
    return (
      <VocabularyFillBlank
        key={serial}
        qid={serial}
        question={String(meta?.question ?? "")}
        correctAnswer={Array.isArray(meta?.correctAnswer) ? (meta?.correctAnswer as string[]) : []}
        hint={String(meta?.hint ?? "")}
        addResult={addResult}
      />
    );
  }

  if (qType === "short" || qType === "short_answer") {
    return (
      <VocabularyShort
        key={serial}
        qid={serial}
        question={String(meta?.question ?? "")}
        correctAnswer={Array.isArray(meta?.correctAnswer) ? (meta?.correctAnswer as string[]) : []}
        hint={String(meta?.hint ?? "")}
        addResult={addResult}
      />
    );
  }

  return null;
}
