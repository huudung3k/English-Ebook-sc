import { NextResponse } from "next/server";
import { createUser, getUser } from "../../lib/user";
import { returnErrorResponse } from "../helper";

export const POST = async (req) => {
    try {
        const { username, name, email, password, confirmPassword, studentClassId } = await req.json()

        const result = await createUser({ username, name, email, password, confirmPassword, studentClassId })

        return new NextResponse(JSON.stringify(result), { status: 201 })
    } catch (error) {
        return returnErrorResponse(error)
    }

}

export const GET = async (req) => {
    try {

        const searchParams = req.nextUrl.searchParams
        const id = searchParams.get('id')
        const username = searchParams.get('username')

        if (!username && !id)
            return new NextResponse(JSON.stringify({ message: `Field 'id' or 'username' is required` }), { status: 400 })

        const result = await getUser({ id, username }, true)

        return new NextResponse(JSON.stringify(result), { status: 200 })

    } catch (error) {
        return returnErrorResponse(error)
    }

};
