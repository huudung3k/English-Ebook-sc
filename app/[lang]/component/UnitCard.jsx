"use client"

import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleRoof } from "@fortawesome/free-solid-svg-icons";

export default function UnitCard({ id, unit, topic }) {

    return (
        <Link href={`/unit/${id}/getting-started`}>
            <div className="unit-card">
                <div>
                    <div className="title d-flex">
                        <h3>Unit {unit}</h3>
                        <div className="icon">
                            <span><FontAwesomeIcon icon={faPeopleRoof} /></span>
                        </div>
                    </div>
                    <h4>{topic.toUpperCase()}</h4>
                </div>
            </div>
        </Link>
    )
};
