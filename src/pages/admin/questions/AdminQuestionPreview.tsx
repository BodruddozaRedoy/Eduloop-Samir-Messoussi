import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { AxiosAdmin } from "@/config/axios";
import {
    QuestionControlsProvider,
    useQuestionControls,
} from "@/context/QuestionControlsContext";
import QuestionRenderer from "@/pages/Arithmetic/components/QuestionRenderer";
import LanguageQuestionRenderer from "@/pages/Language/components/LanguageQuestionRenderer";
import ReadingQuestionRenderer from "@/pages/Reading/components/ReadingQuestionRenderer";
import SpellingQuestionRenderer from "@/pages/Spelling/components/SpellingQuestionRenderer";
import VocabularyQuestionRenderer from "@/pages/Vocabulary/components/VocabularyQuestionRenderer";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import AdminHeader from "../components/AdminHeader";

type QuestionRecord = {
  id?: number;
  type?: string;
  subject?: string;
  metadata?: {
    question?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type LocationState = {
  question?: QuestionRecord;
};

// Admin CRUD endpoints (per backend/Postman)
const QUESTION_CREATE_ENDPOINT = "/question/create/";
const DASHBOARD_QUESTION_ENDPOINT = "/dashboard/question/";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function coerceNumericId(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed) && String(parsed) === trimmed) return parsed;
  }
  return null;
}

function stripUndefined(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined));
}

function pickFirstDefined(...values: unknown[]): unknown {
  for (const v of values) {
    if (v !== undefined && v !== null) return v;
  }
  return undefined;
}

function resolveFieldPreferString(
  record: Record<string, unknown>,
  ...keys: string[]
): string | number | undefined {
  for (const key of keys) {
    const v = record[key];
    if (typeof v === "string" && v.trim()) return v;
  }
  for (const key of keys) {
    const v = record[key];
    const n = coerceNumericId(v);
    if (n !== null) return n;
  }
  return undefined;
}

function formatRequestError(err: unknown): string {
  const anyErr = err as {
    message?: string;
    response?: { status?: number; data?: unknown };
  };

  const status = anyErr?.response?.status;
  const data = anyErr?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return status ? `[${status}] ${data}` : data;
  }

  if (isRecord(data)) {
    const detail = data.detail;
    if (typeof detail === "string" && detail.trim()) {
      return status ? `[${status}] ${detail}` : detail;
    }
    try {
      const asJson = JSON.stringify(data);
      return status ? `[${status}] ${asJson}` : asJson;
    } catch {
      // ignore
    }
  }

  const message = anyErr?.message;
  if (typeof message === "string" && message.trim()) return message;
  return "Request failed";
}

function truncateMessage(message: string, maxLen = 800): string {
  const trimmed = message.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen)}…`;
}

function getDashboardQuestionDetailUrl(id: number | string): string {
  const base = DASHBOARD_QUESTION_ENDPOINT.endsWith("/")
    ? DASHBOARD_QUESTION_ENDPOINT.slice(0, -1)
    : DASHBOARD_QUESTION_ENDPOINT;
  return `${base}/${id}`;
}

class PreviewErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: string | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(err: unknown) {
    const message = err instanceof Error ? err.message : "Preview crashed";
    return { error: message };
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to render preview: {this.state.error}
        </div>
      );
    }

    return this.props.children;
  }
}

function ArithmeticControllersSlot({ id }: { id: unknown }) {
  const { controls } = useQuestionControls();
  const noop = () => {};
  const hasAny =
    controls.handleCheck ||
    controls.handleShowHint ||
    controls.handleShowSolution ||
    controls.summary;

  if (!hasAny) return null;

  return (
    <div className="flex flex-col gap-6">
      <Controllers
        handleCheck={controls.handleCheck || noop}
        handleShowSolution={controls.handleShowSolution || noop}
        handleShowHint={controls.handleShowHint || noop}
        id={id}
      />
      {controls.showHint && controls.hint ? <Hint hint={controls.hint} /> : null}
      <Check summary={controls.summary || null} />
    </div>
  );
}

export default function AdminQuestionPreview() {
  const navigate = useNavigate();
  const params = useParams();
  const { state } = useLocation() as { state: LocationState | null };

  const [question, setQuestion] = useState<QuestionRecord | null>(
    state?.question ?? null
  );

  const [metadataText, setMetadataText] = useState<string>("");
  const [metadataParsed, setMetadataParsed] = useState<
    Record<string, unknown> | null
  >(null);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [renderNonce, setRenderNonce] = useState(0);
  const [busyAction, setBusyAction] = useState<"create" | "update" | "delete" | null>(
    null
  );

  useEffect(() => {
    setQuestion(state?.question ?? null);
  }, [state?.question]);

  useEffect(() => {
    if (!question) {
      setMetadataText("");
      setMetadataParsed(null);
      setMetadataError(null);
      return;
    }

    const nextText = JSON.stringify(question?.metadata ?? {}, null, 2);
    setMetadataText(nextText);
    setMetadataParsed((question?.metadata ?? {}) as Record<string, unknown>);
    setMetadataError(null);
  }, [question]);

  useEffect(() => {
    if (!question) return;

    try {
      const parsed = JSON.parse(metadataText || "{}");
      setMetadataParsed(parsed);
      setMetadataError(null);
      setRenderNonce((n) => n + 1);
    } catch {
      setMetadataError("Invalid JSON");
    }
  }, [metadataText, question]);

  const previewQuestion = useMemo(() => {
    if (!question) return null;

    if (metadataError) {
      return question;
    }

    // Textarea may contain:
    // 1) metadata-only JSON (e.g. { question, hint, data })
    // 2) full question JSON (e.g. { group, subject, type, metadata: {...} })
    const parsed = metadataParsed;
    if (!parsed) return question;

    const hasFullQuestionShape =
      Object.prototype.hasOwnProperty.call(parsed, "metadata") ||
      Object.prototype.hasOwnProperty.call(parsed, "group") ||
      Object.prototype.hasOwnProperty.call(parsed, "subject") ||
      Object.prototype.hasOwnProperty.call(parsed, "category") ||
      Object.prototype.hasOwnProperty.call(parsed, "subcategory") ||
      Object.prototype.hasOwnProperty.call(parsed, "type");

    if (hasFullQuestionShape) {
      const nextMetadata = isRecord(parsed.metadata)
        ? (parsed.metadata as Record<string, unknown>)
        : (question.metadata as Record<string, unknown> | undefined) ?? {};

      return {
        ...question,
        ...parsed,
        metadata: nextMetadata,
      } as QuestionRecord;
    }

    return {
      ...question,
      metadata: parsed,
    };
  }, [question, metadataError, metadataParsed]);

  const pq = useMemo(() => {
    if (!question) return null;
    return (previewQuestion ?? question) as QuestionRecord;
  }, [previewQuestion, question]);

  const previewKind = useMemo(() => {
    const qType = String(pq?.type ?? "").toLowerCase();
    const subjectName = String(pq?.subject ?? "").toLowerCase();

    // Arithmetic backend types look like: type1, type2_1, type118, ...
    if (/^type\d+/.test(qType)) return "arithmetic";

    if (qType.startsWith("spelling")) return "spelling";

    // Vocabulary has some unique types
    if (qType === "fill" || qType === "short_answer") return "vocabulary";

    // mcq/short/fill_blank are shared; use subject name to disambiguate.
    if (subjectName.includes("vocab")) return "vocabulary";
    if (subjectName.includes("spell")) return "spelling";
    if (subjectName.includes("read")) return "reading";
    if (subjectName.includes("lang") || subjectName.includes("taal")) return "language";

    // fallback based on types
    if (qType === "readingstoryquestion") return "reading";
    if (qType === "mcq" || qType === "short" || qType === "fill_blank") return "reading";

    return "unknown";
  }, [pq?.subject, pq?.type]);

  if (!question) {
    return (
      <div className="min-w-0">
        <AdminHeader
          title="Question Preview"
          subtitle="Filter, manage, and create educational questions."
        />
        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div className="rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-800">
            No question was provided to preview. Open this page from the Questions
            table.
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/questions")}
            className="mt-4 h-9 rounded-lg bg-orange-600 px-5 text-xs font-semibold text-white hover:bg-orange-700"
          >
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionId =
    question?.id ??
    coerceNumericId(params.id) ??
    coerceNumericId((question as Record<string, unknown>)?.question_id);

  const buildPayload = (kind: "create" | "update") => {
    const base = question as Record<string, unknown>;
    const nowIso = new Date().toISOString();

    const parsed = !metadataError ? metadataParsed : null;
    const hasFullQuestionShape =
      !!parsed &&
      (Object.prototype.hasOwnProperty.call(parsed, "metadata") ||
        Object.prototype.hasOwnProperty.call(parsed, "group") ||
        Object.prototype.hasOwnProperty.call(parsed, "subject") ||
        Object.prototype.hasOwnProperty.call(parsed, "category") ||
        Object.prototype.hasOwnProperty.call(parsed, "subcategory") ||
        Object.prototype.hasOwnProperty.call(parsed, "type"));

    // If user pasted a full question JSON, send it (with timestamps ensured).
    if (parsed && hasFullQuestionShape) {
      const next: Record<string, unknown> = { ...parsed };
      if (!isRecord(next.metadata)) {
        next.metadata =
          (question.metadata as Record<string, unknown> | undefined) ?? {};
      }

      if (kind === "create" && next.created_at === undefined) next.created_at = nowIso;
      if (next.updated_at === undefined) next.updated_at = nowIso;
      return stripUndefined(next);
    }

    // Otherwise treat textarea JSON as metadata-only.
    const metadata = metadataError
      ? (question.metadata as Record<string, unknown> | undefined) ?? {}
      : (metadataParsed ?? (question.metadata as Record<string, unknown> | undefined) ?? {});

    const payload: Record<string, unknown> = {
      ...(kind === "update" && currentQuestionId ? { id: currentQuestionId } : {}),
      // This API expects names (strings) like "Groep-8", "Rekenen", ...
      group: resolveFieldPreferString(base, "group", "group_name", "groupName"),
      subject: resolveFieldPreferString(base, "subject", "subject_name", "subjectName"),
      category: resolveFieldPreferString(base, "category", "category_name", "categoryName"),
      subcategory: resolveFieldPreferString(
        base,
        "subcategory",
        "subcategory_name",
        "subcategoryName"
      ),
      level: pickFirstDefined(base.level, base.difficulty),
      type: base.type,
      metadata,
      created_at: kind === "create" ? nowIso : undefined,
      updated_at: nowIso,
    };

    return stripUndefined(payload);
  };

  const handleCreate = async () => {
    if (metadataError) {
      toast.error("Fix metadata JSON before creating");
      return;
    }

    setBusyAction("create");
    try {
      const payload = buildPayload("create");
      const res = await AxiosAdmin.post(QUESTION_CREATE_ENDPOINT, payload);
      const createdId =
        coerceNumericId((res.data as Record<string, unknown>)?.id) ??
        coerceNumericId((res.data as Record<string, unknown>)?.question_id);

      if (createdId !== null) {
        toast.success(`Created question #${createdId}`);
      } else {
        toast.success("Created question");
      }

      if (res.data && typeof res.data === "object") {
        setQuestion(res.data as QuestionRecord);
      }
    } catch (err) {
      console.error("Create question failed:", err);
      toast.error("Create failed", {
        description: truncateMessage(formatRequestError(err)),
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleUpdate = async () => {
    if (!currentQuestionId) {
      toast.error("Missing question id for update");
      return;
    }
    if (metadataError) {
      toast.error("Fix metadata JSON before updating");
      return;
    }

    setBusyAction("update");
    try {
      const payload = buildPayload("update");
      let res;
      try {
        res = await AxiosAdmin.patch(
          `${getDashboardQuestionDetailUrl(currentQuestionId)}/`,
          payload
        );
      } catch (err) {
        // Some servers are strict about trailing slashes; retry once.
        const anyErr = err as { response?: { status?: number } };
        if (anyErr?.response?.status === 404) {
          res = await AxiosAdmin.patch(
            getDashboardQuestionDetailUrl(currentQuestionId),
            payload
          );
        } else {
          throw err;
        }
      }
      toast.success("Updated question");

      if (res && res.data && typeof res.data === "object") {
        setQuestion(res.data as QuestionRecord);
      }
    } catch (err) {
      console.error("Update question failed:", err);
      toast.error("Update failed", {
        description: truncateMessage(formatRequestError(err)),
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleDelete = async () => {
    if (!currentQuestionId) {
      toast.error("Missing question id for delete");
      return;
    }

    setBusyAction("delete");
    try {
      try {
        await AxiosAdmin.delete(`${getDashboardQuestionDetailUrl(currentQuestionId)}/`);
      } catch (err) {
        const anyErr = err as { response?: { status?: number } };
        if (anyErr?.response?.status === 404) {
          await AxiosAdmin.delete(getDashboardQuestionDetailUrl(currentQuestionId));
        } else {
          throw err;
        }
      }
      toast.success("Deleted question");
      navigate("/admin/questions");
    } catch (err) {
      console.error("Delete question failed:", err);
      toast.error("Delete failed", {
        description: truncateMessage(formatRequestError(err)),
      });
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="min-w-0">
      <AdminHeader
        title="Question Preview"
        subtitle="Filter, manage, and create educational questions."
      />

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Metadata</h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-8 rounded-lg bg-orange-600 px-3 text-[11px] font-semibold text-white hover:bg-orange-700"
              onClick={() => {
                void handleCreate();
              }}
              disabled={busyAction !== null}
            >
              Create new
            </button>
            <button
              type="button"
              className="h-8 rounded-lg bg-blue-600 px-3 text-[11px] font-semibold text-white hover:bg-blue-700"
              onClick={() => {
                void handleUpdate();
              }}
              disabled={busyAction !== null}
            >
              Update
            </button>
            <button
              type="button"
              className="h-8 rounded-lg border border-red-400 px-3 text-[11px] font-semibold text-red-600 hover:bg-red-50"
              onClick={() => {
                void handleDelete();
              }}
              disabled={busyAction !== null}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-3">
          <textarea
            value={metadataText}
            onChange={(e) => setMetadataText(e.target.value)}
            className="h-56 w-full resize-none rounded-xl border border-gray-300 bg-white p-3 font-mono text-xs text-gray-800 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            spellCheck={false}
          />
          {metadataError ? (
            <p className="mt-2 text-xs font-medium text-red-600">
              {metadataError}. Fix JSON to update preview.
            </p>
          ) : null}
        </div>

        <div className="mt-6 rounded-[30px] border bg-white p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900">Question 1</h3>
            <p className="mt-1 text-sm text-gray-700">
              {String(pq?.metadata?.question ?? "")}
            </p>
            <p className="mt-1 text-[11px] text-gray-500">
              ID: {pq?.id ?? params.id}
            </p>
          </div>

          <PreviewErrorBoundary>
            <QuestionControlsProvider>
              <div key={renderNonce}>
                {previewKind === "arithmetic" ? (
                  <div className="space-y-4">
                    <QuestionRenderer q={pq} />
                    <ArithmeticControllersSlot id={pq?.id} />
                  </div>
                ) : previewKind === "reading" ? (
                  pq ? <ReadingQuestionRenderer question={pq} serial={1} /> : null
                ) : previewKind === "language" ? (
                  pq ? <LanguageQuestionRenderer question={pq} serial={1} /> : null
                ) : previewKind === "spelling" ? (
                  pq ? <SpellingQuestionRenderer question={pq} serial={1} /> : null
                ) : previewKind === "vocabulary" ? (
                  pq ? <VocabularyQuestionRenderer question={pq} serial={1} /> : null
                ) : (
                  <div className="rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-800">
                    Preview for this question type is not wired yet.
                  </div>
                )}
              </div>
            </QuestionControlsProvider>
          </PreviewErrorBoundary>
        </div>
      </div>
    </div>
  );
}
