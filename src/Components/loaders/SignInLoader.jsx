import "./Loader.css"

const SignInLoader = ({ message="" }) => {
    return (
        <div className="h-screen flex flex-col justify-center items-center bg-white dark:bg-[#000000] transition-colors duration-300">
            <div className="scale-[0.35] md:scale-[0.5]">
                <div className="animate-custom-spin">
                    <div className="container">
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                    </div>
                </div>
            </div>
            <div className="mt-18 flex flex-col items-center gap-2">
                <span className="font-semibold text-gray-800 dark:text-white text-xl ">
                    {message || "Authenticating"}
                </span>
                <p className="text-orange-600 font-bold text-xs animate-pulse">
                    Synchronizing Account...
                </p>
                <div className="flex gap-1.5 mt-2">
                    <span className="w-2 h-2 bg-orange-600 rounded-full animate-bounce shadow-lg shadow-orange-600/50" style={{ animationDelay: '0s' }} />
                    <span className="w-2 h-2 bg-orange-600 rounded-full animate-bounce shadow-lg shadow-orange-600/50" style={{ animationDelay: '0.2s' }} />
                    <span className="w-2 h-2 bg-orange-600 rounded-full animate-bounce shadow-lg shadow-orange-600/50" style={{ animationDelay: '0.4s' }} />
                </div>
            </div>
        </div>
    )
}

export default SignInLoader
