"use client"

import "./admin-classes.css"
import { Button, Dropdown } from "@nextui-org/react"
import AppTable from "../../app-table/AppTable"
import { useState, useMemo } from 'react'
import { SABuildAssignmentsChartData } from "../../../actions/serverActions"
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AdminClasses({ studentClasses, units, dictionary }) {
    const [selectedUnit, setSelectedUnit] = useState(new Set([dictionary.unit]));
    const [selectedClass, setSelectedClass] = useState(null)
    const [message, setMessage] = useState('')
    const [chartOptions, setChartOptions] = useState(null)

    const selectedUnitValue = useMemo(
        () => {
            const unitId = Array.from(selectedUnit).join(", ").replaceAll("_", " ")
            const unitNumber = units.find(u => u._id === unitId)?.unitNumber

            return dictionary.unit + ' ' + (unitNumber ?? '')
        },
        [selectedUnit]
    );

    const columns = [
        {
            key: "name",
            label: dictionary.class,
        },
        {
            key: "year",
            label: dictionary.year,
        },
        {
            key: "studentsCount",
            label: dictionary.admin['number-of-students'],
        },
    ];

    const buildChartData = async () => {
        setMessage('')
        setChartOptions(null)
        const unitId = Array.from(selectedUnit).join(", ").replaceAll("_", " ")
        if (!selectedClass || unitId === 'Unit') {
            setMessage(dictionary.admin.message['please-select-class-and-unit'])
            return
        }

        const options = await SABuildAssignmentsChartData({ studentClassId: selectedClass, unitId })
        setChartOptions(options)
    }


    return (
        <div className="content">
            <div className="table-container">
                <AppTable columns={columns} items={studentClasses} getItemCallback={setSelectedClass} dictionary={dictionary} />
            </div>
            <div className="chart-container">
                <div className="control">
                    <Dropdown>
                        <Dropdown.Button flat>{selectedUnitValue}</Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Select Unit"
                            items={units}
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={selectedUnit}
                            onSelectionChange={setSelectedUnit}
                        >
                            {(item) => (
                                <Dropdown.Item
                                    key={item._id}
                                >
                                    {dictionary.unit} {item.unitNumber}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button onPress={buildChartData} shadow auto>{dictionary.admin['view-chart']}</Button>
                    <p className="error">{message}</p>
                </div>
                <div className="chart">
                    {chartOptions &&
                        <Chart
                            options={chartOptions.options}
                            type={chartOptions.type}
                            width={chartOptions.width}
                            height={chartOptions.height}
                            series={chartOptions.series}
                        />
                    }
                </div>
            </div>
        </div>
    )
};
