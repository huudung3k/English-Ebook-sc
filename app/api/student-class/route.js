import { NextResponse } from "next/server";
import { returnErrorResponse } from "../helper";
import { createStudentClass, deleteStudentClass, getStudentClass, updateStudentClass } from "../../lib/studentClass";

export const POST = async (req) => {
    try {
        const { name, year } = await req.json()

        if (!name || !year)
            return new NextResponse(JSON.stringify({ message: `Fields 'name', 'year' are required` }), { status: 400 })

        const result = await createStudentClass({
            name,
            year
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

        const result = await getStudentClass(id, true)

        return new NextResponse(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return returnErrorResponse(error)
    }
};

export const PUT = async (req) => {
    try {
        const { id, name, year, isActive } = await req.json()

        if (!id) return new NextResponse(JSON.stringify({ message: `Field 'id' is required` }), { status: 400 })

        const result = await updateStudentClass({
            name,
            year,
            isActive
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

        await deleteStudentClass(id)

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return returnErrorResponse(error)
    }
}
