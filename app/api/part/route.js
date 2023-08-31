import { NextResponse } from "next/server";
import { createPart, deletePart, getPart, updatePart } from "../../lib/part";
import { returnErrorResponse } from "../helper";

export const POST = async (req) => {
    try {
        const { partNumber, title, unitId } = await req.json()

        if (!partNumber || !title || !unitId)
            return new NextResponse(JSON.stringify({ message: `Fields 'partNumber', 'title', 'unitId' are required` }), { status: 400 })

        const result = await createPart({ partNumber, title, unitId })

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

        const result = await getPart(id, true)

        return new NextResponse(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return returnErrorResponse(error)
    }
};

export const PUT = async (req) => {
    try {
        const { id, title } = await req.json()

        if (!id) return new NextResponse(JSON.stringify({ message: `Field 'id' is required` }), { status: 400 })

        const result = await updatePart({ id, title })

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

        await deletePart(id)

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return returnErrorResponse(error)
    }
}
