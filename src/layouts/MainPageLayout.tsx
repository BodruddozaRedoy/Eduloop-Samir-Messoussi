import Navbar from '@/components/layout/Navbar'
import { Outlet, useLocation } from 'react-router'
import bg from '@/assets/images/bg.jpg'
import Footer from '@/components/layout/Footer'

export default function MainPageLayout() {
    const location = useLocation()
    return (
        <div
            style={{
                background: `url(${bg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
            className="w-full h-screen p-2 flex flex-col bg-white"
        >
            {/* navbar  */}
            {location.pathname !== "/" && <Navbar />}

            <main
                className={`bg-white border-white/20 rounded-[30px] border h-full flex-1 
          ${location.pathname !== "/" ? "p-10" : "overflow-hidden"}`}
            >
                <div className="">
                    <Outlet />
                </div>

                {/* footer */}
                {location.pathname !== "/" && <Footer />}
            </main>
        </div>
    )
}
