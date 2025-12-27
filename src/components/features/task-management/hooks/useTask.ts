import { useEffect, useState } from "react";
import { Task } from "../types";

//STORAGE KEY
const storageKey = 'FOCUS_NOW_KEY';

export const useTask = () => {
    const [task, setTask] = useState<Task[]>([]);

    const [isLoaded, setIsLoaded] = useState(false);

    //LOAD DATA
    useEffect(() => {
        const savedTask = localStorage.getItem(storageKey)

        if(savedTask) {
            try {
                setTask(JSON.parse(savedTask))
            }
            catch (error) {
                console.error("GAGAL MEMBACA DATA", error);
            }
        }
        setIsLoaded(true);
    }, [])

    //SAVE DATA
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(storageKey, JSON.stringify(task));
        }
    }, [task, isLoaded])

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

    return { task, addTask, toggleTask, deleteTask, isLoaded }
}