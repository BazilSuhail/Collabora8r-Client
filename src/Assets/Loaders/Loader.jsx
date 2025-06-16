import React from 'react';
import "./Loader.css"

const Loader = () => {
    return (
        <div className="min-h-[60vh] flex flex-col justify-center items-center w-full transition-colors duration-300">
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
            <div className="mt-12 flex flex-col items-center gap-2">
                <p className="font-black text-gray-800 dark:text-white text-xl uppercase tracking-[0.3em]">
                    Sync<span className="text-orange-600">hr</span>onizing
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
