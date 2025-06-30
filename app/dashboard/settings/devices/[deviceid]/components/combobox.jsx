"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { fetchFileTypes } from '../server-side'

export function ComboboxDemo({ name, status }) {
    const [comboboxData, setComboboxData] = useState([])
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(name || "")

    // console.log('name', name);
    // console.log('status', status);

    useEffect(() => {
        const fetchFileCategories = async () => {
            try {
                const response = await fetchFileTypes()
                // Remove duplicates by name and value
                const seen = new Set()
                const data = response
                    .filter(item => {
                        const key = `${item.name}-${item.index}`
                        if (seen.has(key)) return false
                        seen.add(key)
                        return true
                    })
                    .map((item, idx) => ({
                        index: idx + 1,
                        label: item.name,
                        value: item.name,
                    }))
                setComboboxData(data)
            } catch (error) {
                setComboboxData([])
            }
        }
        fetchFileCategories()
    }, [])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? comboboxData.find((data) => data.value === value)?.label
                        : "Select file type..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search file type..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No file type found.</CommandEmpty>
                        <CommandGroup>
                            {comboboxData.map((item) => (
                                <CommandItem
                                    key={`${item.value}-${item.index}`}
                                    value={item.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {item.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === item.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
