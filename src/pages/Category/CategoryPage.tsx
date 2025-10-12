import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import LoadingScreen from '@/components/common/LoadingScreen';
import useCategories from '@/hooks/useCategories';
import React, { useState, useEffect } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useLocation, useNavigate } from 'react-router';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useQuery } from '@tanstack/react-query';
import { AxiosPublic } from '@/config/axios';
import { toast } from 'sonner';

const CategoryPage: React.FC = () => {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [selectedSubs, setSelectedSubs] = useState<number[]>([]);
    const [level, setLevel] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [startQuiz, setStartQuiz] = useState(false);

    const subjectId = localStorage.getItem("subjectId");
    const groupId = localStorage.getItem("groupId");
    const navigate = useNavigate();
    const location = useLocation();

    const { categories } = useCategories(subjectId);

    // ✅ Reset quiz state whenever user comes back to this page
    useEffect(() => {
        setStartQuiz(false);
    }, [location.pathname]);

    // ✅ Keep selections synced in localStorage
    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(selectedCategories));
    }, [selectedCategories]);

    useEffect(() => {
        localStorage.setItem("subcategories", JSON.stringify(selectedSubs));
    }, [selectedSubs]);

    // ✅ Fetch questions dynamically
    const { data: question, isLoading } = useQuery({
        queryKey: ['question', { level, selectedCategories, selectedSubs }],
        queryFn: async () => {
            const payload = {
                group_id: categories?.[0]?.group,
                subject_id: Number(subjectId),
                category_ids: selectedCategories,
                subcategory_ids: selectedSubs,
                levels: level ? [level] : [],
            };

            const res = await AxiosPublic.post("/questions/", payload);
            console.log("Request Payload:", payload);
            console.log("Response:", res.data?.question);
            console.log("Session Id:", res.data?.session_id);
            localStorage.setItem("sessionId", res.data?.session_id);
            return res.data?.question;
        },
        enabled: startQuiz, // ✅ only runs when quiz starts
    });

    // ✅ Toggle category selection
    const handleCategoryToggle = (id: number, subcategories: any[] = []) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter(c => c !== id));
            setSelectedSubs(selectedSubs.filter(s => !subcategories.some((sub: any) => sub.id === s)));
            if (activeCategory === id) setActiveCategory(null);
        } else {
            setSelectedCategories([...selectedCategories, id]);
            setActiveCategory(null);
            setSelectedSubs([]);
        }
    };

    // ✅ Toggle subcategory visibility
    const handleSubCategoryMode = (categoryId: number) => {
        if (activeCategory === categoryId) {
            setActiveCategory(null);
        } else {
            setActiveCategory(categoryId);
            setSelectedSubs([]);
            setSelectedCategories([categoryId]);
        }
    };

    // ✅ Handle individual subcategory toggle
    const handleSubToggle = (subId: number, parentCategoryId: number, allSubs: any[]) => {
        let updatedSubs: number[];

        if (selectedSubs.includes(subId)) {
            updatedSubs = selectedSubs.filter(s => s !== subId);
        } else {
            updatedSubs = [...selectedSubs, subId];
        }

        setSelectedSubs(updatedSubs);

        // ✅ Parent logic
        if (updatedSubs.some(sub => allSubs.map((s: any) => s.id).includes(sub))) {
            if (!selectedCategories.includes(parentCategoryId)) {
                setSelectedCategories([...selectedCategories, parentCategoryId]);
            }
        } else {
            setSelectedCategories(selectedCategories.filter(c => c !== parentCategoryId));
        }
    };

    // ✅ Trigger quiz start
    const handleStartQuiz = () => {
        setShowDialog(false);
        setStartQuiz(true);
    };

    // ✅ Handle navigation after fetching questions
    useEffect(() => {
        if (startQuiz && !isLoading && question) {
            const routeState = {
                question,
                level,
                subjectId,
                groupId,
                categories: selectedCategories,
                subcategories: selectedSubs,
            };

            const subject = categories?.[0]?.subject;

            if (subject === "Begrijpend Lezen") {
                navigate(`/reading`, { state: routeState });
            } else if (subject === "Rekenen") {
                navigate(`/arithmetic`, { state: routeState });
            } else if (subject === "Spelling") {
                navigate(`/spelling`, { state: routeState });
            } else if (subject === "Woordenschat") {
                navigate(`/vocabulary`, { state: routeState });
            } else if (subject === "Taal") {
                navigate(`/language`, { state: routeState });
            }

            // ✅ Prevent re-triggering when returning
            setStartQuiz(false);
        }

        if (!isLoading && startQuiz && !question) {
            toast.error("No question found");
            setStartQuiz(false);
        }
    }, [isLoading, question, startQuiz]);

    return (
        <div>
            {/* Back Button */}
            <Link to="/subject" className="inline-block rounded-2xl">
                <Button className="rounded-2xl py-7 pl-2 font-bold text-xl">
                    <div className="size-10 bg-white text-black rounded-2xl flex items-center justify-center">
                        <IoMdArrowRoundBack size={50} className="text-5xl" />
                    </div>
                    Back Subject
                </Button>
            </Link>

            <p className="lg:text-5xl text-2xl font-semibold mt-4 mb-8 text-[#0F172A]">
                Pick a category
            </p>

            {/* Category Grid */}
            <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-[330px] overflow-y-auto">
                {categories?.map((category: any) => (
                    <div
                        key={category.id}
                        className={`flex flex-col p-6 rounded-2xl gap-3 border-2 transition-all duration-200 ${selectedCategories.includes(category.id) || activeCategory === category.id
                                ? 'border-primary'
                                : ''
                            }`}
                    >
                        <div className="flex items-center gap-3 justify-between">
                            <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => handleSubCategoryMode(category.id)}
                                    size="sm"
                                    variant="outline"
                                    className="text-xs !py-0.5 px-2"
                                >
                                    {activeCategory === category.id ? "Close Subcategories" : "Select Subcategories"}
                                </Button>

                                <Button
                                    onClick={() => handleCategoryToggle(category.id, category.subcategories)}
                                    size="sm"
                                    variant="outline"
                                    className="text-xs !py-0.5 px-2"
                                >
                                    {selectedCategories.includes(category.id) ? "Deselect" : "Select"}
                                </Button>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm">Tap to start a new, non-repeating practice set.</p>

                        {activeCategory === category.id && (
                            <div className="grid grid-cols-2 mt-2">
                                {category.subcategories?.map((sub: any) => (
                                    <label key={sub.id} className="flex items-center gap-2">
                                        <Checkbox
                                            checked={selectedSubs.includes(sub.id)}
                                            onCheckedChange={() =>
                                                handleSubToggle(sub.id, category.id, category.subcategories)
                                            }
                                        />
                                        <p className="font-semibold text-sm">{sub.name}</p>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </main>

            {/* All in subject */}
            <div className="mt-5 bg-white p-6 rounded-2xl shadow-lg w-full">
                <label className="flex items-start gap-4 cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-5 h-5 mt-1 rounded border-gray-400 text-orange-600 focus:ring-orange-500 flex-shrink-0"
                        checked={selectedCategories.length === categories?.length}
                        onChange={(e) =>
                            setSelectedCategories(e.target.checked ? categories.map((c: any) => c.id) : [])
                        }
                    />
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">All in this Subject</h3>
                        <p className="text-gray-500 text-sm mt-1">Mix all categories for varied practice.</p>
                    </div>
                </label>

                {/* Start Button */}
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogTrigger asChild>
                        <button
                            disabled={!((selectedCategories.length > 0) || activeCategory || (selectedSubs.length > 0))}
                            className="mt-5 w-full bg-slate-800 text-white font-bold text-lg py-2 rounded-xl shadow-lg hover:bg-slate-700 transition-colors disabled:bg-slate-800/50 disabled:cursor-not-allowed"
                        >
                            Start Now
                        </button>
                    </DialogTrigger>
                    {/* Select Difficulty Level */}
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Select Difficulty Level</DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-3 mt-4">
                            {["easy", "medium", "advance", "none"].map((l) => {
                                const isActive =
                                    (l === "none" && level === null) || level === l;

                                return (
                                    <Button
                                        key={l}
                                        variant={isActive ? "default" : "outline"}
                                        onClick={() => setLevel(l === "none" ? null : l)}
                                    >
                                        {l === "none"
                                            ? "All Level"
                                            : l.charAt(0).toUpperCase() + l.slice(1)}
                                    </Button>
                                );
                            })}
                        </div>

                        <DialogFooter>
                            <Button onClick={handleStartQuiz}>Start Quiz</Button>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>
            </div>
        </div>
    );
};

export default CategoryPage;
