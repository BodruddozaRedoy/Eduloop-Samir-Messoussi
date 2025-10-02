import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ---------------- Types ---------------- */
interface Item {
  id: string;
  major: number;
  unit: string;
  radius: number;
  perimeter: number;
  area: number;
  borderColor?: string;
}

type Props = {
  data?: Item[];
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
const DEFAULT_DATA: Item[] = [
  { id: "c1", major: 40, unit: "cm", radius: 20, perimeter: 125.6, area: 1256 ,borderColor:"border-green-400"},
  { id: "c2", major: 4, unit: "m", radius: 2, perimeter: 12.56, area: 12.56, borderColor:"border-purple-400" },
  { id: "c3", major: 80, unit: "cm", radius: 40, perimeter: 251.2, area: 5024 ,borderColor:"border-yellow-400"},
];

const DEFAULT_HINT =
  "Calculate the perimeter and the area of the circle. Use π ≈ 3.14.";

/* ---------------- Helpers ---------------- */
const borderClass = (ok: boolean | null | undefined) =>
  ok === null || ok === undefined
    ? "border-slate-400"
    : ok
    ? "border-green-500 text-green-600"
    : "border-red-500 text-red-600";

/* ---------------- Main Component ---------------- */
const ArrType_119: React.FC<Props> = ({ data, hint }) => {
  const DATA =  DEFAULT_DATA;
  const help = hint ?? DEFAULT_HINT;

  const [values, setValues] = useState<
    Record<
      string,
      {
        circleRadius: string;
        perimeterRadius: string;
        perimeterResult: string;
        areaRadius1: string;
        areaRadius2: string;
        areaResult: string;
      }
    >
  >({});

  const [ok, setOk] = useState<
    Record<
      string,
      {
        circleRadius: boolean | null;
        perimeterRadius: boolean | null;
        perimeterResult: boolean | null;
        areaRadius1: boolean | null;
        areaRadius2: boolean | null;
        areaResult: boolean | null;
      }
    >
  >({});

  const [status, setStatus] = useState<Status>("idle");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const initVals: typeof values = {};
    const initOk: typeof ok = {};
    DATA.forEach((item) => {
      initVals[item.id] = {
        circleRadius: "",
        perimeterRadius: "",
        perimeterResult: "",
        areaRadius1: "",
        areaRadius2: "",
        areaResult: "",
      };
      initOk[item.id] = {
        circleRadius: null,
        perimeterRadius: null,
        perimeterResult: null,
        areaRadius1: null,
        areaRadius2: null,
        areaResult: null,
      };
    });
    setValues(initVals);
    setOk(initOk);
    setStatus("idle");
    setShowHint(false);
  }, [data]);

  /* -------- Handlers -------- */
  const handleCheck = useCallback(() => {
    const newOk: typeof ok = {};
    DATA.forEach((item) => {
      const v = values[item.id] ?? {};
      newOk[item.id] = {
        circleRadius: v.circleRadius === String(item.radius),
        perimeterRadius: v.perimeterRadius === String(item.radius),
        perimeterResult: v.perimeterResult === String(item.perimeter),
        areaRadius1: v.areaRadius1 === String(item.radius),
        areaRadius2: v.areaRadius2 === String(item.radius),
        areaResult: v.areaResult === String(item.area),
      };
    });
    setOk(newOk);

    const allCorrect = Object.values(newOk).every((row) =>
      Object.values(row).every((val) => val === true)
    );
    setStatus(allCorrect ? "match" : "wrong");
  }, [DATA, values]);

  const handleShowSolution = useCallback(() => {
    const solVals: typeof values = {};
    const solOk: typeof ok = {};
    DATA.forEach((item) => {
      solVals[item.id] = {
        circleRadius: String(item.radius),
        perimeterRadius: String(item.radius),
        perimeterResult: String(item.perimeter),
        areaRadius1: String(item.radius),
        areaRadius2: String(item.radius),
        areaResult: String(item.area),
      };
      solOk[item.id] = {
        circleRadius: true,
        perimeterRadius: true,
        perimeterResult: true,
        areaRadius1: true,
        areaRadius2: true,
        areaResult: true,
      };
    });
    setValues(solVals);
    setOk(solOk);
    setStatus("match");
  }, [DATA]);

  const handleShowHint = useCallback(() => {
    setShowHint((prev) => !prev);
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
  }, [
    setControls,
    handleCheck,
    handleShowSolution,
    handleShowHint,
    help,
    showHint,
    summary,
  ]);

  /* -------- Render -------- */
  return (
    <div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Question 1</h2>
        <p>
          Calculate the perimeter and the area. You may use a calculator. First,
          enter the length of the radius.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-4">
        {DATA.map((item) => {
          const v = values[item.id] ?? {};
          const check = ok[item.id] ?? {};

          return (
            <div key={item.id} className="space-y-3">
              {/* Circle with radius input */}
              <CircleWithInput
                value={item.major.toString() + item.unit}
                inputValue={v.circleRadius ?? ""}
                onChange={(val) =>
                  setValues((prev) => ({
                    ...prev,
                    [item.id]: { ...prev[item.id], circleRadius: val },
                  }))
                }
                unit={item.unit}
                color={item.borderColor}
              />

              {/* Perimeter */}
              <p>
                The Perimeter is 2 × 3.14 ×{" "}
                <input
                  type="text"
                  value={v.perimeterRadius ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [item.id]: {
                        ...prev[item.id],
                        perimeterRadius: e.target.value,
                      },
                    }))
                  }
                  className={`w-12 text-center border-b-2 border-dotted focus:outline-none ${borderClass(
                    check.perimeterRadius
                  )}`}
                />{" "}
                {item.unit} ={" "}
                <input
                  type="text"
                  value={v.perimeterResult ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [item.id]: {
                        ...prev[item.id],
                        perimeterResult: e.target.value,
                      },
                    }))
                  }
                  className={`w-16 text-center border-b-2 border-dotted focus:outline-none ${borderClass(
                    check.perimeterResult
                  )}`}
                />{" "}
                {item.unit}
              </p>

              {/* Area */}
              <p>
                The Area is 3.14 ×{" "}
                <input
                  type="text"
                  value={v.areaRadius1 ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [item.id]: {
                        ...prev[item.id],
                        areaRadius1: e.target.value,
                      },
                    }))
                  }
                  className={`w-12 text-center border-b-2 border-dotted focus:outline-none ${borderClass(
                    check.areaRadius1
                  )}`}
                />{" "}
                {item.unit} ×{" "}
                <input
                  type="text"
                  value={v.areaRadius2 ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [item.id]: {
                        ...prev[item.id],
                        areaRadius2: e.target.value,
                      },
                    }))
                  }
                  className={`w-12 text-center border-b-2 border-dotted focus:outline-none ${borderClass(
                    check.areaRadius2
                  )}`}
                />{" "}
                {item.unit}
                <br />
                <input
                  type="text"
                  value={v.areaResult ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [item.id]: {
                        ...prev[item.id],
                        areaResult: e.target.value,
                      },
                    }))
                  }
                  className={`w-16 text-center border-b-2 border-dotted focus:outline-none ${borderClass(
                    check.areaResult
                  )}`}
                />{" "}
                {item.unit}
                <sup>2</sup>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArrType_119;

/* ---------------- CircleWithInput ---------------- */
type CircleProps = {
  value: string;
  inputValue: string;
  onChange: (val: string) => void;
  unit?: string;
  color?: string;
};

const CircleWithInput: React.FC<CircleProps> = ({
  value,
  inputValue,
  onChange,
  unit = "cm",
  color = "border-green-400",
}) => {
  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <div
        className={`w-40 h-40 rounded-full border-2 ${color} flex items-center justify-center`}
      >
        <div className="absolute top-1/2 left-0 right-0 border-t-2 border-gray-400"></div>
        <div className="absolute w-1/2 border-t-2 border-gray-400 rotate-45 left-17 top-27"></div>
        <span className="absolute top-[35%] left-[35%] text-red-400 font-medium">
          {value}
        </span>
        <div className="absolute bottom-[25%] left-[10%] flex items-center gap-1">
          <input
            type="text"
            value={inputValue ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-14 text-center border-b-2 border-dotted focus:outline-none text-sm"
          />
          <span className="text-sm">{unit}</span>
        </div>
      </div>
    </div>
  );
};
