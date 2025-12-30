"use client"
import { useState } from "react"
import { usePomodoroContext } from "@/context/PomodoroContext"
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableTask } from "./SortableTask"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function TaskContainer() {
  const [input, setInput] = useState("")
  const { task, addTask, toggleTask, deleteTask, reorderTask, activeTaskID, setActiveTaskID } = usePomodoroContext()

  const sensors = useSensors(useSensor(PointerSensor))

  const handleAdd = () => {
    if (!input.trim()) return
    addTask(input)
    setInput("")
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorderTask(active.id as string, over.id as string)
    }
  }

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex gap-2 mb-4">
        <Input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add new task..." 
        />
        <Button onClick={handleAdd} size="icon"><Plus className="h-4 w-4" /></Button>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={task.map(t => t.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col">
            {task.length === 0 ?
              <p className="text-center text-gray-400 text-[16px]">Yeay! There is no task left</p> :
              <>
                {task.map((task) => (
                  <SortableTask 
                    key={task.id} 
                    task={task} 
                    onToggle={toggleTask} 
                    onDelete={deleteTask} 
                    isActive = {task.id === activeTaskID}
                    onSelect = {() => activeTaskID === task.id ? setActiveTaskID(null) : setActiveTaskID(task.id)}
                  />
                ))}
              </> 
            }

          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}