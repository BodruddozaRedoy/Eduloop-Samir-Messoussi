import React, { useState } from "react";
import Controllers from "@/components/common/Controllers";
import Hint from "@/components/common/Hint";
import Check from "@/components/common/Check";


export default function ArrTypeEight({data,hint}:any) {
  const [showHint, setShowHint] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<"match" | "wrong" | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [validation, setValidation] = useState<{ [key: string]: boolean | null }>({});

  const handleShowHint = () => setShowHint((v) => !v);

  const handleInputChange = (
    qid: number,
    index: number,
    field: "a" | "b" | "result",
    value: string
  ) => {
    setUserAnswers((prev) => ({
      ...prev,
      [`${qid}-${index}-${field}`]: value,
    }));
  };

  const handleCheck = () => {
    let allCorrect = true;
    let newValidation: { [key: string]: boolean } = {};

    data.forEach((d:any) => {
      d.answers.forEach((a:any, i:any) => {
        const ua = parseInt(userAnswers[`${d.id}-${i}-a`] ?? "", 10);
        const ub = parseInt(userAnswers[`${d.id}-${i}-b`] ?? "", 10);
        const ur = parseInt(userAnswers[`${d.id}-${i}-result`] ?? "", 10);

        let correct = true;

        if (isNaN(ua) || isNaN(ub) || isNaN(ur)) {
          correct = false;
        } else if (a.op === "+") {
          if (ua + ub !== a.result) correct = false;
        } else if (a.op === "-") {
          if (ua - ub !== a.result) correct = false;
        }

        if (!correct) allCorrect = false;
        newValidation[`${d.id}-${i}`] = correct;
      });
    });

    setValidation(newValidation);
    setStatus(allCorrect ? "match" : "wrong");
    setShowSolution(false);
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    setStatus(null);
    setValidation({});
  };

  const summary =
    status === "match"
      ? {
        text: "🎉 All Correct! Great job",
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
      }
      : status === "wrong"
        ? {
          text: "❌ Some answers are wrong. Check again.",
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-600",
        }
        : null;

  return (
    <div>
      <div className="flex items-start justify-center gap-20">
        {data?.map((d:any, i:any) => (
          <div key={d.id}>
            {/* numbers box */}
            <div>
              <div className="flex relative items-center gap-5">
                <div className="absolute left-10 top-14">
                  <div className="relative">
                    <div className="w-5 absolute top-0 left-0 h-0.5 rotate-45 bg-primary"></div>
                    <div className="w-5 h-0.5 absolute bottom-3 left-0 -rotate-45 bg-primary"></div>
                  </div>
                </div>
                <input
                  type="text"
                  value={d.numbers[0]}
                  className="size-10 border-2 !border-primary text-2xl font-semibold text-center"
                  readOnly
                />
                <div className="flex flex-col gap-5">
                  <input
                    type="text"
                    value={d.numbers[1]}
                    className="size-10 border-2 !border-primary text-2xl font-semibold text-center"
                    readOnly
                  />
                  <input
                    type="text"
                    value={d.numbers[2]}
                    className="size-10 border-2 !border-primary text-2xl font-semibold text-center"
                    readOnly
                  />
                </div>
              </div>
            </div>
            {/* answers inputs */}
            <div>
              {d.answers?.map((a:any, idx:any) => {
                const isCorrect = validation[`${d.id}-${idx}`];
                const inputClass =
                  isCorrect === true
                    ? "border-green-600 text-green-600"
                    : isCorrect === false
                      ? "border-red-600 text-red-600"
                      : "border-primary";

                return (
                  <div key={idx} className="mt-5 flex items-center gap-1">
                    <input
                      type="text"
                      className={`border-b w-10 focus:outline-none border-dashed text-center font-semibold ${inputClass}`}
                      onChange={(e) =>
                        handleInputChange(d.id, idx, "a", e.target.value)
                      }
                      value={
                        showSolution ? a.a : userAnswers[`${d.id}-${idx}-a`] ?? ""
                      }
                    />
                    <p className="font-bold">{a.op}</p>
                    <input
                      type="text"
                      className={`border-b w-10 focus:outline-none border-dashed text-center font-semibold ${inputClass}`}
                      onChange={(e) =>
                        handleInputChange(d.id, idx, "b", e.target.value)
                      }
                      value={
                        showSolution ? a.b : userAnswers[`${d.id}-${idx}-b`] ?? ""
                      }
                    />
                    <p className="font-bold">=</p>
                    <input
                      type="text"
                      className={`border-b w-10 focus:outline-none border-dashed text-center font-semibold ${inputClass}`}
                      onChange={(e) =>
                        handleInputChange(d.id, idx, "result", e.target.value)
                      }
                      value={
                        showSolution
                          ? a.result
                          : userAnswers[`${d.id}-${idx}-result`] ?? ""
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {/* controllers */}
      <div>
        <Controllers
          handleCheck={handleCheck}
          handleShowSolution={handleShowSolution}
          handleShowHint={handleShowHint}
        />
        {showHint && <Hint hint={hint} />}
        <Check summary={summary} />
      </div>
    </div>
  );
}
