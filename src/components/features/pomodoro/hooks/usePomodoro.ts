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

  // Sync tempDuration hanya saat modal dibuka atau durasi asli berubah
  useEffect(() => {
    setTempDuration(duration);
  }, [duration, isOpen]);

  // Munculkan modal selesai
  useEffect(() => {
    if (timeLeft === 0 && mode === 'focus' && activeTask) {
      setShowComplete(true);
    }
  }, [timeLeft, mode, activeTask]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

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
  };

  const handleFinishedTask = () => {
    if (activeTask) {
      toggleTask(activeTask.id);
      setActiveTaskID(null);
    }
    setShowComplete(false);
  };

  return {
    mode, timeLeft, isActive, setIsActive, switchMode, reset,
    formatTime, progress, setTimeLeft, handleFinishedTask,
    showComplete, setShowComplete, handleSaveNewDuration,
    tempDuration, setTempDuration, isOpen, setIsOpen
  };
}