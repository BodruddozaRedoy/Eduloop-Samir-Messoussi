import type { Summary } from "@/pages/Reading/components/ReadingMultipleChoice"


export default function Check({ summary }: {summary: Summary | null}) {
    return (
        <div >
            {summary && (
                <div className={`w-full ${summary.color} ${summary.bgColor} border ${summary.borderColor} p-5 rounded-lg mt-3`}>
                    <p className="font-semibold text-lg">
                        {summary.text}
                    </p>
                </div>
            )}
        </div>
    )
}
