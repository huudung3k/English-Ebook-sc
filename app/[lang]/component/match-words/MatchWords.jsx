import "./match-words.css"
import { removeHtmlTags } from "../../../utils"
import { v4 as uuidv4 } from 'uuid';

export default function MatchWords({ data }) {
    data = removeHtmlTags(data).split('\n')
    for (const i in data) {
        data[i] = data[i].split('|')
    }

    return (
        <div className="section-match-word">
            {data.map((d, i) => {
                if (d[0] === '' && d[1] === '' && d[2] === '' && d[3] === '' && d[4] === '') return null
                // if (!d[0] && !d[1] && !d[2] && !d[3] && !d[4]) return null
                return (
                    <div key={uuidv4()} className="section-match-word-row">
                        <div className="left">
                            {d[1] && <div className="number">{d[1]}</div>}
                            <div className="content">{d[2]}</div>
                        </div>
                        <label className="form-control">
                            {d[0] && <input type="text" name={d[0]} />}
                        </label>
                        <div className="right">
                            {d[3] && <div className="number">{d[3]}</div>}
                            <div className="content">{d[4]}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
};
