import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { IoIosArrowForward, IoMdArrowRoundBack, IoMdArrowRoundForward, IoMdCheckmarkCircleOutline } from "react-icons/io"
import { BadgeCheck, ChevronLeft } from "lucide-react"
import QuestionRenderer from "./components/QuestionRenderer"
import { QUESTIONS_DATA } from "./components/Questions"
import { Link } from "react-router"
import { hasAnyResults, onResultsUpdated, type TrackedResults } from "@/hooks/useResultTracker"
import Controllers from "@/components/common/Controllers"
import Hint from "@/components/common/Hint"
import Check from "@/components/common/Check"
import { QuestionControlsProvider, useQuestionControls } from "@/context/QuestionControlsContext"
// import { QUESTIONS_DATA } from "./Questions

export default function ArithmeticPage() {

    const [question, setQuestion] = useState(JSON.parse(localStorage.getItem("question")) ? JSON.parse(localStorage.getItem("question")) : 0)
    const q = QUESTIONS_DATA[question]
    const [trigger, setTrigger] = useState(true)
    const [hasResults, setHasResults] = useState<boolean>(hasAnyResults())

    console.log(question)

    useEffect(() => {
        localStorage.setItem("question", JSON.stringify(question))
        const savedData = JSON.parse(localStorage.getItem("question"))
        console.log(savedData)
        if (savedData) {
            setQuestion(savedData)
        }
    }, [trigger])

    // listen for result updates to enable/disable Result button
    useEffect(() => {
        const off = onResultsUpdated((_r: TrackedResults) => {
            setHasResults(hasAnyResults())
        })
        return () => off()
    }, [])


    const isFirst = question === 0
    const isLast = question === QUESTIONS_DATA.length - 1

    const handlePrev = () => {
        setQuestion((prev) => Math.max(prev - 1, 0))
        setTrigger(!trigger)
    }
    const handleNext = () => {
        setQuestion((prev) => Math.min(prev + 1, QUESTIONS_DATA.length - 1))
        setTrigger(!trigger)
    }

    // Difficulty pills highlight
    const level = q?.level ?? "Easy"
    const pillBase = "py-2 px-5 rounded-lg font-semibold"
    const active = "bg-primary text-white"
    const inactive = "bg-transparent text-black"

    return (
        <QuestionControlsProvider>
            <>
                {/* Top bar */}
                <div className="flex items-center justify-between mb-5 relative">
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handlePrev}
                            disabled={isFirst}
                            className="rounded-2xl py-7 pl-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <div className="size-10 bg-white text-black rounded-2xl flex items-center justify-center">
                                <IoMdArrowRoundBack size={50} className="text-5xl" />
                            </div>
                            Back
                        </Button>

                        {/* Breadcrumbs from data */}
                        <div className="text-primary flex gap-3 items-center">
                            <p>Group {q.group}</p>
                            <IoIosArrowForward />
                            <p>{q.subject}</p>
                            <IoIosArrowForward />
                            <p>{q.category}</p>
                        </div>
                    </div>

                    {/* temporary search bar  */}
                    {/* Search bar to jump to question */}
                    <div className="space-x-4">
                        <Button onClick={() => { setQuestion(0); setTrigger(!trigger) }}>Go to start</Button>
                        <input
                            type="number"
                            placeholder="Go to question"
                            className="py-2 px-3 mr-2 border bg-white rounded-lg border-primary"
                            onChange={(e) => {
                                const value = Number(e.target.value) - 1; // convert to 0-based index
                                if (!isNaN(value) && value >= 0 && value < QUESTIONS_DATA.length) {
                                    setQuestion(value);
                                }
                            }}
                        />
                        <Button onClick={() => { setQuestion(QUESTIONS_DATA.length - 1); setTrigger(!trigger) }}>Go to Last</Button>
                    </div>


                    {/* Difficulty pills */}
                    <div className="bg-[#e8edff] p-1 rounded-lg flex items-center">
                        <div className={`${pillBase} ${level === "Easy" ? active : inactive}`}>Easy</div>
                        <div className={`${pillBase} ${level === "Medium" ? active : inactive}`}>Medium</div>
                        <div className={`${pillBase} ${level === "Advance" ? active : inactive}`}>Advance</div>
                    </div>
                </div>

                {/* Body */}
                <div key={q.id} className="p-5 rounded-[30px] w-full h-[430px] overflow-y-auto border flex flex-col bg-white">
                    {/* Question text */}
                    <div className="mb-4 text-lg font-semibold">
                        <h1 className="font-bold">Question: {question + 1}___ id:{q.id}/{q.type}</h1>
                        <p>{q.metadata.question}</p>
                    </div>

                    {/* Render question dynamically */}
                    <QuestionRenderer q={q} />
                </div>
                {/* Global Controllers/Hints/Check from question components */}
                {/* Footer actions */}
                <div className="flex items-center justify-between mt-1 ">
                    <ArithmeticControllersSlot />


                    <div className="flex items-center gap-5 mt-5">
                        <div>
                            <Button className=" py-6 bg-[#e8edff] hover:bg-[#e8edff]/70 text-black border">
                                <ChevronLeft className="mr-2" /> Switch Category
                            </Button>
                        </div>
                        <Button
                            onClick={handleNext}
                            disabled={isLast}
                            className="rounded-2xl py-7 pr-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Next
                            <div className="size-10 bg-black rounded-2xl flex items-center justify-center ml-2">
                                <IoMdArrowRoundForward size={50} className="text-5xl" />
                            </div>
                        </Button>
                        <Link to={"/result"} onClick={(e) => { if (!hasResults) e.preventDefault(); }}>
                            <Button
                                disabled={!hasResults}
                                className="rounded-2xl py-7 pr-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Result
                                <div className="size-10 bg-white rounded-2xl flex items-center justify-center ml-2">
                                    <IoMdCheckmarkCircleOutline size={60} className="text-green-500" />
                                </div>
                            </Button>
                        </Link>
                    </div>
                </div>

            </>
        </QuestionControlsProvider>
    )
}

function ArithmeticControllersSlot() {
    const { controls } = useQuestionControls()
    const noop = () => { }
    const hasAny = controls.handleCheck || controls.handleShowHint || controls.handleShowSolution || controls.summary
    if (!hasAny) return null
    return (
        <div className="flex items-center gap-10">
            <Controllers
                handleCheck={controls.handleCheck || noop}
                handleShowSolution={controls.handleShowSolution || noop}
                handleShowHint={controls.handleShowHint || noop}
            />
            {controls.showHint && controls.hint && <Hint hint={controls.hint} />}
            <Check summary={controls.summary || null} />
        </div>
    )
}
