import { filterStudentClass } from "../../../lib/studentClass"
import "./page.css"
import { countStudents } from "../../../lib/aggregrate"
import { filterUnits } from "../../../lib/unit"
import AdminClasses from "../../component/admin/admin-classes/AdminClasses"
import { SAGetLocaleDictionary } from "../../actions/serverActions"

const classId = '649956e65f8b51227d854748'

export default async function ClassesPage({ params }) {
    const dictionary = await SAGetLocaleDictionary(params.lang)

    const studentClasses = JSON.parse(JSON.stringify(await filterStudentClass({ year: new Date().getFullYear(), isActive: true })))
    const studentsInClasses = JSON.parse(JSON.stringify(await countStudents()))
    const units = JSON.parse(JSON.stringify(await filterUnits({ classId })))

    let rows = studentClasses.map(c => {
        const studentsCount = studentsInClasses.find(studentsInClass => studentsInClass._id === c.name).studentsCount

        return {
            ...c,
            studentsCount
        }
    })

    return (
        <AdminClasses studentClasses={rows} units={units} dictionary={dictionary} />
    )
};
