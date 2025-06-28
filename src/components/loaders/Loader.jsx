
import "./Loader.css"

const Loader = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center w-full transition-colors duration-300">
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
            <div className="mt-15 flex items-center gap-2">
                <p className="font-medium text-gray-800 dark:text-white text-xs ">
                    Load<span className="text-orange-600">ing</span>
                </p>
                <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
            </div>
        </div>
    )
}

export default Loader
