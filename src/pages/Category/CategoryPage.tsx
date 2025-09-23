import { Button } from '@/components/ui/button';
import useCategories from '@/hooks/useCategories';
import React, { useState, useMemo } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useLocation, useSearchParams } from 'react-router';

// NOTE: The CategoryCard component and type definitions from your code
// are used here without change. They are assumed to be in the same file.

// Type definitions
type Category = {
    name: string;
    // description: string;
};

type CategoryCardProps = {
    name: string;
    // description: string;
    // isSelected: boolean;
    // onToggle: () => void;
};

// Reusable Category Card
const CategoryCard: React.FC<CategoryCardProps> = ({ name, group, subject, category }:any) => {
    // const borderColor = isSelected ? 'border-orange-500' : 'border-gray-200';
    // const shadow = isSelected ? 'shadow-lg' : 'shadow-sm';
    // const bgColor = isSelected ? 'bg-orange-50' : 'bg-white';

    return (
        <Link to={`/group/subject/category/${subject}?group=${group}&subject=${subject}&category=${category}`}>
            <label
                className={`flex flex-col p-6 rounded-2xl gap-3 cursor-pointer border-2 transition-all duration-200 hover:bg-orange-50 hover:border-orange-300`}
            >
                <div className="flex items-center gap-3">
                    {/* <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggle}
                    className="w-5 h-5 rounded border-gray-400 text-orange-600 focus:ring-orange-500"
                /> */}
                    <h3 className="font-bold text-gray-800 text-lg">{name}</h3>
                </div>
                <p className="text-gray-500 text-sm">Tap to start a new, non-repeating practice set.</p>
            </label>
        </Link>
    );
};


// Main Component - Updated to match the new design
const CategoryPage: React.FC = () => {
    const [searchParams] = useSearchParams()
    const group = searchParams.get("group")
    const subject = searchParams.get("subject")
    console.log(subject)

    const { group:groupData } = useCategories()

    const categories = groupData?.find(prev => prev.slug === group)?.subjects.find(prev => prev.slug == subject)?.categories

    // const categories = pathname.state.categories
    console.log("categories", categories)




    return (

        <div className=''>

            <Link
                to="/group"
                className="inline-block rounded-2xl">
                <Button
                    className='rounded-2xl py-7 pl-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed'
                >
                    <div className='size-10 bg-white text-black rounded-2xl flex items-center justify-center'>
                        <IoMdArrowRoundBack size={50} className='text-5xl' />
                    </div>
                    Back Group
                </Button>
            </Link>

            <div className='text-[#0F172A] '>
                <p className="lg:text-5xl  text-2xl font-semibold lg:mt-8 mt-4 lg:mb-8 text-[#0F172A]">
                    Pick a category
                </p>
                <p>Choose multiple categories from {subject == 'arithmetic' && "Rekenen"} {subject == 'language' && "Taal"} {subject == 'vocabulary' && "Woordenschat"}{subject == 'reading' && "Begrijpend Lezen"}{subject == 'spelling' && "Spelling"}</p>
            </div>


            <div className="w-full  flex items-center justify-center  mt-10">

                <div className="w-full  mx-auto">

                    {/* Main Categories Grid */}
                    <main className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-6">
                        {categories?.map(category => (
                            <CategoryCard
                                key={category.id}
                                name={category.name}
                                group={group}
                                subject={subject}
                                category={category.slug}
                            // description={category.description}
                            // isSelected={!!selected[category.title]}
                            // onToggle={() => handleToggle(category.title)}
                            />
                        ))}
                    </main>

                    {/* Combined "Select All" and "Start Now" Container */}
                    <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg w-full">
                        {/* Select All Row */}
                        <label className="flex items-start gap-4 cursor-pointer">
                            <input
                                type="checkbox"
                                // checked={areAllSelected}
                                // onChange={handleSelectAll}
                                className="w-5 h-5 mt-1 rounded border-gray-400 text-orange-600 focus:ring-orange-500 flex-shrink-0"
                            />
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">All in this Subject</h3>
                                <p className="text-gray-500 text-sm mt-1">Mix all categories for varied practice.</p>
                            </div>
                        </label>

                        {/* Start Now Button */}
                        <button className="mt-6 w-full bg-slate-800 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                            Start Now
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CategoryPage;