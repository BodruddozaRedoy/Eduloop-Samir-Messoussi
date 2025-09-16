import Check from "@/components/common/Check";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import { useEffect, useState, useCallback, useMemo } from "react";
import useResultTracker from "@/hooks/useResultTracker";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import { useQuestionControls } from "@/context/QuestionControlsContext";

/* ---- AccurateStack ---- */
type StackProps = { numbers?: [number, number, number] };
function AccurateStack({ numbers = [6, 5, 3] }: StackProps) {
  return (
    <div className="inline-block rounded-md bg-amber-50/60 p-2">
      <div className="relative h-12 w-[12.5rem]">
        {/* back */}
        <div className="z-10 flex h-10 w-full items-center border-2 border-orange-500 bg-white px-3">
          <span className="text-lg font-semibold text-slate-800">{numbers[0]}</span>
        </div>
        {/* middle */}
        <div className="absolute right-0 top-1 z-20 flex h-10 w-[75%] items-center border-2 border-orange-500 bg-white px-3">
          <span className="text-lg font-semibold text-slate-800">{numbers[1]}</span>
        </div>
        {/* front */}
        <div className="absolute bottom-0 right-0 z-30 flex h-10 w-1/3 items-center justify-center border-2 border-orange-500 bg-white">
          <span className="text-lg font-semibold text-slate-800">{numbers[2]}</span>
        </div>
      </div>
    </div>
  );
}

/* ---- Input ---- */
function SplitInput({
  value,
  onChange,
  invalid,
  correct,
  width = "w-56",
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  correct?: boolean;
  width?: string;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
      className={`h-12 ${width} bg-white px-3 text-lg font-semibold outline-none
        text-center font-mono tabular-nums tracking-[5em]
        border-2 ${
          invalid
            ? "border-rose-500 text-rose-700"
            : correct
            ? "border-emerald-600 text-emerald-700"
            : "border-orange-500 text-slate-800"
        }`}
    />
  );
}

/* ---- Page ---- */
type Row = { id: number; digits: [number, number, number] };

const toExpected = ([h, t, u]: [number, number, number]) =>
  [h * 100, t * 10, u] as [number, number, number];

type Status = "idle" | "match" | "wrong";

export default function ArrType_18({
  data: rows,
  hint,
}: {
  data: Row[];
  hint: string;
}) {
  type State = {
    val: [string, string, string];
    bad: [boolean, boolean, boolean];
    checked: boolean;
  };

  const [state, setState] = useState<Record<number, State>>(() => {
    const init: Record<number, State> = {};
    rows.forEach(
      (r) =>
        (init[r.id] = { val: ["", "", ""], bad: [false, false, false], checked: false })
    );
    return init;
  });

  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);
  const { addResult } = useResultTracker();
  const { id: qId, title: qTitle } = useQuestionMeta();
  const { setControls } = useQuestionControls();

  const setVal = useCallback(
    (id: number, idx: 0 | 1 | 2, v: string) =>
      setState((s) => {
        const next = { ...s };
        const cur = { ...next[id], val: [...next[id].val] as [string, string, string] };
        cur.val[idx] = v;
        next[id] = cur;
        return next;
      }),
    []
  );

  const handleCheckAll = useCallback(() => {
    let anyWrong = false;
    let allFilledAndCorrect = true;

    setState((s) => {
      const next: typeof s = { ...s };
      for (const r of rows) {
        const [e0, e1, e2] = toExpected(r.digits);
        const vals = next[r.id].val.map((x) =>
          x.trim() === "" ? NaN : Number(x)
        ) as [number, number, number];
        const bad: [boolean, boolean, boolean] = [
          vals[0] !== e0,
          vals[1] !== e1,
          vals[2] !== e2,
        ];
        if (bad[0] || bad[1] || bad[2]) anyWrong = true;
        if (vals.some((n) => Number.isNaN(n)) || anyWrong)
          allFilledAndCorrect = false;
        next[r.id] = { ...next[r.id], bad, checked: true };
      }
      return next;
    });

    const ok = !anyWrong && allFilledAndCorrect;
    setStatus(ok ? "match" : "wrong");
    addResult({ id: qId, title: qTitle }, ok);
  }, [rows, addResult, qId, qTitle]);

  const handleShowSolution = useCallback(() => {
    setState((s) => {
      const next: typeof s = { ...s };
      for (const r of rows) {
        const [a, b, c] = toExpected(r.digits);
        next[r.id] = {
          val: [String(a), String(b), String(c)],
          bad: [false, false, false],
          checked: true,
        };
      }
      return next;
    });
  }, [rows]);

  const handleShowHint = useCallback(() => setShowHint((v) => !v), []);

  const summary = useMemo(() => {
    return status === "match"
      ? {
          text: "🎉 All correct! Great job.",
          color: "text-green-700",
          bgColor: "bg-green-100",
          borderColor: "border-green-600",
        }
      : status === "wrong"
      ? {
          text: "❌ Some answers are wrong. Check again.",
          color: "text-red-700",
          bgColor: "bg-red-100",
          borderColor: "border-red-600",
        }
      : null;
  }, [status]);

  useEffect(() => {
    setControls({
      handleCheck: handleCheckAll,
      handleShowHint,
      handleShowSolution,
      hint,
      showHint,
      summary,
    });
  }, [setControls, handleCheckAll, handleShowHint, handleShowSolution, hint, showHint, summary]);

  return (
    <div className="space-y-4">
      {rows.map((r) => {
        const st = state[r.id];
        const [e0, e1, e2] = toExpected(r.digits);
        const v0 = st.val[0].trim(),
          v1 = st.val[1].trim(),
          v2 = st.val[2].trim();
        const c0 = st.checked && !st.bad[0] && v0 !== "";
        const c1 = st.checked && !st.bad[1] && v1 !== "";
        const c2 = st.checked && !st.bad[2] && v2 !== "";

        return (
          <div key={r.id} className="rounded-2xl bg-amber-50/60 p-4">
            <div className="flex items-center gap-6">
              <AccurateStack numbers={r.digits} />
              <span className="text-2xl font-bold text-slate-700">→</span>
              <div className="flex flex-wrap items-center gap-6">
                <SplitInput
                  value={st.val[0]}
                  onChange={(v) => setVal(r.id, 0, v)}
                  invalid={st.checked && st.bad[0]}
                  correct={c0 && Number(v0) === e0}
                  width="w-64"
                />
                <SplitInput
                  value={st.val[1]}
                  onChange={(v) => setVal(r.id, 1, v)}
                  invalid={st.checked && st.bad[1]}
                  correct={c1 && Number(v1) === e1}
                  width="w-64"
                />
                <SplitInput
                  value={st.val[2]}
                  onChange={(v) => setVal(r.id, 2, v)}
                  invalid={st.checked && st.bad[2]}
                  correct={c2 && Number(v2) === e2}
                  width="w-28"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
