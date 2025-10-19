import { Button } from '@/components/ui/button';
import { AxiosPublic } from '@/config/axios';
import React, { useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
    const [passcode, setPasscode] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!passcode) return toast.error("Please provide the access key");
        try {
            const res = await AxiosPublic.post("/token-verify/", { key: passcode })
            if (res.status === 200) {
                toast.success("User verified!")
                // navigate("/group")
                localStorage.setItem("access-key", `AccessKey ${passcode}`);
                navigate("/group")
            }
        } catch (error: any) {
            if (error.status === 400) {
                toast.error("Access code invalid!")
            }
            if (error.status === 403) {
                toast.error("Access code invalid!")
            }
            console.log(error)
        }
        // ✅ Save access key in localStorage
        // localStorage.setItem("access-key", passcode);
        // Redirect to group page
        // navigate("/group");
    };

    return (
        <div className="relative">
            {/* Back Button */}
            <Link to="/" className="absolute lg:ml-10 left-6 z-50">
                <Button className="rounded-2xl py-7 pl-2 font-bold text-xl">
                    <div className="size-10 bg-white text-black rounded-2xl flex items-center justify-center">
                        <IoMdArrowRoundBack size={50} className="text-5xl" />
                    </div>
                    Back
                </Button>
            </Link>

            {/* Main Login Content */}
            <div className="flex items-center justify-center p-4">
                <div className="bg-white mt-20 p-8 rounded-lg border-2 border-[#FFEDD5] shadow-lg max-w-sm w-full text-center">
                    <div>
                        <img
                            src="https://res.cloudinary.com/dcrs7po93/image/upload/v1756934007/Logo_ajwbhb.png"
                            alt="Logo"
                            className="mx-auto h-20"
                        />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Extra Handen</h1>
                    <p className="text-gray-600 mb-8">
                        Enter the access code to start practicing.
                    </p>

                    {/* Passcode input field */}
                    <div className="mb-6 text-left">
                        <label
                            htmlFor="passcode"
                            className="block text-gray-700 text-sm font-semibold mb-2"
                        >
                            Passcode (93388781)
                        </label>
                        <input
                            type="password"
                            id="passcode"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            placeholder="Access code"
                            className="w-full px-4 py-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {/* Log In Button */}
                    <button
                        onClick={handleLogin}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 cursor-pointer"
                    >
                        Log In
                    </button>
                    {/* <button
                        onClick={() => navigate("/group")}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 mt-2"
                    >
                        Development
                    </button> */}

                    <p className="text-gray-500 text-xs mt-6 mb-4">
                        No personal accounts. School-safe. No tracking.
                    </p>
                    {/* <a
                        className="text-orange-500 hover:underline text-sm font-semibold"
                        href="#"
                    >
                        Sign up
                    </a> */}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
