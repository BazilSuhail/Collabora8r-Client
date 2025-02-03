import "./Loader.css"

const SignInLoader = ({ message="" }) => {
    return (
        <div className="h-screen flex flex-col justify-center items-center spin  w-screen">
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
            <div className="mt-[58px] font-[600] text-center text-cyan-700 text-[16px]">
                {message}
                <p className="text-red-400 mt-[3px] font-[500] text-[12px] text-center">Getting things ready </p>
            </div>
        </div>
    )
}

export default SignInLoader
