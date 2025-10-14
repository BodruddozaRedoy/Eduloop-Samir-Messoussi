import { useQuestionControls } from "@/context/QuestionControlsContext";
import { useQuestionMeta } from "@/context/QuestionMetaContext";
import useResultTracker from "@/hooks/useResultTracker";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

/* ---------------- Component (data & input in KG) ---------------- */
type Props = { data?: number[]; hint?: string };
type Status = "idle" | "match" | "wrong";
interface Summary {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const DEMO_KG = [300, 750, 50, 950]; // kilograms
const DEFAULT_HINT = "Read each dial (0–1000 kg). Type the kilograms shown by the pointer.";

const parseNum = (s: string) => {
  const n = parseFloat(String(s ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

const ArrType_60: React.FC<Props> = ({ data, hint }) => {
  // sanitize incoming kg values; ensure exactly 4
  const kgValues = useMemo(() => {
    const raw = Array.isArray(data) && data.length ? data.slice(0, 4) : DEMO_KG.slice(0, 4);
    while (raw.length < 4) raw.push(0);
    return raw.map((kg, i) => (Number.isFinite(kg) ? Math.max(0, Math.min(1000, kg)) : DEMO_KG[i]));
  }, [data]);

  const [inputs, setInputs] = useState<string[]>(() => kgValues.map(() => ""));
  const [ok, setOk] = useState<boolean[]>(() => kgValues.map(() => false));
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  // reset when kgValues change
  useEffect(() => {
    setInputs(kgValues.map(() => ""));
    setOk(kgValues.map(() => false));
    setChecked(false);
    setStatus("idle");
    setShowHint(false);
  }, [kgValues]);

  const onChange = (i: number, v: string) =>
    setInputs((prev) => {
      const cp = [...prev];
      cp[i] = v;
      return cp;
    });

  /* -------- memoized handlers (avoid update-depth loop) -------- */
    const { addResult } = useResultTracker();
    const { id: qId, title: qTitle } = useQuestionMeta();
  const handleCheck = useCallback(() => {
    const res = kgValues.map((kg, i) => {
      const userKg = parseNum(inputs[i]);
      // exact match in kilograms (tiny tolerance for 300 vs 300.0)
      return Number.isFinite(userKg) && Math.abs(userKg - kg) < 0.01;
    });
    setOk(res);
    setChecked(true);
    setStatus(res.every(Boolean) ? "match" : "wrong");
    addResult({ id: qId, title: qTitle },res.every(Boolean));
  }, [kgValues, inputs]);

  const handleShowSolution = useCallback(() => {
    setInputs(kgValues.map((kg) => String(kg)));
    setOk(kgValues.map(() => true));
    setChecked(true);
    setStatus("match");
  }, [kgValues]);

  const handleShowHint = useCallback(() => setShowHint((s) => !s), []);

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

  // register handlers with global toolbar; guard to avoid loops
  const { setControls } = useQuestionControls();
  const controls = useMemo(
    () => ({
      handleCheck,
      handleShowSolution,
      handleShowHint,
      hint: hint ?? DEFAULT_HINT,
      showHint,
      summary,
    }),
    [handleCheck, handleShowSolution, handleShowHint, hint, showHint, summary]
  );

  useEffect(() => {
    setControls((prev: any) => {
      const same =
        prev?.handleCheck === controls.handleCheck &&
        prev?.handleShowSolution === controls.handleShowSolution &&
        prev?.handleShowHint === controls.handleShowHint &&
        prev?.hint === controls.hint &&
        prev?.showHint === controls.showHint &&
        prev?.summary === controls.summary;
      return same ? prev : controls;
    });
  }, [controls, setControls]);

  const tone = (good: boolean) =>
    !checked
      ? "border-slate-300 text-slate-900"
      : good
      ? "border-emerald-500 text-emerald-600"
      : "border-rose-500 text-rose-600";

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {kgValues.map((kg, i) => (
          <div key={`g-${i}`} className="flex flex-col items-center gap-3">
            <KiloGramMeter value={kg} />
            <div className="flex items-baseline gap-2">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={inputs[i]}
                onChange={(e) => onChange(i, e.target.value)}
                className={`w-24 text-center bg-transparent border-b border-dotted outline-none ${tone(
                  ok[i]
                )}`}
                placeholder=""
              />
              <span className="text-slate-700">kilogram</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrType_60;























/* ---------------- Gauge (expects KG 0..1000) ---------------- */
type KiloGramMeterProps = { value: number; size?: number; sweep?: number };

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const map = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  ((v - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

const KiloGramMeter: React.FC<KiloGramMeterProps> = ({ value, size = 220, sweep = 270 }) => {
  const min = 0, max = 1000, tickEvery = 100; // all in KILOGRAMS
  const v = clamp(Number.isFinite(value) ? value : 0, min, max);

  const start = -sweep / 2, end = sweep / 2;
  const needleDeg = map(v, min, max, start, end);

  const cx = size / 2, cy = size / 2;
  const rOuter = Math.round(size * 0.39);
  const rFace = rOuter - 6;
  const rNeedle = rFace - 18;
  const tickOuter = rOuter - 4;
  const tickInnerMinor = tickOuter - 10;
  const tickInnerMajor = tickOuter - 18;

  const ticks = useMemo(() => {
    const arr: number[] = [];
    for (let t = min; t <= max; t += tickEvery) arr.push(t);
    if (arr[arr.length - 1] !== max) arr.push(max);
    return arr;
  }, []);

  const toRad = (degFromRight: number) => (degFromRight * Math.PI) / 180;
  const cartDeg = (needleAngleDeg: number) => needleAngleDeg - 90;

  return (
    <div className="inline-flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={rOuter} className="fill-white stroke-gray-400" strokeWidth={8} />
        <circle cx={cx} cy={cy} r={rFace} className="fill-white" />

        <g>
          {ticks.map((t, i) => {
            const a = map(t, min, max, start, end);
            const rad = toRad(cartDeg(a));
            const major = (t - min) % 200 === 0;

            const x1 = cx + (major ? tickInnerMajor : tickInnerMinor) * Math.cos(rad);
            const y1 = cy + (major ? tickInnerMajor : tickInnerMinor) * Math.sin(rad);
            const x2 = cx + tickOuter * Math.cos(rad);
            const y2 = cy + tickOuter * Math.sin(rad);

            const showLabel = t === min || t === max;
            const lx = cx + (tickInnerMajor - 22) * Math.cos(rad);
            const ly = cy + (tickInnerMajor - 22) * Math.sin(rad);

            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#2e2e2e"
                  strokeWidth={major ? 3 : 2}
                  strokeLinecap="round"
                />
                {showLabel && (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-gray-700 text-[10px] select-none"
                  >
                    {t}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        <g
          style={{
            transform: `rotate(${needleDeg}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: "transform 220ms ease-out",
          }}
        >
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - rNeedle}
            className="stroke-red-500"
            strokeWidth={6}
            strokeLinecap="round"
          />
        </g>

        <circle cx={cx} cy={cy} r={12} className="fill-gray-600" />
      </svg>
    </div>
  );
};
