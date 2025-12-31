"use client";

import { useState, useEffect } from "react";
import { timerMode } from "../types";
import { usePomodoroContext } from "@/context/PomodoroContext";

export function usePomodoro() {
    const {
        activeTask, toggleTask, setActiveTaskID, duration, updateDuration,
        mode, setMode, timeLeft, setTimeLeft, isActive, setIsActive, progress
    } = usePomodoroContext();

    const [showComplete, setShowComplete] = useState(false);
    const [tempDuration, setTempDuration] = useState(duration);
    const [isOpen, setIsOpen] = useState(false);

    // Sync tempDuration saat durasi di context berubah (misal saat load storage)
    useEffect(() => {
        setTempDuration(duration);
    }, [duration]);

    // Deteksi task selesai
    useEffect(() => {
        if (timeLeft === 0 && mode === 'focus' && activeTask) {
            setShowComplete(true);
        }
    }, [timeLeft, mode, activeTask]);

    const handleFinishedTask = () => {
        if (activeTask) {
            toggleTask(activeTask.id);
            setActiveTaskID(null);
        }
        setShowComplete(false);
    };

    const formatTime = (seconds: number) => {
        const minute = Math.floor(seconds / 60);
        const second = seconds % 60;
        return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    };

    const switchMode = (newMode: timerMode) => {
        setMode(newMode);
        setTimeLeft(duration[newMode] * 60); // Pastikan dikali 60
        setIsActive(false);
    };
    
    const reset = () => {
        setIsActive(false);
        setTimeLeft(duration[mode] * 60);
    };

    const handleSaveNewDuration = () => {
        updateDuration(tempDuration);
        setIsOpen(false);
    };

    return {
        mode, timeLeft, isActive, setIsActive, switchMode, reset,
        formatTime, progress, setTimeLeft, handleFinishedTask,
        showComplete, setShowComplete, handleSaveNewDuration,
        tempDuration, setTempDuration, isOpen, setIsOpen
    };
}