import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import LoadingScreen from '@/components/common/LoadingScreen';
import useCategories from '@/hooks/useCategories';
import React, { useState, useEffect } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useNavigate, useSearchParams } from 'react-router';
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

    const [searchParams] = useSearchParams();
    const subjectId = searchParams.get("subjectId");
    const groupId = searchParams.get("groupId");
    const navigate = useNavigate();

    const { categories } = useCategories(subjectId);

    // ✅ Keep categories & subcategories synced in localStorage
    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(selectedCategories));
    }, [selectedCategories]);

    useEffect(() => {
        localStorage.setItem("subcategories", JSON.stringify(selectedSubs));
    }, [selectedSubs]);

    // ✅ API fetch with payload
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
            console.log("Response:", res.data);
            return res.data;
        },
        enabled: startQuiz,
    });

    // ✅ Toggle category selection
    const handleCategoryToggle = (id: number, subcategories: any[] = []) => {
        if (selectedCategories.includes(id)) {
            // Remove category + its subcategories
            setSelectedCategories(selectedCategories.filter(c => c !== id));
            setSelectedSubs(selectedSubs.filter(s => !subcategories.some((sub: any) => sub.id === s)));
            if (activeCategory === id) {
                setActiveCategory(null);
            }
        } else {
            setSelectedCategories([...selectedCategories, id]);
            setActiveCategory(null);
            setSelectedSubs([]); // only clear if you want fresh start
        }
    };

    // ✅ Toggle subcategory mode
    const handleSubCategoryMode = (categoryId: number) => {
        if (activeCategory === categoryId) {
            // Just close without clearing parent
            setActiveCategory(null);
        } else {
            setActiveCategory(categoryId);
            setSelectedSubs([]);
            setSelectedCategories([categoryId]); // ensure category selected
        }
    };

    // ✅ Toggle individual subcategories
    const handleSubToggle = (subId: number, parentCategoryId: number, allSubs: any[]) => {
        let updatedSubs: number[];

        if (selectedSubs.includes(subId)) {
            // remove sub
            updatedSubs = selectedSubs.filter(s => s !== subId);
        } else {
            // add sub
            updatedSubs = [...selectedSubs, subId];
        }

        setSelectedSubs(updatedSubs);

        // ✅ Parent logic
        if (updatedSubs.some(sub => allSubs.map((s: any) => s.id).includes(sub))) {
            if (!selectedCategories.includes(parentCategoryId)) {
                setSelectedCategories([...selectedCategories, parentCategoryId]);
            }
        } else {
            // ✅ If no sub left, parent category is removed
            setSelectedCategories(selectedCategories.filter(c => c !== parentCategoryId));
        }
    };


    // ✅ Handle start quiz
    const handleStartQuiz = () => {
        setShowDialog(false);
        setStartQuiz(true);

        if (isLoading) return <LoadingScreen />;
        if (!question) return toast.error("No question found");
        if (question) {
            console.log("Fetched Questions:", question);
            if (categories?.[0].subject === "Begrijpend Lezen" || categories?.[0].subject === "Taal") {
                navigate(`/reading?level=${level || null}&subjectId=${subjectId}&groupId=${groupId}`);
            } else if (categories?.[0].subject === "Rekenen") {
                navigate(`/arithmetic?level=${level || null}&subjectId=${subjectId}&groupId=${groupId}`);
            } else if (categories?.[0].subject === "Spelling") {
                navigate(`/spelling?level=${level || null}&subjectId=${subjectId}&groupId=${groupId}`);
            } else if (categories?.[0].subject === "Woordenschat") {
                navigate(`/vocabulary?level=${level || null}&subjectId=${subjectId}&groupId=${groupId}`);
            }
        }
    };

    return (
        <div className=''>
            {/* Back Button */}
            <Link to="/group" className="inline-block rounded-2xl">
                <Button className="rounded-2xl py-7 pl-2 font-bold text-xl">
                    <div className="size-10 bg-white text-black rounded-2xl flex items-center justify-center">
                        <IoMdArrowRoundBack size={50} className="text-5xl" />
                    </div>
                    Back Group
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
                                {/* Subcategory button */}
                                <Button
                                    onClick={() => handleSubCategoryMode(category.id)}
                                    size="sm"
                                    variant="outline"
                                    className="text-xs !py-0.5 px-2"
                                >
                                    {activeCategory === category.id ? "Close Subcategories" : "Select Subcategories"}
                                </Button>

                                {/* Category button */}
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

                        {/* Subcategories */}
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
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Select Difficulty Level</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-3 mt-4">
                            {["easy", "medium", "advance", "none"].map(l => (
                                <Button
                                    key={l}
                                    variant={level === l ? "default" : "outline"}
                                    onClick={() => setLevel(l === "none" ? null : l)}
                                >
                                    {l === "none" ? "No Level" : l.charAt(0).toUpperCase() + l.slice(1)}
                                </Button>
                            ))}
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
