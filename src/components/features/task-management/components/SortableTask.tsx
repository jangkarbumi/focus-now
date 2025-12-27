"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { GripVertical, Trash2 } from "lucide-react"
import { Task } from "../types"

interface Props {
    task: Task
    onToggle: (id: string) => void
    onDelete: (id: string) => void
}

export function SortableTask({ task, onToggle, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 border rounded-lg bg-white mb-2 shadow-sm transition-shadow ${
        isDragging ? "opacity-50 shadow-xl border-primary ring-1 ring-primary" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing hover:bg-gray-100 p-1 rounded text-gray-400"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <Checkbox 
          checked={task.isCompleted} 
          onCheckedChange={() => onToggle(task.id)} 
        />
        
        <span className={`text-sm font-medium ${task.isCompleted ? "line-through text-gray-400" : ""}`}>
          {task.title}
        </span>
      </div>

      <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  )
}