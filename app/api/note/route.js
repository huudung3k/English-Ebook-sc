import { NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function POST(req) {
    const {notes} = await req.json()
    const res = new NextResponse("Created", {status: 201});
    res.cookies.set("notes", JSON.stringify(notes))

    return res
}

export async function GET() {
    const cookieNotes = cookies().get('notes')
    if (cookieNotes) {
        return NextResponse.json({data: JSON.parse(cookieNotes.value)})
    } else {
        return NextResponse.json({data: []})
    }
}
