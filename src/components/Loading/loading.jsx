import React from 'react'
import './loading.css'

export default function Loading() {
    return (
        <div className='w-full h-full flex justify-center items-center'>
            <div className="loader">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
    )
}
