import { NextResponse } from "next/server";
import { filterSections } from "../../../lib/section";

export const POST = async (req) => {
    try {
        const { classId, unitId, partId } = await req.json()

        const result = await filterSections({classId, unitId, partId})

        return new NextResponse(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
};
