'use client';

import React, {createContext, useContext, useState, useEffect} from "react";
import { Task } from "@/components/features/task-management/types";
import { arrayMove } from "@dnd-kit/sortable";
import { timerMode } from "@/components/features/pomodoro/types";
import { MODE_TIMES } from "@/components/features/pomodoro/constant";

interface pomodoroContextType {
    task: Task[],
    activeTaskID: string | null,
    setActiveTaskID: (id: string | null) => void,
    addTask: (title: string) => void,
    toggleTask: (id: string) => void,
    deleteTask: (id: string) => void,
    reorderTask: (activeID: string, overID: string) => void,
    activeTask: Task | undefined,
    unfocusTask: (id: string) => void
    duration: CustomTimeDuration,
    updateDuration: (newDuration: CustomTimeDuration) => void
    mode: timerMode,
    setMode: (mode: timerMode) => void,
    timeLeft: number,
    setTimeLeft: React.Dispatch<React.SetStateAction<number>>,
    isActive: boolean,
    setIsActive: (active: boolean) => void
}

export interface CustomTimeDuration {
    focus: number,
    shortBreak: number,
    longBreak: number
}

const PomodoroContext = createContext<pomodoroContextType | undefined>(undefined);

export function PomodoroProvider({children}: {children: React.ReactNode}) {
    const [task, setTask] = useState<Task[]>([]);
    const [activeTaskID, setActiveTaskID] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [duration, setDuration] = useState<CustomTimeDuration>({
        focus: MODE_TIMES.focus,
        shortBreak: MODE_TIMES.shortBreak,
        longBreak: MODE_TIMES.longBreak,
    })

    //STATE TIMER
    const [mode, setMode] = useState<timerMode>('focus')
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)

    //MOUNTED
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('FOCUS_NOW_KEY');

        if (savedData) {
            const parsed = JSON.parse(savedData);
            const {task: savedTask, activeTaskID: savedActiveID} = parsed;
            setTask(savedTask || []);
            setActiveTaskID(savedActiveID || null);
            setDuration(parsed.duration || {focus: 25, shortBreak: 5, longBreak: 10})
            setTimeLeft(duration.focus * 60)
        }
        setIsLoaded(true);
        setHasMounted(true);
    }, [duration])

    useEffect(() => {
        if (isLoaded && hasMounted) {
            localStorage.setItem('FOCUS_NOW_KEY', JSON.stringify({task, activeTaskID, duration}));
        };
    }, [task, activeTaskID, isLoaded, duration, hasMounted])

    const updateDuration = (newDuration: CustomTimeDuration) => {
        setDuration(newDuration);
    }


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

    //ALARM PLAY
    const playAlarm = () => {
        const audio = new Audio("/sound/alarm.mp3")
        audio.volume = 1;
        audio.play().catch(err => console.log('cannot play audio: ', err));
    }

    //USE EFFECT TIMER
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && timeLeft > 0) {
        interval = setInterval(() => {
            setTimeLeft((prev) =>  {
                if (prev <= 1) {
                    playAlarm();
                    setIsActive(false);
                    return duration[mode] * 60
                }

                return prev -1
            })
        }, 1000);
        }

        if (timeLeft === 0 && isActive) {
            playAlarm();
            setIsActive(false);
            setTimeLeft(duration[mode] * 60); 
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, duration, mode]);

    const reorderTask = (activeID: string, overID: string) => {
        setTask(items => {
            const oldIndex = items.findIndex(t => t.id === activeID)
            const newIndex = items.findIndex(t => t.id === overID)
            return arrayMove(items, oldIndex, newIndex)
        })
    }

    const unfocusTask = (id: string) => {
        setActiveTaskID(null);
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
            activeTask,
            unfocusTask,
            updateDuration,
            duration,
            mode,
            setMode,
            timeLeft,
            setTimeLeft,
            isActive,
            setIsActive
        }}>
            {!hasMounted ? null : children}
        </PomodoroContext.Provider>
    )
}

//CUSTOM HOOK
export const usePomodoroContext = () => {
    const context = useContext(PomodoroContext);
    if (!context) throw new Error('usePomodoroContext must be inside Provider!');
    return context;
}