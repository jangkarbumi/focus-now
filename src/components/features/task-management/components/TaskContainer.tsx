"use client"

import { useState } from "react"
import { useTask } from "../hooks/useTask"
import { formatShortDate } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

export function TaskContainer() {
    const [input, setInput] = useState("")
    const {
        task,
        addTask,
        toggleTask,
        deleteTask,
        isLoaded,
    } = useTask();

    const handleAdd = () => {
        if (!input.trim()) return;
        addTask(input);
        setInput("");
    }

    if (!isLoaded) {
        return <p className="text-center text-gray-400 mt-10">Loading....</p>
    }

    return (
        <div className="flex flex-col gap-4 mt-6 h-full">
            <div className="flex gap-2">
                <Input
                    placeholder="Is there anything to be done?"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                />

                <Button size='icon' onClick={handleAdd}>
                    <Plus className="h-4 2-4" />
                </Button>
            </div>

            <ScrollArea className="h-[70vh] pr-4">
                {task.length === 0 ? (
                    <p className="text-center text-gray-400 mt-10">There is no task today!</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {task.map(task => (
                            <div key={task.id} className="flex items-center justify between p-3 gap-4 border rounded-lg bg-white shadow-sm">
                                <div className="flex items-center gap-5">
                                    <Checkbox
                                        checked={task.isCompleted}
                                        onCheckedChange={() => toggleTask(task.id)}
                                    />
                                    <div className="flex flex-col">
                                        <span className={task.isCompleted ? "line-through text-gray-400" : ""}>{task.title}</span>
                                        <span className="text-[10px] text-gray-500">{formatShortDate(task.dateCreated)}</span>
                                    </div>
                                </div>

                                <Button variant='ghost' size='icon' onClick={() => deleteTask(task.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}