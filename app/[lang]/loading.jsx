"use client"

import { Loading } from "@nextui-org/react";

export default function PageLoadingSpinner() {

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Loading size="xl" />
        </div>
    )
};
