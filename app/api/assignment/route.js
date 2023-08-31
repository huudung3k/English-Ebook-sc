import { NextResponse } from "next/server";
import { returnErrorResponse } from "../helper";
import { createAssignment, deleteAssignment, getAssignment, updateAssignment } from "../../lib/assignment"

export const POST = async (req) => {
    try {
        const { userId, sectionId, answer } = await req.json()

        if (!userId || !sectionId || !answer)
            return new NextResponse(JSON.stringify({ message: `Fields 'userId', 'sectionId', 'answer' are required` }), { status: 400 })

        const result = await createAssignment({
            userId,
            sectionId,
            answer
        })

        return new NextResponse(JSON.stringify(result), { status: 201 })
    } catch (error) {
        return returnErrorResponse(error)
    }
}

export const GET = async (req) => {
    try {
        const searchParams = req.nextUrl.searchParams
        const id = searchParams.get('id')

        if (!id) return new NextResponse(JSON.stringify({ message: `Field 'id' is required` }), { status: 400 })

        const result = await getAssignment(id, true)

        return new NextResponse(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return returnErrorResponse(error)
    }
};

export const PUT = async (req) => {
    try {
        const { id, answer, isActive, isFinished } = await req.json()

        if (!id) return new NextResponse(JSON.stringify({ message: `Field 'id' is required` }), { status: 400 })

        const result = await updateAssignment({
            id,
            answer,
            isActive,
            isFinished
        })

        return new NextResponse(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return returnErrorResponse(error)
    }
}

export const DELETE = async (req) => {
    try {
        const searchParams = req.nextUrl.searchParams
        const id = searchParams.get('id')

        if (!id) return new NextResponse(JSON.stringify({ message: `Field 'id' is required` }), { status: 400 })

        await deleteAssignment(id)

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return returnErrorResponse(error)
    }
}
