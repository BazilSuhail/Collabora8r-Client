import "./Loader.css"
const Loader = ({ message }) => {
    return (
        <div className="h-screen flex flex-col justify-center items-center spin xsx:pl-[280px] w-screen">
            <div className="scale-[0.35] md:scale-[0.5] ">
                <div className="animate-custom-spin">
                    <div className="container">
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                    </div>
                </div>
            </div>
            {message ?
                <div className="mt-[58px] font-[600] text-center text-cyan-700 text-[17px]">{message}<p className="text-red-400 text-center">This May Take a while</p></div>
                : <p className="mt-[58px] font-[600] text-red-700 text-[18px]">Lo<span className="text-cyan-600">ad</span><span className="text-blue-500">ing</span></p>
            }
        </div>
    )
}

export default Loader
