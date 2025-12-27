import { useState } from "react";
import { Task } from "../types";

export const useTask = () => {
    const [task, setTask] = useState<Task[]>([]);

    const addTask = (title: string) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            isCompleted: false,
            dateCreated: Date.now(),
        };
        setTask(prev => [newTask, ...prev]);
    }

    const toggleTask = (id: string) => {
        setTask(prev => prev.map(t => (t.id === id ? {...t, isCompleted: !t.isCompleted} : t)))
    }

    const deleteTask = (id: string) => {
        setTask(prev => prev.filter(t => t.id !== id))
    }

    return { task, addTask, toggleTask, deleteTask }
}