"use client";

import { useEffect, useState } from "react";
import { MODE_TIMES } from "../constant";
import { timerMode } from "../types";
import { usePomodoroContext } from "@/context/PomodoroContext";

export function usePomodoro() {
    const {activeTask, toggleTask, setActiveTaskID} = usePomodoroContext();

    const [mode, setMode] = useState<timerMode>('focus');
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(MODE_TIMES.focus);
    const [progress, setProgress] = useState(0);
    const [showComplete, setShowComplete] = useState(false);

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (activeTask && mode === 'focus') {
                        setShowComplete(true)
                    }

                    setIsActive(false);
                    setTimeLeft(MODE_TIMES[mode])
                }

                return prev - 1
            });
        }, 1000)

        return () => clearInterval(interval);
    }, [isActive, mode, activeTask])

    const handleFinishedTask = () => {
        if (activeTask) {
            toggleTask(activeTask.id)
            setActiveTaskID(null);
        }
        setShowComplete(false);
    }

    useEffect(() => {
        const totalTime = MODE_TIMES[mode]
        const elapsedTime = totalTime - timeLeft
        const newProgress = (elapsedTime / totalTime) * 100

        setProgress(newProgress)
    }, [timeLeft, mode])

    const formatTime = (seconds: number) => {
        const minute = Math.floor(seconds / 60)
        const second = seconds % 60
        return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        if (isActive) {
            const label = mode === 'focus' ? 'Focus' :
                         mode === 'shortBreak' ? 'Short Break' :
                        'Long Break'

            document.title = `[${formatTime(timeLeft)}] - ${label} | FocusNOW`;
        }
        else {
            document.title = 'FocusNOW'
        }

    }, [timeLeft, mode, isActive]);

    const switchMode = (newMode: timerMode) => {
        setMode(newMode);
        setTimeLeft(MODE_TIMES[newMode]);
        setIsActive(false);
    }
    
    const reset = () => {
        setIsActive(false);
        setTimeLeft(MODE_TIMES[mode]);
    }

    return {
        mode,
        timeLeft,
        isActive,
        setIsActive,
        switchMode,
        reset,
        formatTime,
        progress,
        setTimeLeft,
        handleFinishedTask,
        showComplete,
        setShowComplete
    };
}