import ReadingFillBlanks from "@/pages/Reading/components/ReadingFillBlanks";
import ReadingMultipleChoice from "@/pages/Reading/components/ReadingMultipleChoice";
import ReadingShortQuestion from "@/pages/Reading/components/ReadingShortQuestion";

type QuestionRecord = {
  id?: number;
  type?: string;
  metadata?: {
    question?: string;
    options?: unknown[];
    correctAnswer?: unknown;
    description?: unknown;
    hint?: unknown;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type Props = {
  question: QuestionRecord;
  serial?: number;
};

export default function LanguageQuestionRenderer({ question, serial = 1 }: Props) {
  const qType = String(question?.type ?? "");
  const meta = (question?.metadata ?? {}) as QuestionRecord["metadata"];

  if (qType === "mcq") {
    return (
      <ReadingMultipleChoice
        key={serial}
        qid={serial}
        question={String(meta?.question ?? "")}
        options={Array.isArray(meta?.options) ? (meta?.options as string[]) : []}
        correctAnswer={String(meta?.correctAnswer ?? "")}
        description={String(meta?.description ?? "")}
        hint={String(meta?.hint ?? "")}
        id={question?.id}
      />
    );
  }

  if (qType === "short") {
    return (
      <ReadingShortQuestion
        key={serial}
        qid={serial}
        question={String(meta?.question ?? "")}
        correctAnswer={String(meta?.correctAnswer ?? "")}
        description={String(meta?.description ?? "")}
        hint={String(meta?.hint ?? "")}
        id={question?.id}
      />
    );
  }

  if (qType === "fill_blank") {
    return (
      <ReadingFillBlanks
        key={serial}
        qid={serial}
        question={String(meta?.question ?? "")}
        correctAnswer={String(meta?.correctAnswer ?? "")}
        description={String(meta?.description ?? "")}
        hint={String(meta?.hint ?? "")}
        id={question?.id}
      />
    );
  }

  return null;
}
