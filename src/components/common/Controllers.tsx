import React from 'react'
import { Button } from '../ui/button'

type ControllersProps = {
  handleCheck: () => void
  handleShowSolution: () => void
  handleShowHint: () => void
}

export default function Controllers({ handleCheck, handleShowSolution, handleShowHint }: ControllersProps) {

    return (
        <div className='flex items-center justify-between mt-5 '>
            <div className='flex items-center gap-3'>
                <Button onClick={handleCheck} className='bg-[#dbeafe] hover:bg-[#dbeafe]/70 text-black border'>Check</Button>
                <Button onClick={handleShowHint} className='bg-[#ffedd5] hover:bg-[#ffedd5]/70 text-black border'>Hint</Button>
                <Button onClick={handleShowSolution} className='bg-[#f3e8ff] hover:bg-[#f3e8ff]/70 text-black border'>Show Solution</Button>
            </div>
        </div>
    )
}
