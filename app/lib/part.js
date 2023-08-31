import Part from "../model/part"
import { removeNullValuesInObj } from "../utils";
import { getClass } from "./class";
import connectMongo from "./database";
import { filterUnits, getUnit } from "./unit";
import { ApiError } from "next/dist/server/api-utils";

let mongoose = null

export const createPart = async ({ partNumber, title, unitId }) => {
    if (!mongoose) mongoose = await connectMongo()

    const unit = await getUnit(unitId)

    const part = await Part.findOne({ partNumber: partNumber, unit: unit })
    if (part) throw new ApiError(400, `Part ${partNumber} of Unit ${unit.unitNumber} already exists`)

    const newPart = await Part.create({
        unit: unit,
        partNumber: partNumber,
        title: title
    })
    delete newPart._doc.__v
    delete newPart._doc.unit
    newPart._doc.unitId = unit._id

    return newPart
};

export const getPart = async (id, includeDetail = false) => {
    if (!mongoose) mongoose = await connectMongo()

    let part = null

    if (includeDetail) part = await Part.findById(id, '-__v')
    else part = await Part.findById(id, '_id')

    if (!part) throw new ApiError(400, `Part with ID ${id} does not exist`)

    return part
};

export const updatePart = async ({ id, title }) => {
    if (!mongoose) mongoose = await connectMongo()

    const part = await getPart(id, true)

    await Part.findByIdAndUpdate(id, {
        title: title ?? part.title
    })

    const updatedPart = await Part.findById(id, '-__v')

    return updatedPart
};

export const deletePart = async (id) => {
    if (!mongoose) mongoose = await connectMongo()

    await getPart(id)
    await Part.findByIdAndDelete(id)
};

export const filterParts = async ({ classId, unitId, skip = 0, limit = 20, ...fields }) => {
    if (!mongoose) mongoose = await connectMongo()

    let filter = {
        ...fields
    }

    if (unitId) {
        const unit = await getUnit(unitId)
        filter = { ...filter, unit }
    }
    else if (classId) {
        const units = await filterUnits({ classId })
        filter = { ...filter, unit: { $in: units } }
    }

    removeNullValuesInObj(filter)

    const parts = await Part.find(filter, '-__v').sort({ partNumber: 1 }).skip(skip).limit(limit)

    return parts
};
