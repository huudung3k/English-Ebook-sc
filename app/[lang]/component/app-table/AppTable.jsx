"use client"

import "./app-table.css"
import { Badge, Button, Dropdown, Table } from '@nextui-org/react';
import { useState, useTransition } from 'react'
import { v4 as uuidv4 } from 'uuid';

export default function AppTable({ columns, items, getItemCallback, filters, applyFiltersCallback, clearFiltersCallback, dictionary }) {
    const [isPending, startTransistion] = useTransition()
    const initialFilters = filters?.map(f => {
        return {
            filterFor: f.filterFor,
            key: f.default ?? null,
            name: f.name + (f.default ? ': ' + f.options.find(o => o.key === f.default)?.name : '')
        }
    })
    const [selectedFilters, setSelectedFilters] = useState(initialFilters)

    const renderCell = (item, columnKey) => {
        const cellValue = item[columnKey];
        const statusColor = {}
        statusColor[dictionary.finished] = 'success'
        statusColor[dictionary.active] = 'warning'
        statusColor[dictionary.rejected] = 'default'
        switch (columnKey) {
            case "status":
                return <Badge color={statusColor[cellValue]}>{cellValue}</Badge>;
            case "createdAt":
                return new Date(cellValue).toLocaleString('vi-VN')
            default:
                return cellValue;
        }
    };

    const setFilter = (key, i) => {
        const value = Array.from(key).join(", ").replaceAll("_", " ")
        const currentfilters = [...selectedFilters]
        currentfilters[i] = {
            ...selectedFilters[i],
            key: value,
            name: selectedFilters[i].name.split(':')[0] + ': ' + filters[i].options.find(o => o.key === value).name
        }

        setSelectedFilters(currentfilters)
    }

    const clearFilters = () => {
        setSelectedFilters(initialFilters)
        clearFiltersCallback()
    }

    return (
        <div className="table">
            {filters &&
                <div className="filters">
                    <p>{dictionary.filters}</p>
                    {filters.map((f, i) => (
                        <Dropdown key={uuidv4()}>
                            <Dropdown.Button flat>{selectedFilters[i].name}</Dropdown.Button>
                            <Dropdown.Menu
                                aria-label={`Select filter for ${f.filterFor}`}
                                items={f.options}
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={selectedFilters[i].key}
                                onSelectionChange={(key) => setFilter(key, i)}
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
                    <Button onPress={() => startTransistion(async () => await applyFiltersCallback(selectedFilters))} shadow auto>{dictionary.apply}</Button>
                    <Button onPress={clearFilters} shadow auto>{dictionary.clear}</Button>
                </div>
            }
            <Table className='data-table'
                bordered='false'
                shadow='false'
                lined
                selectionMode="single"
                aria-label="Table"
                css={{
                    height: "auto",
                    minWidth: "100%",
                }}
                onSelectionChange={(section) => getItemCallback(section.currentKey)}
            >
                <Table.Header columns={columns}>
                    {(column) => (
                        <Table.Column key={column.key}>{column.label}</Table.Column>
                    )}
                </Table.Header>
                <Table.Body items={items} loadingState={isPending}>
                    {(item) => (
                        <Table.Row key={item._id}>
                            {(columnKey) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
                        </Table.Row>
                    )}
                </Table.Body>
                <Table.Pagination
                    shadow
                    noMargin
                    align="center"
                    rowsPerPage={5}
                    onPageChange={(page) => console.log({ page })}
                />
            </Table>
        </div>
    )
};
