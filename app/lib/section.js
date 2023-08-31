import Section from "../model/section";
import { removeNullValuesInObj } from "../utils";
import { getClass } from "./class";
import connectMongo from "./database";
import { filterParts, getPart } from "./part";
import { getUnit } from "./unit";
import { ApiError } from "next/dist/server/api-utils";

let mongoose = null

export const createSection = async ({ partId, sectionNumber, title, content, preTitle1, preTitle2, hasAudio, audioFile, isExercise, isTable, isMatchWords }) => {
    if (!mongoose) mongoose = await connectMongo()

    const part = await getPart(partId)

    const section = await Section.findOne({ sectionNumber: sectionNumber, part: part })
    if (section) throw new ApiError(400, `Section ${sectionNumber} of Part ${part.partNumber} already exists`)

    const newSection = await Section.create({
        part: part,
        sectionNumber: sectionNumber,
        title: title,
        content: content,
        preTitle1: preTitle1 ?? '',
        preTitle2: preTitle2 ?? '',
        hasAudio: hasAudio ?? false,
        audioFile: audioFile ?? '',
        isExercise: isExercise ?? false,
        isTable: isTable ?? false,
        isMatchWords: isMatchWords ?? false
    })
    delete newSection._doc.__v
    delete newSection._doc.part
    newSection._doc.partId = part._id

    return newSection
};

export const getSection = async (id, includeDetail = false) => {
    if (!mongoose) mongoose = await connectMongo()

    let section = null
    if (includeDetail) section = await Section.findById(id, '-__v')
    else section = await Section.findById(id, '_id')

    if (!section) throw new ApiError(400, `Section with ID ${id} does not exist`)

    return section
};

export const updateSection = async ({ id, title, content, preTitle1, preTitle2, hasAudio, audioFile, isExercise, isTable, isMatchWords }) => {
    if (!mongoose) mongoose = await connectMongo()

    const section = await getSection(id, true)

    await Section.findByIdAndUpdate(id, {
        title: title ?? section.title,
        content: content ?? section.content,
        preTitle1: preTitle1 ?? section.preTitle1,
        preTitle2: preTitle2 ?? section.preTitle2,
        hasAudio: hasAudio ?? section.hasAudio,
        audioFile: audioFile ?? section.audioFile,
        isExercise: isExercise ?? section.isExercise,
        isTable: isTable ?? section.isTable,
        isMatchWords: isMatchWords ?? section.isMatchWords
    })

    const updatedSection = await Section.findById(id, '-__v')

    return updatedSection
};

export const deleteSection = async (id) => {
    if (!mongoose) mongoose = await connectMongo()

    await getSection(id)
    await Section.findByIdAndDelete(id)
};

export const filterSections = async ({ classId, unitId, partId, skip = 0, limit = 20, ...fields }) => {
    if (!mongoose) mongoose = await connectMongo()

    let filter = {
        ...fields
    }

    if (partId) {
        const part = await getPart(partId)
        filter = { ...filter, part }
    } else if (unitId || classId) {
        const parts = await filterParts({ classId, unitId })
        filter = { ...filter, part: { $in: parts } }
    }

    removeNullValuesInObj(filter)

    const sections = await Section.find(filter, '-__v').sort({ sectionNumber: 1 }).skip(skip).limit(limit)

    console.log(sections);

    return sections
};