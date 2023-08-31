"use client"

import { usePromiseTracker } from "react-promise-tracker";

export default function FetchLoadingSpinner() {
    const { promiseInProgress } = usePromiseTracker();

    return (
        promiseInProgress &&
        <div className="flex items-center justify-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[51]">
            <span className="loader"></span>
        </div>
    )
};