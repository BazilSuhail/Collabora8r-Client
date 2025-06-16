import "./Loader.css"

const SignInLoader = ({ message="" }) => {
    return (
        <div className="h-screen flex flex-col justify-center items-center bg-white dark:bg-[#000000] transition-colors duration-300">
            <div className="scale-[0.35] md:scale-[0.45]">
                <div className="animate-custom-spin">
                    <div className="container">
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                    </div>
                </div>
            </div>
            <div className="mt-12 flex flex-col items-center gap-3">
                <span className="font-black text-gray-800 dark:text-white text-xl uppercase tracking-[0.2em]">
                    {message || "Authenticating"}
                </span>
                <p className="text-orange-600 font-bold text-xs uppercase tracking-widest animate-pulse">
                    Synchronizing Neural Interface...
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
