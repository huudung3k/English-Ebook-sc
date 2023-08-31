import { NextResponse } from "next/server";
import { returnErrorResponse } from "../../helper"
import { filterClass } from "../../../lib/class";

export const POST = async (req) => {
    try {
        const result = filterClass()

        return new NextResponse(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return returnErrorResponse(error)
    }
}