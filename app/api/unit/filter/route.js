import { NextResponse } from "next/server";
import { filterUnits } from "../../../lib/unit";
import { returnErrorResponse } from "../../helper";

export const POST = async (req) => {
    try {
        const { classId } = await req.json()
        
        const result = await filterUnits({classId})

        return new NextResponse(JSON.stringify(result), { status: 200 })
    } catch (error) {
        returnErrorResponse(error)
    }
};

