import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useLocation, useSearchParams } from "react-router";
import { SubjectCard } from "./components/SubjectCard";
import useCategories from "@/hooks/useCategories";

// Category type define
interface Subject {
    id: string;
    title: string;
    subtitle: string;
    color: string;
    link: string;
}

// Categories array
const subjects: Subject[] = [
    { id: "arithmetic", link: "/arithmetic", title: "Arithmetic", subtitle: "Start practicing arithmetic instantly.", color: "#a855f7" },
    { id: "grammar", link: "/", title: "Grammar", subtitle: "Start practicing grammar instantly.", color: "#ef4444" },
    { id: "orthography", link: "/", title: "Orthography", subtitle: "Start practicing orthography instantly.", color: "#3b82f6" },
    { id: "reading", link: "/", title: "Reading", subtitle: "Start practicing reading instantly.", color: "#22c55e" },
    { id: "vocabulary", link: "/", title: "Vocabulary", subtitle: "Start practicing vocabulary instantly.", color: "#f97316" },

];

// Props type define for subject card


const SubjectPage: React.FC = () => {

    const pathname = useLocation()
    console.log(pathname)
    const {group} = useCategories()
    const groupData = group?.find(prev => prev.slug.includes("group-4"))
    const [params] = useSearchParams()
    const groupId = params.get("groupId")
    
    // const groupData = pathname?.state?.subjects
    console.log(groupData)
    return (
        <div className=" ">
            <div className=" mx-auto px-4 md:px-8 py-10">
                {/* Back Button */}
                <Link to="/group" className="inline-block       rounded-2xl">
                    <Button
                        className='rounded-2xl py-7 pl-2 font-bold text-xl disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                        <div className='size-10 bg-white text-black rounded-2xl flex items-center justify-center'>
                            <IoMdArrowRoundBack size={50} className='text-5xl' />
                        </div>
                        Back Group
                    </Button>
                </Link>

                {/* Title */}



                {/* Subjects grid */}
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 mt-5">
                    {groupData?.subjects?.map((sub:any) => (
                        <SubjectCard
                            key={sub.id}
                            id={sub.id}
                            name={sub.name}
                            slug={sub.slug}
                            categories={sub.categories}
                            groupId={groupId}
                            // subtitle={sub.subtitle}
                            // color={sub.color}
                            // link={sub.link}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubjectPage;