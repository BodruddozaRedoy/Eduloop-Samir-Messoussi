import { useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router";

interface SubjectCardProps {
    id: string;
    name: string;
    slug: string
    // subtitle: string;
    // color: string;
    // link:string;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ id, name, slug, groupId }) => {
    const [checked, setChecked] = useState(false);
    
    const navigate = useNavigate()
    console.log(groupId)

    return (
        <div onClick={() => navigate(`/group/subject/subject-category?groupId=${groupId}&subject=${slug}`)}>
            <div className="flex flex-col p-12 rounded-2xl border-2 shadow-md border-[#FFF7ED] hover:shadow-xl hover:-translate-y-1 hover:border-[#E16641] transition-transform cursor-pointer bg-white ">
                <div className="flex items-center mb-2">
                    {/* Custom checkbox */}
                    <div className="size-7 bg-muted p-1.5 rounded">
                        <div className=" border size-full border-primary rounded"></div>
                    </div>
                    <h3 className="font-semibold text-lg ml-3 text-gray-900">{name}</h3>
                </div>
                <p className="text-gray-500 text-sm">Start Practicing {name} Instantly</p>
            </div>
        </div>
    );
};