import SpellingFillBlanks from "./SpellingFillBlanks";
import SpellingMultipleChoice from "./SpellingMultipleChoice";
import SpellingShortQuestion from "./SpellingShortQuestion";

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

export default function SpellingQuestionRenderer({ question, serial = 1 }: Props) {
  const qType = String(question?.type ?? "");
  const meta = (question?.metadata ?? {}) as QuestionRecord["metadata"];

  if (qType === "spellingMultipleChoi" || qType === "spellingMultipleChoice") {
    return (
      <SpellingMultipleChoice
        key={serial}
        qid={serial}
        question={String(meta?.question ?? "")}
        options={Array.isArray(meta?.options) ? (meta?.options as string[]) : []}
        correctAnswer={String(meta?.correctAnswer ?? "")}
        hint={String(meta?.hint ?? "")}
      />
    );
  }

  if (qType === "spellingShortQuestio" || qType === "spellingShortQuestion") {
    return (
      <SpellingShortQuestion
        key={serial}
        qid={serial}
        question={String(meta?.question ?? "")}
        correctAnswer={String(meta?.correctAnswer ?? "")}
        hint={String(meta?.hint ?? "")}
      />
    );
  }

  if (qType === "spellingFillBlanks") {
    return (
      <SpellingFillBlanks
        key={serial}
        qid={serial}
        question={String(meta?.question ?? "")}
        correctAnswer={String(meta?.correctAnswer ?? "")}
        hint={String(meta?.hint ?? "")}
      />
    );
  }

  return null;
}
