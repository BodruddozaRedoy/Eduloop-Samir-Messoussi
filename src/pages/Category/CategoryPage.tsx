import { Button } from '@/components/ui/button';
import useCategories from '@/hooks/useCategories';
import React, { useState, useMemo } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useLocation, useSearchParams } from 'react-router';
import { Checkbox } from "@/components/ui/checkbox"
import useSubCategories from '@/hooks/useSubCategories';





// Main Component - Updated to match the new design
const CategoryPage: React.FC = () => {
    const [select, setSelect] = useState<number[]>([])
    const [selectCategory, setSelectCategory] = useState<number | null>(null)
    const [selectSub, setSelectSub] = useState<number[]>([])
    const [searchParams] = useSearchParams()
    const subjectId = searchParams.get("subjectId")

    const { categories } = useCategories(subjectId)
    // const {subCategories} = useSubCategories(selectCategory)

    console.log("categories", categories)
    console.log(select)

    const handleSelect = (id: number) => {
        setSelect([...select, id])
    }

    const handleSubSelect = (id:number) => {
        setSelectCategory(id)
    }



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
            </div>


            <div className="w-full  flex items-center justify-center  mt-10">

                <div className="w-full  mx-auto">

                    {/* Main Categories Grid */}
                    <main className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-6">
                        {categories?.map(category => (
                            <div
                                key={category.id}
                                className={`flex flex-col p-6 rounded-2xl gap-3 cursor-pointer border-2 transition-all duration-200`}
                            >
                                <div className="flex items-center gap-3 justify-between">
                                    <h3 className="font-bold text-gray-800 text-lg">{category?.name}</h3>
                                    <div className='flex items-center gap-2'>
                                        <Button onClick={() => handleSubSelect(category.id)} size={"sm"} variant={"outline"} className='text-xs !py-0.5 px-2'>Select Subcategories</Button>
                                        <Button onClick={() => handleSelect(category.id)} size={"sm"} variant={"outline"} className='text-xs !py-0.5 px-2'>Select</Button>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm">Tap to start a new, non-repeating practice set.</p>
                                    {/* subcategories  */}
                                {
                                    selectCategory && <div className='grid grid-cols-2'>
                                    {category?.subcategories?.map((sub, index) => (
                                        <div className='flex items-center gap-2'>
                                            <Checkbox/>
                                            <p className='font-semibold text-sm'>{sub.name}</p>
                                        </div>
                                    ))}
                                </div>
                                }
                            </div>
                        ))}
                    </main>

                    {/* Combined "Select All" and "Start Now" Container */}
                    <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg w-full">
                        {/* Select All Row */}
                        <label className="flex items-start gap-4 cursor-pointer">
                            <input
                                type="checkbox"
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






// Reusable Category Card
const CategoryCard = ({ category }: any) => {

    return (
        // <Link to={`/group/subject/category/${"subject"}?group=${"group"}&subject=${"subject"}&category=${"category"}`}>
        <label
            className={`flex flex-col p-6 rounded-2xl gap-3 cursor-pointer border-2 transition-all duration-200 hover:bg-orange-50 hover:border-orange-300`}
        >
            <div className="flex items-center gap-3 justify-between">
                <h3 className="font-bold text-gray-800 text-lg">{category?.name}</h3>
                <div className='flex items-center gap-2'>
                    <Button size={"sm"} variant={"outline"} className='text-xs !py-0.5 px-2'>Select Subcategories</Button>
                    <Button size={"sm"} variant={"outline"} className='text-xs !py-0.5 px-2'>Select</Button>
                </div>
            </div>
            <p className="text-gray-500 text-sm">Tap to start a new, non-repeating practice set.</p>
        </label>
        // </Link>
    );
};