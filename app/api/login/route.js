import { NextResponse } from "next/server";
import connectMongo from "../../lib/database";
import { login } from "../../lib/user"

export const POST = async (req) => {
    const { username, password } = await req.json()

    const user = await login(username, password)

    if (user) {
        delete user._doc.password
        return new NextResponse(JSON.stringify(user), { status: 200 })
    }

    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
};
