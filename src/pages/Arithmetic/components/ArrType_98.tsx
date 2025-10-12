
import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
type Problem = {
  id: string;
  img: string;
  photoCm: number;
  scale: number;
  realCm: number;
  realM: number;
};

type Props = {
  data?: Problem[];
  hint?: string;
};

type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/* ---------------- Defaults ---------------- */
const DEFAULT_DATA: Problem[] = [
  { id: "car", img: "/images/arrtype98car.png", photoCm: 5, scale: 45, realCm: 225, realM: 2.25 },
  { id: "wall", img: "/images/arrtype98wall.png", photoCm: 6, scale: 35, realCm: 210, realM: 2.1 },
];

const DEFAULT_HINT =
  "Use the scale ratio: (photo cm × scale). Convert cm to meters by dividing by 100.";

/* ---------------- Input ---------------- */
const NumberInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  ok: boolean | null;
}> = ({ value, onChange, ok }) => {
  const border =
    ok === null
      ? "border-slate-400"
      : ok
      ? "border-green-500 text-green-600"
      : "border-red-500 text-red-600";

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
      className={`w-16 text-center border-b-2 border-dotted focus:outline-none ${border}`}
    />
  );
};

/* ---------------- Main Component ---------------- */
const ArrType_98: React.FC<Props> = ({ data, hint }) => {
  const DATA = DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState(() =>
    DATA.map(() => ({ photo: "", realCm: "", realM: "" }))
  );
  const [ok, setOk] = useState(() =>
    DATA.map(() => ({ photo: null, realCm: null, realM: null }))
  );
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setValues(DATA.map(() => ({ photo: "", realCm: "", realM: "" })));
    setOk(DATA.map(() => ({ photo: null, realCm: null, realM: null })));
    setStatus("idle");
    setShowHint(false);
  }, [data]);

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const res = DATA.map((p, i) => {
      const v = values[i];
      return {
        photo: v.photo === String(p.photoCm),
        realCm: v.realCm === String(p.realCm),
        realM: v.realM === String(p.realM),
      };
    });
    setOk(res);
    setStatus(res.every((r) => r.photo && r.realCm && r.realM) ? "match" : "wrong");
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    setValues(
      DATA.map((p) => ({
        photo: String(p.photoCm),
        realCm: String(p.realCm),
        realM: String(p.realM),
      }))
    );
    setOk(DATA.map(() => ({ photo: true, realCm: true, realM: true })));
    setStatus("match");
  }, [DATA]);

  const handleShowHint = useCallback(() => {
    setShowHint((s) => !s);
  }, []);

  /* -------- Summary -------- */
  const summary: Summary | null = useMemo(() => {
    if (status === "match")
      return {
        text: "Correct! Great job.",
        color: "text-green-700",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
      };
    if (status === "wrong")
      return {
        text: "Some answers are wrong. Try again.",
        color: "text-red-700",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
      };
    return null;
  }, [status]);

  const { setControls } = useQuestionControls();
  useEffect(() => {
    setControls({
      handleCheck,
      handleShowSolution,
      handleShowHint,
      hint: help,
      showHint,
      summary,
    });
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, help, showHint, summary]);

  /* -------- Render -------- */
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Question 1</h2>
        <p className="text-sm text-slate-600">How big is it in reality? Measure with a ruler.</p>
      </div>

      <div className="grid grid-cols-2 gap-10">
        {DATA.map((p, i) => (
          <div key={p.id} className="flex flex-col items-center gap-4">
            <img src={p.img} alt={p.id} className="h-32 object-contain" />

            <p className="text-sm text-slate-600">Scale: 1:{p.scale}</p>

            <table className="border text-center text-sm">
              <thead className="bg-orange-50">
                <tr>
                  <th className="px-3 py-1 border">in the photo (cm)</th>
                  <th className="px-3 py-1 border">1</th>
                  <th className="px-3 py-1 border">{p.photoCm}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-1 border">in real life (cm)</td>
                  <td className="px-3 py-1 border">{p.scale}</td>
                  <td className="px-3 py-1 border">
                    <NumberInput
                      value={values[i].realCm}
                      onChange={(val) =>
                        setValues((prev) => {
                          const cp = [...prev];
                          cp[i] = { ...cp[i], realCm: val };
                          return cp;
                        })
                      }
                      ok={ok[i].realCm}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-sm">
              The {p.id} is{" "}
              <NumberInput
                value={values[i].realCm}
                onChange={(val) =>
                  setValues((prev) => {
                    const cp = [...prev];
                    cp[i] = { ...cp[i], realCm: val };
                    return cp;
                  })
                }
                ok={ok[i].realCm}
              />{" "}
              cm ={" "}
              <NumberInput
                value={values[i].realM}
                onChange={(val) =>
                  setValues((prev) => {
                    const cp = [...prev];
                    cp[i] = { ...cp[i], realM: val };
                    return cp;
                  })
                }
                ok={ok[i].realM}
              />{" "}
              m
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_98;
