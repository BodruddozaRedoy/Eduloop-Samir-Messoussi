import { Button } from "@/components/ui/button";
import useCategories from "@/hooks/useCategories";
import React, { useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router";

interface Group {
    id: number;
    ageRange: string;
    name?: string;
}

const GroupPage: React.FC = () => {
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
    const { group } = useCategories()
    const navigate = useNavigate()

    console.log(group)
    return (
        <div className="relative   flex flex-col justify-start pt-10 px-4 md:px-10">
            {/* Header Section */}
            <Link to="/login" className=" w-36">
                <Button
                    className='rounded-2xl py-7 pl-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed'
                >
                    <div className='size-10 bg-white text-black rounded-2xl flex items-center justify-center'>
                        <IoMdArrowRoundBack size={50} className='text-5xl' />
                    </div>
                    Back
                </Button>
            </Link>
            <p className="text-3xl lg:text-6xl  font-semibold mt-4 lg:mt-8 mb-4 lg:mb-8 text-[#0F172A]">
                Choose Year
            </p>

            {/* Cards Section */}
            <div className="grid grid-cols-1  md:grid-cols-4 lg:grid-cols-5 gap-6">
                {group?.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => { setSelectedGroup(card.id); navigate(`/group/subject?groupId=${card.slug}`) }}
                        className={`
              flex flex-col bg-white   p-6 rounded-2xl border-2   cursor-pointer transition-all duration-300
              hover:shadow-xl hover:-translate-y-1 hover:bg-[#FFF0ED]
              ${selectedGroup === card.id
                                ? "border-2 "
                                : "border-1 border-[#FFF7ED] "
                            }
            `}
                    >
                        <div className="inline-block bg-[#D95B43] w-26 text-white text-sm font-bold px-4 py-1 rounded-full mb-2">
                            {card.name}
                        </div>
                        <p className="text-gray-800 font-semibold text-base mb-1">
                            Best for {" "}
                            {card.slug === "group-4" && "0-4"}
                            {card.slug === "group-5" && "5-6"}
                            {card.slug === "group-6" && "7-8"}
                            {card.slug === "group-7" && "8-9"}
                            {card.slug === "group-8" && "10-12"}
                            {" "}
                            years learners
                        </p>
                        <p className="text-slate-400 text-sm">Tap to continue</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupPage;