import { useState } from "react";
import { Link } from "react-router";

interface SubjectCardProps {
    id: string;
    title: string;
    subtitle: string;
    color: string;
    link:string;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ id, title, subtitle, color }) => {
    const [checked, setChecked] = useState(false);

    return (
        <Link to={`/subject-category/${id}`}>
            <div className="flex flex-col p-12 rounded-2xl border-2 shadow-md border-[#FFF7ED] hover:shadow-xl hover:-translate-y-1 hover:border-[#E16641] transition-transform cursor-pointer bg-white">
                <div className="flex items-center mb-2">
                    {/* Custom checkbox */}
                    <div
                        onClick={(e) => {
                            e.preventDefault(); // prevent link navigation when checking
                            setChecked(!checked);
                        }}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors`}
                        style={{
                            borderColor: color,
                            backgroundColor: checked ? color : "#fff",
                        }}
                    >
                        {checked && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.586l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <h3 className="font-semibold text-lg ml-3 text-gray-900">{title}</h3>
                </div>
                <p className="text-gray-500 text-sm">{subtitle}</p>
            </div>
        </Link>
    );
};