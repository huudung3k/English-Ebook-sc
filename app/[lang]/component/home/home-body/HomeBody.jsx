import "./home-body.css"
import UnitCard from "../../UnitCard"

export default function HomeBody({ units }) {

    return (
        <div className="home-body">
            <div className="content">
                <div className="units-container">
                    {units.map((u) => (<UnitCard key={u._id} id={u._id} unit={u.unitNumber} topic={u.topic} />))}
                </div>
            </div>
        </div>
    )
};
