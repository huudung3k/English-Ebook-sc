import { ObjectId } from "mongodb";
import StudentClass from "../model/studentClass";
import connectMongo from "./database";

let mongoose = null

export const countAssignments = async ({ studentClassId, unitId }) => {
    if (!mongoose) mongoose = await connectMongo()

    const result = await StudentClass.aggregate(
        [
            {
                '$match': {
                    '_id': new ObjectId(studentClassId)
                }
            }, {
                '$lookup': {
                    'as': 'users',
                    'from': 'users',
                    'foreignField': 'studentClass',
                    'localField': '_id',
                    'pipeline': [
                        {
                            '$lookup': {
                                'as': 'assignments',
                                'from': 'assignments',
                                'foreignField': 'user',
                                'localField': '_id',
                                'pipeline': [
                                    {
                                        '$match': {
                                            'isActive': true
                                        }
                                    }, {
                                        '$lookup': {
                                            'as': 'sections',
                                            'from': 'sections',
                                            'foreignField': '_id',
                                            'localField': 'section',
                                            'pipeline': [
                                                {
                                                    '$lookup': {
                                                        'as': 'parts',
                                                        'from': 'parts',
                                                        'foreignField': '_id',
                                                        'localField': 'part',
                                                        'pipeline': [
                                                            {
                                                                '$match': {
                                                                    'unit': new ObjectId(unitId)
                                                                }
                                                            }, {
                                                                '$project': {
                                                                    '_id': 1
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }, {
                                                    '$project': {
                                                        '_id': 1,
                                                        'sectionNumber': 1,
                                                        'parts': 1
                                                    }
                                                }, {
                                                    '$unwind': {
                                                        'path': '$parts',
                                                        'preserveNullAndEmptyArrays': false
                                                    }
                                                }
                                            ]
                                        }
                                    }, {
                                        '$project': {
                                            '_id': 1,
                                            'isActive': 1,
                                            'isTemplate': 1,
                                            'isFinished': 1,
                                            'sections': 1
                                        }
                                    }, {
                                        '$unwind': {
                                            'path': '$sections',
                                            'preserveNullAndEmptyArrays': false
                                        }
                                    }
                                ]
                            }
                        }, {
                            '$project': {
                                '_id': 1,
                                'username': 1,
                                'assignments': 1
                            }
                        }, {
                            '$unwind': {
                                'path': '$assignments',
                                'preserveNullAndEmptyArrays': false
                            }
                        }
                    ]
                }
            }, {
                '$project': {
                    '_id': 1,
                    'name': 1,
                    'users': 1
                }
            }, {
                '$unwind': {
                    'path': '$users',
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$group': {
                    '_id': '$users.username',
                    'assignmentsCount': {
                        '$count': {}
                    }
                }
            }, {
                '$sort': {
                    '_id': 1
                }
            }
        ]
    )

    return result
};

export const countStudents = async () => {
    if (!mongoose) mongoose = await connectMongo()

    const result = await StudentClass.aggregate(
        [
            {
                '$lookup': {
                    'as': 'users',
                    'from': 'users',
                    'foreignField': 'studentClass',
                    'localField': '_id'
                }
            }, {
                '$unwind': {
                    'path': '$users',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$project': {
                    '_id': 1,
                    'name': 1,
                    'users': 1
                }
            }, {
                '$group': {
                    '_id': '$name',
                    'studentsCount': {
                        '$count': {}
                    }
                }
            }
        ]
    )

    return result
};
