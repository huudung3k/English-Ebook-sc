import { NextResponse } from "next/server";
import { createSection, deleteSection, getSection, updateSection } from "../../lib/section";
import { returnErrorResponse } from "../helper";

export const POST = async (req) => {
    try {
        const { sectionNumber, title, content, preTitle1, preTitle2, hasAudio, audioFile, isExercise, isTable, isMatchWords, partId } = await req.json()

        if (!sectionNumber || !title || !partId)
            return new NextResponse(JSON.stringify({ message: `Fields 'sectionNumber', 'title', 'partId' are required` }), { status: 400 })

        if (hasAudio && !audioFile) return new NextResponse(JSON.stringify({ message: `Fields 'audioFile' cannnot be empty if 'hasAudio' is true` }), { status: 400 })

        const result = await createSection({
            sectionNumber,
            title,
            content,
            preTitle1,
            preTitle2,
            hasAudio,
            audioFile,
            isExercise,
            isTable,
            isMatchWords,
            partId
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

        const result = await getSection(id, true)

        return new NextResponse(JSON.stringify(result), { status: 200 })
    } catch (error) {
        return returnErrorResponse(error)
    }
};

export const PUT = async (req) => {
    try {
        const { id, title, preTitle1, preTitle2, content, hasAudio, audioFile, isExercise, isMatchWords, isTable } = await req.json()

        if (!id) return new NextResponse(JSON.stringify({ message: `Field 'id' is required` }), { status: 400 })

        const result = await updateSection({
            title,
            content,
            preTitle1,
            preTitle2,
            hasAudio,
            audioFile,
            isExercise,
            isTable,
            isMatchWords,
            id: id
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

        await deleteSection(id)

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return returnErrorResponse(error)
    }
}
