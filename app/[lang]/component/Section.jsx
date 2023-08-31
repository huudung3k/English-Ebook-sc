import { getServerSession } from "next-auth"
import SectionContent from "./section-content/SectionContent"
import authOptions from "../../lib/authOptions"
import { filterAssignments } from "../../lib/assignment"

export default async function Section({ sectionData, hideSectionNumber }) {
    const session = await getServerSession(authOptions)
    let assignments = null
    if (sectionData.isExercise && session != null) {
        assignments = JSON.parse(JSON.stringify(await filterAssignments({ userId: session?.user.id, sectionId: sectionData._id })))
    }

    return (
        <SectionContent sectionData={sectionData} assignmentsData={assignments} hideSectionNumber={hideSectionNumber} />
    )
};
