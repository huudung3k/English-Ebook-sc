import { NextResponse } from "next/server";
import { returnErrorResponse } from "../../helper";
import { filterStudentClass } from "../../../lib/studentClass";

export const POST = async (req) => {
    try {
        const { name, year, isActive } = await req.json()
        
        const result = await filterStudentClass({ name, year, isActive })

        return new NextResponse(JSON.stringify(result), { status: 200 })
    } catch (error) {
        returnErrorResponse(error)
    }
};

