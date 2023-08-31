import { NextResponse } from "next/server";
import { createUnit, deleteUnit, getUnit, updateUnit } from "../../lib/unit";
import { returnErrorResponse } from "../helper";

export const POST = async (req) => {
    try {
        const { unitNumber, topic, summary, classId } = await req.json()

        if (!unitNumber || !topic || !summary || !classId)
            return new NextResponse(JSON.stringify({ message: `Fields 'unitNumber', 'topic', 'summary', 'classId' are required` }), { status: 400 })

        const result = await createUnit({ unitNumber, topic, summary, classId })

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

        const result = await getUnit(id, true)

        return new NextResponse(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return returnErrorResponse(error)
    }
};

export const PUT = async (req) => {
    try {
        const { id, topic, summary } = await req.json()

        if (!id) return new NextResponse(JSON.stringify({ message: `Field 'id' is required` }), { status: 400 })

        const result = await updateUnit({ id, topic, summary })

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

        await deleteUnit(id)

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}
