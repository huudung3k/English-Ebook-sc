import { NextResponse } from "next/server";
import { filterParts } from "../../../lib/part";
import { returnErrorResponse } from "../../helper";

export const POST = async (req) => {
    try {
        const { classId, unitId, partNumber } = await req.json()

        const result = await filterParts({ classId, unitId, partNumber })

        return new NextResponse(JSON.stringify(result), { status: 200 })
    } catch (error) {
        returnErrorResponse(error)
    }
};

