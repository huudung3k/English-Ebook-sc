import { NextResponse } from "next/server";
import { ApiError } from "next/dist/server/api-utils";

export const returnErrorResponse = (error) => {
    if (error instanceof ApiError) return new NextResponse(JSON.stringify({ message: error.message }), { status: error.statusCode })

    return new NextResponse(JSON.stringify(error), { status: 500 })
}