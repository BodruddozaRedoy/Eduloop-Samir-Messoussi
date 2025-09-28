import { Button } from '@/components/ui/button';
import useCategories from '@/hooks/useCategories';
import React, { useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Checkbox } from "@/components/ui/checkbox";
import LoadingScreen from '@/components/common/LoadingScreen';

const CategoryPage: React.FC = () => {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [selectedSubs, setSelectedSubs] = useState<number[]>([]);
    const [searchParams] = useSearchParams();
    const subjectId = searchParams.get("subjectId");
    const navigate = useNavigate()

    const { categories } = useCategories(subjectId);
    console.log("categories",categories)

    console.log("selectedCategories", selectedCategories)
    console.log("activeCategory", activeCategory)
    console.log("selectedSubs", selectedSubs)

    // ✅ Toggle category selection
    const handleCategoryToggle = (id: number) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter(c => c !== id));
        } else {
            setSelectedCategories([...selectedCategories, id]);
            setActiveCategory(null); // disable subcategory mode
            setSelectedSubs([]);     // clear subs if main category is picked
        }
    };

    // ✅ Toggle subcategory selection mode (exclusive)
    const handleSubCategoryMode = (categoryId: number) => {
        if (activeCategory === categoryId) {
            // close subcategories
            setActiveCategory(null);
            setSelectedSubs([]);
        } else {
            // switch category, reset subs
            setActiveCategory(categoryId);
            setSelectedSubs([]);
            setSelectedCategories([]); // disable main category selection
        }
    };

    // ✅ Toggle individual subcategories
    const handleSubToggle = (subId: number) => {
        if (selectedSubs.includes(subId)) {
            setSelectedSubs(selectedSubs.filter(s => s !== subId));
        } else {
            setSelectedSubs([...selectedSubs, subId]);
        }
    };

    if(categories?.length < 0) return <LoadingScreen/>



    return (
        <div className=''>
            <Link to="/group" className="inline-block rounded-2xl">
                <Button className="rounded-2xl py-7 pl-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed">
                    <div className="size-10 bg-white text-black rounded-2xl flex items-center justify-center">
                        <IoMdArrowRoundBack size={50} className="text-5xl" />
                    </div>
                    Back Group
                </Button>
            </Link>

            <p className="lg:text-5xl text-2xl font-semibold mt-4 mb-8 text-[#0F172A]">
                Pick a category
            </p>

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
                                    disabled={selectedCategories.length > 0}
                                    onClick={() => handleSubCategoryMode(category.id)}
                                    size="sm"
                                    variant="outline"
                                    className="disabled:bg-muted text-xs !py-0.5 px-2"
                                >
                                    {activeCategory === category.id ? "Close Subcategories" : "Select Subcategories"}
                                </Button>

                                {/* Category button */}
                                <Button
                                    disabled={activeCategory !== null}
                                    onClick={() => handleCategoryToggle(category.id)}
                                    size="sm"
                                    variant="outline"
                                    className="disabled:bg-muted text-xs !py-0.5 px-2"
                                >
                                    {selectedCategories.includes(category.id) ? "Deselect" : "Select"}
                                </Button>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">Tap to start a new, non-repeating practice set.</p>

                        {/* Subcategories list */}
                        {activeCategory === category.id && (
                            <div className="grid grid-cols-2 mt-2">
                                {category.subcategories?.map((sub: any) => (
                                    <label key={sub.id} className="flex items-center gap-2">
                                        <Checkbox
                                            checked={selectedSubs.includes(sub.id)}
                                            onCheckedChange={() => handleSubToggle(sub.id)}
                                        />
                                        <p className="font-semibold text-sm">{sub.name}</p>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </main>

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

                <button disabled={!((selectedCategories.length > 0) || activeCategory || (selectedSubs.length > 0))} onClick={() => navigate(`/group/subject/category/arithmetic?subjectId=${categories?.[0].subject}&groupId=${categories?.[0].group}`)} className="mt-5 w-full bg-slate-800 text-white font-bold text-lg py-2 rounded-xl shadow-lg hover:bg-slate-700 transition-colors disabled:bg-slate-800/50 disabled:cursor-not-allowed">
                    Start Now
                </button>
            </div>
        </div>
    );
};

export default CategoryPage;
