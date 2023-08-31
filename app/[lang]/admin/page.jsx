import "./page.css"
import { filterUnits } from "../../lib/unit";
import AdminDashboard from "../component/admin/admin-dashboard/AdminDashboard"
import { filterStudentClass } from "../../lib/studentClass";
import { SAFilterAssignments, SAGetLocaleDictionary } from "../actions/serverActions";

const classId = '649956e65f8b51227d854748'

export default async function AdminDashboardPage({ params }) {
    const dictionary = await SAGetLocaleDictionary(params.lang)

    const units = JSON.parse(JSON.stringify(await filterUnits({ classId })))
    const studentClasses = JSON.parse(JSON.stringify(await filterStudentClass({ year: new Date().getFullYear(), isActive: true })))
    const assignmentStatuses = [{ key: 'active', name: dictionary.active }, { key: 'finished', name: dictionary.finished }, { key: 'rejected', name: dictionary.rejected }]
    const filterOptions = [
        {
            filterFor: 'unit',
            name: dictionary.unit,
            options: units.map(u => {
                return { key: u._id, name: u.unitNumber }
            })
        },
        {
            filterFor: 'class',
            name: dictionary.class,
            options: studentClasses.map(c => {
                return { key: c._id, name: c.name }
            })
        },
        {
            filterFor: 'status',
            name: dictionary.status,
            options: assignmentStatuses,
            default: 'active'
        }
    ]

    let assignments = null
    const result = await SAFilterAssignments({ isTemplate: false, isActive: true, isFinished: false, isTableData: true, lang: params.lang })
    if (result.isSucess) {
        assignments = result.data
    } else {
        console.error(result.message);
    }

    return (
        <AdminDashboard assignments={assignments} assignmentFilters={filterOptions} dictionary={dictionary} lang={params.lang} />
    )
};
