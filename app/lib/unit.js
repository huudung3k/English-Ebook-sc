import Unit from "../model/unit"
import { getClass } from "./class";
import connectMongo from "./database";
import { removeNullValuesInObj } from "../utils"
import { ApiError } from "next/dist/server/api-utils";

let mongoose = null

export const createUnit = async ({ unitNumber, topic, summary, classId }) => {
    if (!mongoose) mongoose = await connectMongo()

    const _class = await getClass(classId, true)

    const unit = await Unit.findOne({ unitNumber: unitNumber, class: _class })
    if (unit) throw new ApiError(400, `Unit ${unitNumber} of ${_class.name} already exists`)

    const newUnit = await Unit.create({
        class: _class,
        unitNumber: unitNumber,
        topic: topic,
        summary: summary
    })
    delete newUnit._doc.__v
    delete newUnit._doc.class
    newUnit._doc.classId = _class._id

    return newUnit
}

export const getUnit = async (id, includeDetail = false) => {
    if (!mongoose) mongoose = await connectMongo()

    let unit = null

    if (includeDetail) unit = await Unit.findById(id, '-__v')
    else unit = await Unit.findById(id, '_id')

    if (!unit) throw new ApiError(400, `Unit with ID ${id} does not exist`)

    return unit
}

export const updateUnit = async ({ id, topic, summary }) => {
    if (!mongoose) mongoose = await connectMongo()

    const unit = await getUnit(id, true)

    await Unit.findByIdAndUpdate(id, {
        topic: topic ?? unit.topic,
        summary: summary ?? unit.summary
    })

    const updatedUnit = await Unit.findById(id, '-__v')

    return updatedUnit
};

export const deleteUnit = async (id) => {
    if (!mongoose) mongoose = await connectMongo()

    await getUnit(id)
    await Unit.findByIdAndDelete(id)
};

export const filterUnits = async ({ classId, skip = 0, limit = 20, ...fields }) => {
    if (!mongoose) mongoose = await connectMongo()

    let filter = {
        ...fields
    }

    if (classId) {
        const _class = await getClass(classId)
        filter = { ...filter, class: _class }
    }
    removeNullValuesInObj(filter)

    const units = await Unit.find(filter, '-__v').sort({ unitNumber: 1 }).skip(skip).limit(limit)

    return units
};
