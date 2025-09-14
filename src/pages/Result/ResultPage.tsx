import React, { useMemo } from 'react'
import useResultTracker, { getStoredResults, type TrackedItem } from '@/hooks/useResultTracker'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

export default function ResultPage() {
    const results = useMemo(() => getStoredResults(), [])
    const { reset } = useResultTracker()
    const total = results.right.length + results.wrong.length
    const scoreText = `${results.right.length}/${total || 0}`


    const handleFinish = () => {
        reset()
        localStorage.removeItem("question")
    }

    const List = ({ items, color }: { items: TrackedItem[]; color: 'green' | 'red' }) => {
        if (items.length === 0) {
            return (
                <div className={`border border-${color}-500 bg-${color}-50 text-${color}-700 rounded-lg p-4`}>
                    <p className='text-sm'>No items</p>
                </div>
            )
        }
        return (
            <div className='space-y-3'>
                {items.map((it) => (
                    <div key={it.id} className={`border border-${color}-500 flex items-center gap-3 bg-${color}-100 rounded-lg p-4`}>
                        <p className='font-bold'>Q{it.id}:</p>
                        <p>{it.title}</p>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className=''>
            <div className='bg-primary py-2 px-5 rounded-lg text-white mb-5'>
                <h1 className='font-bold mb-3 text-5xl text-center'>Result Summary</h1>
            </div>
            <div className='p-5 bg-white rounded-lg'>
                <p className='font-semibold mb-3 rounded-lg py-1 px-3 inline-flex bg-primary/20'>Your Score: {scoreText}</p>
                <div className='flex items-start justify-between gap-10'>
                    <div className='w-full'>
                        <h1 className='font-bold text-green-500 text-xl mb-3'>Right Answers</h1>
                        <List items={results.right} color='green' />
                    </div>
                    <div className='w-full'>
                        <h1 className='font-bold text-red-500 text-xl mb-3'>Wrong Answers</h1>
                        <List items={results.wrong} color='red' />
                    </div>
                </div>
                <hr className='my-5' />
                <div className='pt-10 space-x-5 w-full flex items-center justify-center'>

                    <Link to={"/arithmetic"}>
                        <Button onClick={() => reset()} className='bg-orange-300 py-5 px-10'>Try Again</Button>
                    </Link>
                    <Link to={"/"}>
                        <Button onClick={handleFinish} className='bg-green-300 py-5 px-10'>Finish</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
