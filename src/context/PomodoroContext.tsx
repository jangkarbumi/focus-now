"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Task } from "@/components/features/task-management/types";
import { arrayMove } from "@dnd-kit/sortable";
import { timerMode } from "@/components/features/pomodoro/types";
import { MODE_TIMES } from "@/components/features/pomodoro/constant";

export interface CustomTimeDuration {
  focus: number;
  shortBreak: number;
  longBreak: number;
}

interface PomodoroContextType {
  task: Task[];
  activeTaskID: string | null;
  setActiveTaskID: (id: string | null) => void;
  activeTask: Task | undefined;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  reorderTask: (activeID: string, overID: string) => void;
  duration: CustomTimeDuration;
  updateDuration: (newDuration: CustomTimeDuration) => void;
  mode: timerMode;
  setMode: (mode: timerMode) => void;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  progress: number;
  unfocusTask: () => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  // --- STATE ---
  const [isLoaded, setIsLoaded] = useState(false);
  const [task, setTask] = useState<Task[]>([]);
  const [activeTaskID, setActiveTaskID] = useState<string | null>(null);
  const [mode, setMode] = useState<timerMode>("focus");
  const [isActive, setIsActive] = useState(false);

  // Lazy Init Duration: Langsung ambil dari LocalStorage agar tidak kena 1500/300/600
  const [duration, setDuration] = useState<CustomTimeDuration>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("FOCUS_NOW_KEY");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.duration) return parsed.duration;
      }
    }
    return { focus: MODE_TIMES.focus, shortBreak: MODE_TIMES.shortBreak, longBreak: MODE_TIMES.longBreak };
  });

  // Lazy Init TimeLeft
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("FOCUS_NOW_KEY");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.duration) return parsed.duration.focus * 60;
      }
    }
    return MODE_TIMES.focus * 60;
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    const savedData = localStorage.getItem("FOCUS_NOW_KEY");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setTask(parsed.task || []);
      setActiveTaskID(parsed.activeTaskID || null);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("FOCUS_NOW_KEY", JSON.stringify({ task, activeTaskID, duration }));
    }
  }, [task, activeTaskID, duration, isLoaded]);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      const audio = new Audio("/sound/alarm.mp3");
      audio.play().catch(() => {});
      setIsActive(false);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [isActive, timeLeft]);

  // --- DERIVED STATE (Progress & Title) ---
  const progress = useMemo(() => {
    const totalSeconds = duration[mode] * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  }, [timeLeft, duration, mode]);

  useEffect(() => {
    if (isActive) {
      const min = Math.floor(timeLeft / 60).toString().padStart(2, "0");
      const sec = (timeLeft % 60).toString().padStart(2, "0");
      document.title = `[${min}:${sec}] - FocusNOW`;
    } else {
      document.title = "FocusNOW";
    }
  }, [timeLeft, isActive]);

  // --- ACTIONS ---
  const updateDuration = (newDur: CustomTimeDuration) => {
    setDuration(newDur);
    if (!isActive) setTimeLeft(newDur[mode] * 60);
  };

  const addTask = (title: string) => {
    setTask([{ id: crypto.randomUUID(), title, isCompleted: false, dateCreated: Date.now() }, ...task]);
  };

  const toggleTask = (id: string) => {
    setTask(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTask = (id: string) => {
    setTask(prev => prev.filter(t => t.id !== id));
    if (activeTaskID === id) setActiveTaskID(null);
  };

  const reorderTask = (activeID: string, overID: string) => {
    setTask(items => {
      const oldIdx = items.findIndex(t => t.id === activeID);
      const newIdx = items.findIndex(t => t.id === overID);
      return arrayMove(items, oldIdx, newIdx);
    });
  };

  const activeTask = task.find(t => t.id === activeTaskID);
  const unfocusTask = () => setActiveTaskID(null);

  return (
    <PomodoroContext.Provider value={{
      task, activeTaskID, setActiveTaskID, activeTask, addTask, toggleTask,
      deleteTask, reorderTask, duration, updateDuration, mode, setMode,
      timeLeft, setTimeLeft, isActive, setIsActive, progress, unfocusTask
    }}>
      {isLoaded ? children : null}
    </PomodoroContext.Provider>
  );
}

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext);
  if (!context) throw new Error("usePomodoroContext must be inside Provider!");
  return context;
};