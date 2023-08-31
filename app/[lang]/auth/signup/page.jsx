import "./sign-up.css"
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import authOptions from '../../../lib/authOptions'
import SignUpForm from "../../component/sign-up-form/SignUpForm";
import { filterStudentClass } from "../../../lib/studentClass";

export default async function SignUpPage() {
    const session = await getServerSession(authOptions)
    const studentClasses = JSON.parse(JSON.stringify(await filterStudentClass({ isActive: true, year: 2023 })))

    if (session) {
        redirect('/')
    }

    return (
        <div className="signup-page-container">
            <SignUpForm studentClasses={studentClasses} />
        </div>
    )
};
