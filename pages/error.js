import React from 'react'

function Custom404() {
    return (
        <div className='bg-white w-full h-screen flex flex-col justify-center items-center'>
            <div className="max-w-7xl mx-auto w-full flex flex-col justify-center items-center md:py-10 py-5 md:px-0 px-5">
                <p className='text-black font-bold md:text-9xl text-5xl'>Oops!</p>
                <p className='text-black font-normal md:text-lg text-base pt-5'>This web is not available in your country</p>
            </div>
        </div>
    )
}

export default Custom404
