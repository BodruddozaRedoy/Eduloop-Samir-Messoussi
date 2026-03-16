import Navbar from '@/components/layout/Navbar'
import { Outlet, useLocation, useNavigate } from 'react-router'
import bg from '@/assets/images/bg.jpg'
import Footer from '@/components/layout/Footer'
import { useEffect } from 'react'

export default function MainPageLayout() {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const accessKey = localStorage.getItem("access-key")
        if (!accessKey && location.pathname !== "/") {
            navigate("/login", { replace: true })
        }
    }, [location.pathname, navigate])

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
            {/* navbar */}
            {location.pathname !== "/" && <Navbar />}

            <main
                className={`bg-white border-white/20 rounded-[30px] border flex flex-col flex-1 
                    ${location.pathname !== "/" ? "p-10" : "overflow-hidden"}`}
            >
                <div className="flex-1">
                    <Outlet />
                </div>

                {/* footer */}
                {location.pathname !== "/" && <Footer />}
            </main>
        </div>
    )
}
