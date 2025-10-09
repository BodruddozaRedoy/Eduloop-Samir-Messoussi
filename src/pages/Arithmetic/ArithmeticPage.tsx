import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { IoIosArrowForward, IoMdArrowRoundBack, IoMdArrowRoundForward, IoMdCheckmarkCircleOutline } from "react-icons/io"
import { BadgeCheck, ChevronLeft } from "lucide-react"
import QuestionRenderer from "./components/QuestionRenderer"
import { QUESTIONS_DATA } from "./components/Questions"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router"
import { hasAnyResults, onResultsUpdated, type TrackedResults } from "@/hooks/useResultTracker"
import Controllers from "@/components/common/Controllers"
import Hint from "@/components/common/Hint"
import Check from "@/components/common/Check"
import { QuestionControlsProvider, useQuestionControls } from "@/context/QuestionControlsContext"
import { AxiosPublic } from "@/config/axios"
import { toast } from "sonner"
import LoadingScreen from "@/components/common/LoadingScreen"
// import { QUESTIONS_DATA } from "./Questions

export default function ArithmeticPage() {

    const location = useLocation();
    const initialQuestion = location.state?.question;

    const [question, setQuestion] = useState<any | null>(initialQuestion || null);
    const [serial, setSerial] = useState(1);
    const q = QUESTIONS_DATA[serial]
    const [loading, setLoading] = useState(false);
    const [trigger, setTrigger] = useState(true)
    const [hasResults, setHasResults] = useState<boolean>(hasAnyResults())
    const [showReloadWarning, setShowReloadWarning] = useState(false);
    const navigate = useNavigate()

    console.log(question)

    // useEffect(() => {
    //     localStorage.setItem("question", JSON.stringify(question))
    //     const savedData = JSON.parse(localStorage.getItem("question"))
    //     console.log(savedData)
    //     if (savedData) {
    //         setQuestion(savedData)
    //     }
    // }, [trigger])

    const subjectId = localStorage.getItem("subjectId");
    const groupId = localStorage.getItem("groupId");
    const sessionId = localStorage.getItem("sessionId");

    const fetchQuestion = async () => {
        try {
            setLoading(true);
            const res = await AxiosPublic.get("/questions/", {
                headers: { "X-Session-Id": sessionId },
                params: {
                    group_id: groupId,
                    subject_id: subjectId,
                    category_ids: JSON.parse(localStorage.getItem("categories") || "[]"),
                    subcategory_ids: JSON.parse(localStorage.getItem("subcategories") || "[]"),
                },
            });
            setQuestion(res.data);
        } catch (err) {
            console.error("Failed to load question", err);
            toast.error("Failed to load question. Redirecting to category page...");
            navigate("/category");
        } finally {
            setLoading(false);
        }
    };

    // listen for result updates to enable/disable Result button
    useEffect(() => {
        const off = onResultsUpdated((_r: TrackedResults) => {
            setHasResults(hasAnyResults())
        })
        return () => off()
    }, [])


    const isFirst = question === 0
    const isLast = question === QUESTIONS_DATA.length - 1

    const handleNext = async () => {
        setSerial((prev) => prev + 1);
        await fetchQuestion();
    };

    const handleBackToCategory = async () => {
        localStorage.removeItem("quizResults")
    }

    if (loading || !question) return <LoadingScreen />;
    if (!loading && !question) return navigate("/category");

    // Difficulty pills highlight
    const level = q?.level ?? "Easy"
    const pillBase = "py-2 px-5 rounded-lg font-semibold"
    const active = "bg-primary text-white"
    const inactive = "bg-transparent text-black"



    return (
        <QuestionControlsProvider>
            <>
                {showReloadWarning && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                        <div className="bg-white p-8 rounded-2xl flex flex-col gap-5 max-w-sm w-full">
                            <h2 className="text-xl font-bold text-gray-800">Go Back to Category?</h2>
                            <p className="text-gray-600">
                                Your current progress will be lost. Do you still want to go back?
                            </p>
                            <div className="flex justify-end gap-4 mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowReloadWarning(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-primary text-white"
                                    onClick={() => {
                                        setShowReloadWarning(false);
                                        navigate("/category");
                                        handleBackToCategory()
                                    }}
                                >
                                    Go to Category
                                </Button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Top bar */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        {/* Back button with confirmation modal */}
                        <Button
                            onClick={() => setShowReloadWarning(true)}
                            className="rounded-2xl py-7 pl-2 font-bold text-xl"
                        >
                            <div className="size-10 bg-white text-black rounded-2xl flex items-center justify-center">
                                <IoMdArrowRoundBack size={50} className="text-5xl" />
                            </div>
                            Back
                        </Button>

                        {/* Breadcrumbs */}
                        <div className="text-primary flex gap-3 items-center">
                            <p>{question.group}</p>
                            <IoIosArrowForward />
                            <p>{question.subject}</p>
                            <IoIosArrowForward />
                            <p>{question.category}</p>
                            <IoIosArrowForward />
                            <p>{question.subcategory}</p>
                        </div>
                    </div>

                    {/* temporary search bar  */}
                    {/* Search bar to jump to question */}
                    <div className="space-x-4">
                        <Button onClick={() => { setSerial(serial -1); setTrigger(!trigger) }}>Back</Button>
                        {/* <input
                            type="number"
                            placeholder="Go to question"
                            className="py-2 px-3 mr-2 border bg-white rounded-lg border-primary"
                            onChange={(e) => {
                                const value = Number(e.target.value) - 1; // convert to 0-based index
                                if (!isNaN(value) && value >= 0 && value < QUESTIONS_DATA.length) {
                                    setQuestion(value);
                                }
                            }}
                        /> */}
                        <Button onClick={() => { setSerial(serial +1); setTrigger(!trigger) }}>Forward</Button>
                    </div>


                    {/* Difficulty pills */}
                    <div className="bg-[#e8edff] p-1 rounded-lg flex items-center">
                        <div className={`${pillBase} ${level === "easy" ? active : inactive}`}>Easy</div>
                        <div className={`${pillBase} ${level === "medium" ? active : inactive}`}>Medium</div>
                        <div className={`${pillBase} ${level === "advance" ? active : inactive}`}>Advance</div>
                    </div>
                </div>

                {/* Body */}
                <div key={q.id} className="p-5 rounded-[30px] w-full h-[430px] overflow-y-auto border flex flex-col bg-white">
                    {/* Question text */}
                    <div className="mb-4 text-lg font-semibold">
                        <h1 className="font-bold">Question: {serial}___ id:{q.id}/{q.type}</h1>
                        <p>{q.metadata.question}</p>
                    </div>

                    {/* Render question dynamically */}
                    <QuestionRenderer q={q} />
                </div>
                {/* Global Controllers/Hints/Check from question components */}
                {/* Footer actions */}
                <div className="flex flex-col lg:flex-row items-center justify-between mt-1 ">
                    <ArithmeticControllersSlot />


                    <div className="flex items-center gap-5 mt-5">
                        <Link to={`/category`}>
                            <Button className=" py-6 bg-[#e8edff] hover:bg-[#e8edff]/70 text-black border">
                                <ChevronLeft className="mr-2" /> Switch Category
                            </Button>
                        </Link>
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
                        <Link to={`/result`} onClick={(e) => { if (!hasResults) e.preventDefault(); }}>
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
        <div className="flex flex-col lg:flex-row items-center gap-10">
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
