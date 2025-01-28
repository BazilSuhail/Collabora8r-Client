import "./Loader.css"
const Loader = () => {
    return (
        <div className="h-screen flex flex-col justify-center items-center spin xsx:pl-[280px] w-screen">
            <div className="scale-[0.35] md:scale-[0.45] ">
                <div className="animate-custom-spin">
                    <div className="container">
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                    </div>
                </div>
            </div>
            <p className="mt-[58px] font-[600] text-red-700 text-[18px]">Lo<span className="text-cyan-600">ad</span><span className="text-blue-500">ing</span></p>

        </div>
    )
}

export default Loader
