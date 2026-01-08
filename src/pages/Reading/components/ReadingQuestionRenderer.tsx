import ReadingFillBlanks from "./ReadingFillBlanks";
import ReadingMultipleChoice from "./ReadingMultipleChoice";
import ReadingShortQuestion from "./ReadingShortQuestion";
import ReadingStory from "./ReadingStory";

type StoryQuestion = {
  id?: number;
  qs: string;
  ans: string;
  options?: string[];
};

type StoryData = {
  story?: string;
  image?: string;
  data?: StoryQuestion[];
};

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

export default function ReadingQuestionRenderer({ question, serial = 1 }: Props) {
  const qType = String(question?.type ?? "");
  const meta = (question?.metadata ?? {}) as NonNullable<QuestionRecord["metadata"]>;

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

  if (qType === "readingStoryQuestion") {
    const storyData = meta as unknown as StoryData;
    return (
      <ReadingStory
        key={serial}
        qid={serial}
        data={storyData}
        question={String(meta?.question ?? "")}
        correctAnswer={String(meta?.correctAnswer ?? "")}
        description={String(meta?.description ?? "")}
        hint={String(meta?.hint ?? "")}
        id={question?.id ?? serial}
      />
    );
  }

  return null;
}
