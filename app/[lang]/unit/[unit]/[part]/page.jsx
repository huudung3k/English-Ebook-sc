import "./page.css"
import { filterParts } from "../../../../lib/part"
import { getUnit } from "../../../../lib/unit"
import { PART_NAME } from "../../../../api/constant"
import { filterSections } from "../../../../lib/section"
import Section from "../../../component/Section"
import { breeSerif, sohoGothicProBold, ubuntu } from "../../../../fonts"
import { romanize } from "../../../../utils"

export default async function PartPage({ params }) {
    const mapPartUrlParam = {
        'getting-started': PART_NAME.GETTING_STARTED,
        language: PART_NAME.LANGUAGE,
        reading: PART_NAME.READING,
        speaking: PART_NAME.SPEAKING,
        listening: PART_NAME.LISTENING,
        writing: PART_NAME.WRITING,
        culture: PART_NAME.CULTURE,
        'looking-back': PART_NAME.LOOKING_BACK,
        project: PART_NAME.PROJECT
    }

    const unit = JSON.parse(JSON.stringify(await getUnit(params.unit, true)))
    const part = JSON.parse(JSON.stringify(await filterParts({ unitId: params.unit, partNumber: mapPartUrlParam[params.part] })))[0]
    const sections = JSON.parse(JSON.stringify(await filterSections({ partId: part._id })))
    const startIndex = params.part === 'getting-started' ? 1 : 0
    const endIndex = Math.round(sections.length / 2) + (params.part === 'getting-started' ? 1 : 0)
    const leftSections = sections.slice(startIndex, endIndex)
    const rightSections = sections.slice(endIndex)

    return (
        <div className="w-full h-full flex items-start justify-center bg-gray-200">
            <div className={`unit-page-container ${params.part !== 'getting-started' ? 'two-col-page' : ''}`}>
                {(params.part !== 'getting-started' && params.part !== 'project') &&
                    <>
                        <div className="mini-unit">
                            <p className={breeSerif.variable}>Unit</p>
                            <p className={ubuntu.variable}>{unit?.unitNumber}</p>
                            <div className="left-triangle"></div>
                            <div className="right-triangle"></div>
                        </div>
                        <div className="part-title-group part-title-secondary">
                            <div className={`${breeSerif.variable} part-number`}>
                                <h1>{romanize(part.partNumber)}</h1>
                            </div>
                            <div className={`${sohoGothicProBold.variable} part-title`}>
                                <h1>{part.title.toUpperCase()}</h1>
                            </div>
                        </div>
                    </>
                }

                {(params.part === 'getting-started') &&
                    <>
                        <div className="unit">
                            <div className="triangle-topleft"></div>
                            <div className="triangle-bottomright"></div>
                            <div className="triangle-bottomleft"></div>
                            <p className={breeSerif.variable}>Unit</p>
                            <p className={ubuntu.variable}>{unit.unitNumber}</p>
                        </div>
                        <div className="topic"><p>{unit.topic}</p></div>
                        <div className="first-page">
                            <div className="summary">
                                <h3><p>This unit includes:</p></h3>
                                <div className="summary-content">
                                    <div dangerouslySetInnerHTML={{ __html: JSON.parse(unit.summary || '""') }}></div>
                                </div>
                            </div>
                            <div className="part-one-col">
                                <div className="part-title-group">
                                    <div className={`${breeSerif.variable} part-number`}>{romanize(part.partNumber)}</div>
                                    <h1 className={`${sohoGothicProBold.variable} part-title`}>{part.title.toUpperCase()}</h1>
                                </div>
                                <Section sectionData={sections[0]} />
                            </div>
                        </div>
                    </>
                }

                {(params.part === 'project') &&
                    <>
                        <div className="mini-unit">
                            <p className={breeSerif.variable}>Unit</p>
                            <p className={ubuntu.variable}>{unit?.unitNumber}</p>
                            <div className="left-triangle"></div>
                            <div className="right-triangle"></div>
                        </div>
                        <div className="part-title-group part-title-secondary">
                            <div className={`${sohoGothicProBold.variable} part-title part-title-shadow`}>
                                <h1>{part.title.toUpperCase()}</h1>
                            </div>
                        </div>
                        <div className="full-page-col">
                            <Section sectionData={sections[0]} hideSectionNumber={true} />

                        </div>
                    </>
                }

                {(params.part !== 'project') &&
                    <div className="part-two-col">
                        <div className="col-left">
                            {
                                leftSections.map((s, i) => {
                                    return (
                                        <Section key={i} sectionData={s} />
                                    )
                                })
                            }
                        </div>
                        <div className="col-right">
                            {
                                rightSections.map((s, i) => {
                                    return (
                                        <Section key={i} sectionData={s} />
                                    )
                                })
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
};
