import { useQuestionControls } from "@/context/QuestionControlsContext";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ---------------- Types ---------------- */
type Item = {
  id: string;
  net: string;          // image for the unfolded net (right side)
  shape: string;        // image for the 3D box (left side)
  correctShape: number; // index (0..N-1) for the shape that matches this net
};

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
const DEFAULT_ITEMS: Item[] = [
  {
    id: "i1",
    shape: "/images/arrtype93shape1.png",
    net: "/images/arrtype93shape4.png",
    correctShape: 1,
  },
  {
    id: "i2",
    shape: "/images/arrtype93shape2.png",
    net: "/images/arrtype93shape5.png",
    correctShape: 0,
  },
  {
    id: "i3",
    shape: "/images/arrtype93shape3.png",
    net: "/images/arrtype93shape6.png",
    correctShape: 2,
  },
];

const DEFAULT_HINT =
  "Click a top dot, then drag to the dot under the matching net. Repeat for each pair.";

/* ---------------- Utils ---------------- */
function centerInSvg(el: Element, svgEl: SVGSVGElement) {
  const r = el.getBoundingClientRect();
  const s = svgEl.getBoundingClientRect();
  return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
}

/* ---------------- Component ---------------- */
const ArrType_93: React.FC<Props> = ({ data, hint }) => {
  const ITEMS = DEFAULT_ITEMS;
  const help = hint ?? DEFAULT_HINT;

  // Refs to each dot
  const leftDotRefs = useRef<HTMLDivElement[]>([]);
  const rightDotRefs = useRef<HTMLDivElement[]>([]);
  leftDotRefs.current = [];
  rightDotRefs.current = [];

  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // dot centers in SVG coordinates
  const [leftPts, setLeftPts] = useState<{ x: number; y: number }[]>([]);
  const [rightPts, setRightPts] = useState<{ x: number; y: number }[]>([]);

  // connections + dragging
  const [connections, setConnections] = useState<{ from: number; to: number }[]>(
    []
  );
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [temp, setTemp] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  const [status, setStatus] = useState<Status>("idle");

  // local hint visibility flag (the controller will read/show it)
  const [showHint, setShowHint] = useState(false);

  // measure points in SVG coordinates
  const measurePoints = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const L = leftDotRefs.current.filter(Boolean).map((el) => centerInSvg(el, svg));
    const R = rightDotRefs.current.filter(Boolean).map((el) => centerInSvg(el, svg));

    setLeftPts(L);
    setRightPts(R);
  }, []);

  useLayoutEffect(() => {
    measurePoints();
  }, [measurePoints, ITEMS.length]);

  useEffect(() => {
    if (!wrapRef.current) return;

    const ro = new ResizeObserver(() => measurePoints());
    ro.observe(wrapRef.current);

    const onScroll = () => measurePoints();
    window.addEventListener("scroll", onScroll, true);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [measurePoints]);

  const onMouseMove = (e: React.MouseEvent) => {
    if (dragFrom === null || !svgRef.current) return;
    const s = svgRef.current.getBoundingClientRect();
    setTemp({
      x1: leftPts[dragFrom]?.x ?? 0,
      y1: leftPts[dragFrom]?.y ?? 0,
      x2: e.clientX - s.left,
      y2: e.clientY - s.top,
    });
  };

  const startDrag = (idx: number) => setDragFrom(idx);

  const endDragTo = (idx: number) => {
    if (dragFrom === null) return;
    setConnections((prev) => [
      ...prev.filter((c) => c.from !== dragFrom),
      { from: dragFrom, to: idx },
    ]);
    setDragFrom(null);
    setTemp(null);
  };

  /* -------- Controls -------- */
  const handleCheck = useCallback(() => {
    const ok =
      connections.length === ITEMS.length &&
      connections.every((c) => c.to === ITEMS[c.from].correctShape);
    setStatus(ok ? "match" : "wrong");
  }, [connections, ITEMS]);

  const handleShowSolution = useCallback(() => {
    setConnections(ITEMS.map((it, i) => ({ from: i, to: it.correctShape })));
    setStatus("match");
  }, [ITEMS]);

  // Toggle only; the QuestionControls UI will show/hide the hint text
  const handleShowHint = useCallback(() => {
    setShowHint((p) => !p);
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
      hint: help,      // the text shown by your controller
      showHint,        // tell controller whether to show it
      summary,
    });
  }, [setControls, handleCheck, handleShowSolution, handleShowHint, help, showHint, summary]);

  /* -------- Render -------- */
  return (
    <div className="space-y-6" ref={wrapRef} onMouseMove={onMouseMove}>
      <h2 className="text-lg font-semibold">Question 2</h2>
      <p className="text-sm text-slate-600">Which box corresponds to the result?</p>

      <div className="relative w-full">
        <div className="flex flex-col items-center justify-between gap-24">
          {/* SHAPES row (left side) */}
          <div className="flex items-center gap-16">
            {ITEMS.map((it, idx) => (
              <div key={`shape-${it.id}`} className="flex flex-col items-center">
                <img src={it.shape} alt="shape" className="w-28 select-none" />
                <div
                  ref={(el) => el && (leftDotRefs.current[idx] = el)}
                  className="w-3 h-3 rounded-full bg-black mt-3 cursor-crosshair"
                  onMouseDown={() => startDrag(idx)}
                />
              </div>
            ))}
          </div>

          {/* NETS row (right side) */}
          <div className="flex items-center gap-16">
            {ITEMS.map((it, idx) => (
              <div key={`net-${it.id}`} className="flex flex-col items-center">
                <div
                  ref={(el) => el && (rightDotRefs.current[idx] = el)}
                  className="w-3 h-3 rounded-full bg-black mb-3 cursor-crosshair"
                  onMouseUp={() => endDragTo(idx)}
                />
                <img src={it.net} alt="net" className="w-24 select-none" />
              </div>
            ))}
          </div>
        </div>

        {/* SVG overlay for lines */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {connections.map((c, i) =>
            leftPts[c.from] && rightPts[c.to] ? (
              <line
                key={`conn-${i}`}
                x1={leftPts[c.from].x}
                y1={leftPts[c.from].y}
                x2={rightPts[c.to].x}
                y2={rightPts[c.to].y}
                stroke={status === "match" ? "green" : "black"}
                strokeWidth="3"
                strokeLinecap="round"
              />
            ) : null
          )}
          {temp && (
            <line
              x1={temp.x1}
              y1={temp.y1}
              x2={temp.x2}
              y2={temp.y2}
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

export default ArrType_93;
