"use client";

import { useEffect, useState } from "react";
import { timerMode } from "../types";
import { usePomodoroContext } from "@/context/PomodoroContext";

export function usePomodoro() {
    const {activeTask, toggleTask, setActiveTaskID, duration, updateDuration,
           mode, setMode, timeLeft, setTimeLeft, isActive, setIsActive
    } = usePomodoroContext();

    const [progress, setProgress] = useState(0);
    const [showComplete, setShowComplete] = useState(false);
    const [tempDuration, setTempDuration] = useState(duration);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setTempDuration(duration)
    }, [duration])

    const handleFinishedTask = () => {
        if (activeTask) {
            toggleTask(activeTask.id)
            setActiveTaskID(null);
        }
        setShowComplete(false);
    }

    useEffect(() => {
        const totalTime = duration[mode] * 60
        const elapsedTime = totalTime - timeLeft
        const newProgress = (elapsedTime / totalTime) * 100

        setProgress(newProgress)
    }, [timeLeft, mode, duration])

    useEffect(() => {
        if (timeLeft === 0 && mode === 'focus' && activeTask) {
        setShowComplete(true);
        }
    }, [timeLeft, mode, activeTask]);

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
        setTimeLeft(duration[newMode]);
        setIsActive(false);
    }
    
    const reset = () => {
        setIsActive(false);
        setTimeLeft(duration[mode] * 60);
    }

    const handleSaveNewDuration = () => {
        updateDuration(tempDuration);
        setIsOpen(false);
    }

    useEffect(() => {
        const newTime = mode === 'focus' ? duration.focus :
                        mode === 'shortBreak' ? duration.shortBreak :
                        duration.longBreak
        
        setTimeLeft(newTime * 60)
    }, [duration, mode, setTimeLeft])

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
        setShowComplete,
        handleSaveNewDuration,
        tempDuration,
        setTempDuration,
        isOpen,
        setIsOpen
    };
}