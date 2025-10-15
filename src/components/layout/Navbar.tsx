import { IoIosArrowDown } from 'react-icons/io'
import { LuBellDot } from 'react-icons/lu'
import { Link } from 'react-router'
import GoogleTranslateDropdown from './GoogleTranslateDropdown'
import { Button } from '../ui/button'


export default function Navbar() {
  return (
    <div className='flex items-center justify-between py-2 bg-white border-b border-white/20 rounded-[30px] mb-3 text-white px-10'>
        {/* logo  */}
        <div className='w-30'>
            <Link to={"/"}>
            <img className='w-15 h-15 ' src="https://res.cloudinary.com/dcrs7po93/image/upload/v1756934007/Logo_ajwbhb.png" alt="" /> 
            </Link>
        </div>
        {/* <GoogleTranslateDropdown/> */}
        <div className='flex items-center gap-3'>
            <div className='size-12 rounded-full bg-primary grid place-items-center'>
                <LuBellDot className='text-xl'/>
            </div>
            <div className='flex gap-3 items-center'>
                {/* <div className='size-12 rounded-full overflow-hidden'>
                    <img className='size-full object-cover' src="https://res.cloudinary.com/dcrs7po93/image/upload/v1757882228/620829347212176702376_jmlddo.jpg" alt="" />
                </div>
                <div>
                    <h1 className='font-semibold text-black'>Bodruddoza Redoy</h1>
                    <p className='text-sm text-muted-foreground'>bodruddozaredoy@gmail.com</p>
                </div>
                <IoIosArrowDown/> */}
                <Button onClick={(e) => localStorage.removeItem("access-key")}>Log out</Button>
            </div>
        </div>
    </div>
  )
}
