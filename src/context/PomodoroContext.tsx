'use client';

import React, {createContext, useContext, useState, useEffect} from "react";
import { Task } from "@/components/features/task-management/types";
import { arrayMove } from "@dnd-kit/sortable";

interface pomodoroContextType {
    task: Task[],
    activeTaskID: string | null,
    setActiveTaskID: (id: string | null) => void,
    addTask: (title: string) => void,
    toggleTask: (id: string) => void,
    deleteTask: (id: string) => void,
    reorderTask: (activeID: string, overID: string) => void,
    activeTask: Task | undefined
}

const PomodoroContext = createContext<pomodoroContextType | undefined>(undefined);

export function PomodoroProvider({children}: {children: React.ReactNode}) {
    const [task, setTask] = useState<Task[]>([]);
    const [activeTaskID, setActiveTaskID] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);


    useEffect(() => {
        const savedData = localStorage.getItem('FOCUS_NOW_KEY');

        if (savedData) {
            const {task: savedTask, activeTaskID: savedActiveID} = JSON.parse(savedData);
            setTask(savedTask || []);
            setActiveTaskID(savedActiveID || null);
        }
        setIsLoaded(true);
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('FOCUS_NOW_KEY', JSON.stringify({task, activeTaskID}));
        };
    }, [task, activeTaskID, isLoaded])


    const toggleTask = (id: string) => {
        setTask(task.map(t => t.id === id ? {...t, isCompleted: !t.isCompleted} : t))
    }

    const addTask = (title: string) => {
        const newTask: Task = {id: crypto.randomUUID(), title, isCompleted: false, dateCreated: Date.now()}
        setTask([newTask, ...task])
    }

    const deleteTask = (id: string) => {
        setTask(task.filter(t => t.id !== id));
        if (activeTaskID === id) setActiveTaskID(null);
    }

    const activeTask = task.find(t => t.id === activeTaskID);

    const reorderTask = (activeID: string, overID: string) => {
        setTask(items => {
            const oldIndex = items.findIndex(t => t.id === activeID)
            const newIndex = items.findIndex(t => t.id === overID)
            return arrayMove(items, oldIndex, newIndex)
        })
    }

    return (
        <PomodoroContext.Provider value={{
            task,
            activeTaskID,
            setActiveTaskID,
            addTask,
            toggleTask,
            deleteTask,
            reorderTask,
            activeTask
        }}>
            {children}
        </PomodoroContext.Provider>
    )
}

//CUSTOM HOOK
export const usePomodoroContext = () => {
    const context = useContext(PomodoroContext);
    if (!context) throw new Error('usePomodoroContext must be inside Provider!');
    return context;
}