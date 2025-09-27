import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useLocation, useSearchParams } from "react-router";
import { SubjectCard } from "./components/SubjectCard";
import useCategories from "@/hooks/useCategories";
import useSubject from "@/hooks/useSubject";

// Category type define
interface Subject {
    id: string;
    title: string;
    subtitle: string;
    color: string;
    link: string;
}

// Categories array


// Props type define for subject card


const SubjectPage: React.FC = () => {

    const pathname = useLocation()
    console.log(pathname)
    const {group} = useCategories()
    const groupData = group?.find(prev => prev.slug.includes("group-4"))
    const [params] = useSearchParams()
    const groupId = params.get("groupId")

    const {subjects} = useSubject(groupId)
    console.log(subjects)
    
    // const groupData = pathname?.state?.subjects
    // console.log(groupData)
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
                    {subjects?.map((sub:any) => (
                        <SubjectCard
                            key={sub.id}
                            id={sub.id}
                            sub={sub}
                            // name={sub.name}
                            // slug={sub.slug}
                            // categories={sub.categories}
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