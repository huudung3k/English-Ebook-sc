import { NextResponse } from "next/server";
import { createClass, deleteClass, getClass, updateClass } from "../../lib/class"
import { returnErrorResponse } from "../helper"

export const POST = async (req) => {
    try {
        const { name } = await req.json()

        if (!name) return new NextResponse(JSON.stringify({ message: `Field 'name' is required` }), { status: 400 })

        const result = await createClass(name)

        return new NextResponse(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return returnErrorResponse(error)
    }
}

export const GET = async (req) => {
    try {
        const searchParams = req.nextUrl.searchParams
        const id = searchParams.get('id')

        if (!id) return new NextResponse(JSON.stringify({ message: `Field 'id' is required` }), { status: 400 })

        const _class = await getClass(id, true)

        return new NextResponse(JSON.stringify(_class), { status: 200 })
    } catch (error) {
        return returnErrorResponse(error)
    }
};

export const PUT = async (req) => {
    try {
        const { id, name } = await req.json()

        if (!id) return new NextResponse(JSON.stringify({ message: `Field 'id' is required` }), { status: 400 })

        const result = await updateClass(id, name)

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

        await deleteClass(id)

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return returnErrorResponse(error)
    }
}
