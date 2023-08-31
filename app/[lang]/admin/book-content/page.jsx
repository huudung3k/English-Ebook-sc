"use client"

import "./page.css"
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import { trackPromise } from 'react-promise-tracker';
import { SACreatePart, SACreateSection, SACreateUnit, SAFilterParts, SAFilterSections, SAFilterUnits, SAGetLocaleDictionary, SAUpdatePart, SAUpdateSection, SAUpdateUnit } from "../../actions/serverActions";
import { Button, Checkbox, Dropdown, Input, Loading } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { toCamelCase } from "../../../utils";

const classId = '649956e65f8b51227d854748'

const initialContentState = {
    title: '',
    preTitle1: '',
    preTitle2: '',
    hasAudio: false,
    audioFile: '',
    isExercise: false,
    isTable: false,
    isMatchWords: false,
    content: ''
}

const initialFilters = {
    unit: {
        items: []
    },
    part: {
        items: []
    },
    section: {
        items: []
    }
}

const initialSelectedFilters = {
    unit: {
        key: null,
        name: 'Unit',
    },
    part: {
        key: null,
        name: 'Part',
    },
    section: {
        key: null,
        name: 'Section',
    },
}

export default function BookContentPage({ params }) {
    const [dictionary, setDictionary] = useState({})
    const editorRef = useRef(null);
    const [contentState, setContentState] = useState(initialContentState)
    const [selectedFilters, setSelectedFilters] = useState(initialSelectedFilters)
    const [filters, setFilters] = useState(initialFilters)

    useEffect(() => {
        async function localGetUnits() {
            const result = await trackPromise(SAFilterUnits({ classId }))

            if (result.isSucess) {
                const items = []
                for (const data of result.data) {
                    items.push({ key: data._id, name: `Unit ${data.unitNumber}`, ...data })
                }
                items.push({ key: 'new', name: 'New unit' })
                setFilters({ ...initialFilters, unit: { ...filters.unit, items } })
            } else {
                console.error(result.message);
            }
        }
        localGetUnits()
    }, [])

    useEffect(() => {
        async function localGetDictionary() {
            const dict = await SAGetLocaleDictionary(params.lang)
            setDictionary(dict)

            initialSelectedFilters.unit.name = dict.unit
            initialSelectedFilters.part.name = dict.part
            initialSelectedFilters.section.name = dict.section

            console.log(initialSelectedFilters);

            setSelectedFilters({ ...initialSelectedFilters })
        }

        localGetDictionary()
    }, [params.lang])

    const update = async () => {
        if (selectedFilters.section.key) {
            const result = await SAUpdateSection({ ...contentState, id: selectedFilters.section._id })

            if (result.isSucess) {
                const items = filters.section.items
                const index = items.findIndex(i => i._id === result.data._id)
                items[index] = Object.assign(items[index], result.data)
                setFilters({ ...filters, section: { items } })
            } else {
                console.error(result.message);
            }
        } else if (selectedFilters.part.key) {
            const result = await SAUpdatePart({ id: selectedFilters.part._id, title: contentState.title })

            if (result.isSucess) {
                const items = filters.part.items
                const index = items.findIndex(i => i._id === result.data._id)
                items[index] = Object.assign({}, items[index], result.data, { name: `${toCamelCase(result.data.title)}` })
                setFilters({ ...filters, part: { items } })
                setSelectedFilters({ ...selectedFilters, part: { ...selectedFilters.part, name: `${toCamelCase(result.data.title)}` } })
            } else {
                console.error(result.message);
            }
        } else if (selectedFilters.unit.key) {
            const result = await SAUpdateUnit({ id: selectedFilters.unit._id, topic: contentState.title, summary: contentState.content })

            if (result.isSucess) {
                const items = filters.unit.items
                const index = items.findIndex(i => i._id === result.data._id)
                items[index] = Object.assign(items[index], result.data)
                setFilters({ ...filters, unit: { items } })
            } else {
                console.error(result.message);
            }
        }
    };

    const load = () => {
        if (selectedFilters.section.key) {
            const { title, preTitle1, preTitle2, hasAudio, audioFile, isExercise, isTable, isMatchWords, content } = selectedFilters.section
            setContentState({
                ...contentState,
                title,
                preTitle1,
                preTitle2,
                hasAudio,
                audioFile,
                isExercise,
                isTable,
                isMatchWords,
                content: content
            })
        } else if (selectedFilters.part.key) {
            const { title } = selectedFilters.part
            setContentState({
                ...contentState,
                title
            })
        } else if (selectedFilters.unit.key) {
            const { topic, summary } = selectedFilters.unit
            setContentState({
                ...contentState,
                title: topic,
                content: summary
            })
        } else {
            alert("Please select Unit, Part or Section to update content")
        }
    }

    const clear = () => {
        setContentState(initialContentState)
        setSelectedFilters(initialSelectedFilters)
        setFilters({ ...filters, part: initialFilters.part, section: initialFilters.section })
    }

    const onContentChanged = (e) => {
        let value = null

        if (e.target.id === 'content') {
            value = JSON.stringify(e.target.getContent())
        } else {
            if (e.target.type === 'text') {
                value = e.target.value

            } else if (e.target.type === 'checkbox') {
                value = e.target.checked
            }
        }

        const temp = {}
        temp[e.target.id] = value
        setContentState(Object.assign({}, contentState, temp))
    }

    const filterBy = async (by, key) => {
        setContentState(initialContentState)
        if (by === 'unit') {
            await filterByUnit(key)
        } else if (by === 'part') {
            await filterByPart(key)
        } else if (by === 'section') {
            await filterBySection(key)
        }
    }

    const filterByUnit = async (key) => {
        setSelectedFilters({ ...initialSelectedFilters, unit: { key: null, name: <Loading className="w-full" type="points" size="sm" ></Loading> } })
        const value = Array.from(key).join(", ").replaceAll("_", " ")
        let unit = null

        if (value === 'new') {
            const newUnitNumber = filters.unit.items.length
            const result = await SACreateUnit({ unitNumber: newUnitNumber, topic: 'placeholder', summary: JSON.stringify('placeholder'), classId })
            if (result.isSucess) {
                const items = filters.unit.items
                const lastItem = items.pop()
                unit = { key: result.data._id, name: `Unit ${result.data.unitNumber}`, ...result.data }
                items.push(unit, lastItem)

                setFilters({ ...initialFilters, unit: { ...filters.unit, items } })
            } else {
                console.error(result.message);
            }
        } else {
            unit = filters.unit.items.find(i => i.key === value)
            const result = await SAFilterParts({ unitId: unit._id })
            if (result.isSucess) {
                const items = []
                for (const data of result.data) {
                    items.push({ key: data._id, name: `${toCamelCase(data.title)}`, ...data })
                }
                items.push({ key: 'new', name: 'New part' })

                setFilters({ ...filters, part: { ...filters.part, items }, section: initialFilters.section })
            } else {
                console.error(result.message);
            }
        }

        setSelectedFilters({ ...initialSelectedFilters, unit })
    }

    const filterByPart = async (key) => {
        setSelectedFilters({ ...selectedFilters, part: { key: null, name: <Loading className="w-full" type="points" size="sm" ></Loading> }, section: initialSelectedFilters.section })
        const value = Array.from(key).join(", ").replaceAll("_", " ")
        let part = null

        if (value === 'new') {
            const newPartNumber = filters.part.items.length
            const result = await SACreatePart({ partNumber: newPartNumber, title: 'placeholder', unitId: selectedFilters.unit._id })
            if (result.isSucess) {
                const items = filters.part.items
                const lastItem = items.pop()
                part = { key: result.data._id, name: `${toCamelCase(result.data.title)}`, ...result.data }
                items.push(part, lastItem)

                setFilters({ ...filters, part: { ...filters.part, items }, section: initialFilters.section })
            } else {
                console.error(result.message);
            }
        } else {
            part = filters.part.items.find(i => i.key === value)
            const result = await SAFilterSections({ partId: part._id })
            if (result.isSucess) {
                const items = []
                for (const data of result.data) {
                    items.push({ key: data._id, name: `Section ${data.sectionNumber}`, ...data })
                }
                items.push({ key: 'new', name: 'New section' })

                setFilters({ ...filters, section: { ...filters.section, items } })
            } else {
                console.error(result.message);
            }
        }

        setSelectedFilters({ ...selectedFilters, part, section: initialSelectedFilters.section })
    }

    const filterBySection = async (key) => {
        setSelectedFilters({ ...selectedFilters, section: { key: null, name: <Loading className="w-full" type="points" size="sm" ></Loading> } })
        const value = Array.from(key).join(", ").replaceAll("_", " ")
        let section = null

        if (value === 'new') {
            const newSectionNumber = filters.section.items.length
            const result = await SACreateSection({ sectionNumber: newSectionNumber, title: 'placeholder', partId: selectedFilters.part._id, content: JSON.stringify('placeholder') })
            if (result.isSucess) {
                const items = filters.section.items
                const lastItem = items.pop()
                section = { key: result.data._id, name: `Section ${result.data.sectionNumber}`, ...result.data }
                items.push(section, lastItem)

                setFilters({ ...filters, section: { ...filters.section, items } })
            } else {
                console.error(result.message);
            }
        } else {
            section = filters.section.items.find(i => i.key === value)
        }

        setSelectedFilters({ ...selectedFilters, section })
    }

    const clearFilter = (by) => {
        setContentState(initialContentState)
        if (by === 'unit') {
            setSelectedFilters(initialSelectedFilters)
            setFilters({ ...initialFilters, unit: filters.unit })
        } else if (by === 'part') {
            setSelectedFilters({ ...initialSelectedFilters, unit: selectedFilters.unit })
            setFilters({ ...filters, section: initialFilters.section })
        } else if (by === 'section') {
            setSelectedFilters({ ...selectedFilters, section: initialSelectedFilters.section })
            setFilters(filters)
        }
    }

    return (
        <div className="content">
            <div className="filter">
                {Object.keys(filters).map(k => (
                    <Dropdown key={k}>
                        <Button.Group size="md">
                            <Dropdown.Button className="dropdown-btn" flat auto><div className="inner">{selectedFilters[k].name}</div></Dropdown.Button>
                            <Button onPress={() => clearFilter(k)} className="clear" flat><FontAwesomeIcon icon={faCircleXmark} /></Button>
                        </Button.Group>
                        <Dropdown.Menu
                            aria-label={`Select filter for ${selectedFilters[k].name}`}
                            items={filters[k].items}
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={selectedFilters[k].key}
                            onSelectionChange={(key) => filterBy(k, key)}
                        >
                            {(item) => (
                                <Dropdown.Section>
                                    <Dropdown.Item
                                        key={item.key}
                                    >
                                        {item.name}
                                    </Dropdown.Item>
                                </Dropdown.Section>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                ))}
                <Button onPress={load} shadow auto>{dictionary.load}</Button>
                <Button onPress={clear} shadow auto>{dictionary.clear}</Button>
            </div>

            {(contentState !== initialContentState) &&
                <div className="content-block">
                    <h2>{(selectedFilters.section.key ? 'Section' : selectedFilters.part.key ? 'Part' : 'Unit') + ' Content'}</h2>
                    <Input
                        id="title"
                        bordered
                        onChange={onContentChanged}
                        value={contentState.title}
                        type="text"
                        label={selectedFilters.part.key ? 'Title' : 'Topic'}
                        aria-label={selectedFilters.part.key ? 'Title' : 'Topic'}
                        name="title"
                    />

                    {selectedFilters.section.key &&
                        <>
                            <Input
                                id="preTitle1"
                                bordered
                                onBlur={onContentChanged}
                                initialValue={contentState.preTitle1}
                                type="text"
                                label="Pre-title 1"
                                aria-label="Pre-title 1"
                                name="preTitle1"
                            />
                            <Input
                                id="preTitle2"
                                bordered
                                onBlur={onContentChanged}
                                initialValue={contentState.preTitle2}
                                type="text"
                                label="Pre-title 2"
                                aria-label="Pre-title 2"
                                name="preTitle2"
                            />
                            <Checkbox
                                id="hasAudio"
                                onChange={(e) => onContentChanged({ target: { id: 'hasAudio', type: 'checkbox', checked: e } })}
                                isSelected={contentState.hasAudio}
                                label="Has audio"
                                aria-label="Has audio"
                                name="hasAudio"
                            />
                            <Input
                                id="audioFile"
                                bordered
                                onBlur={onContentChanged}
                                initialValue={contentState.audioFile}
                                type="text"
                                label="Audio file"
                                aria-label="Audio file"
                                name="audioFile"
                            />
                            <Checkbox
                                id="isExercise"
                                onChange={(e) => onContentChanged({ target: { id: 'isExercise', type: 'checkbox', checked: e } })}
                                isSelected={contentState.isExercise}
                                label="Is exercise"
                                aria-label="Is exercise"
                                name="isExercise"
                            />
                            <Checkbox
                                id="isTable"
                                onChange={(e) => onContentChanged({ target: { id: 'isTable', type: 'checkbox', checked: e } })}
                                isSelected={contentState.isTable}
                                label="Is table"
                                aria-label="Is table"
                                name="isTable"
                            />
                            <Checkbox
                                id="isMatchWords"
                                onChange={(e) => onContentChanged({ target: { id: 'isMatchWords', type: 'checkbox', checked: e } })}
                                isSelected={contentState.isMatchWords}
                                label="Is match words"
                                aria-label="Is match words"
                                name="isMatchWords"
                            />
                        </>
                    }

                    <label htmlFor="content">{selectedFilters.section.key ? 'Content:' : (selectedFilters.unit.key && !selectedFilters.part.key) ? 'Summary' : ''}</label>
                    {((selectedFilters.unit.key && !selectedFilters.part.key) || selectedFilters.section.key) &&
                        <Editor
                            id="content"
                            apiKey="key"
                            onInit={(evt, editor) => editorRef.current = editor}
                            initialValue={JSON.parse(contentState.content || '{}')}
                            onBlur={onContentChanged}
                            init={{
                                height: 500,
                                menubar: 'file edit view insert format tools table help',
                                plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
                                toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                                toolbar_sticky: true,
                                autosave_ask_before_unload: true,
                                autosave_interval: '30s',
                                autosave_prefix: '{path}{query}-{id}-',
                                autosave_restore_when_empty: false,
                                autosave_retention: '2m',
                                image_advtab: true,
                                quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                            }}
                        />
                    }
                    <Button className="update-btn" shadow onPress={update}>Update</Button>
                </div>
            }
        </div>
    )
};
