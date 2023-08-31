import { NextResponse } from "next/server";
import { filterAssignments } from "../../../lib/assignment";

export const POST = async (req) => {
    try {
        const { userId, sectionId, isActive } = await req.json()

        const result = await filterAssignments({ userId, sectionId, isActive })

        return new NextResponse(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
};
