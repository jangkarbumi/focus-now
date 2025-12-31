"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Task } from "@/components/features/task-management/types";
import { arrayMove } from "@dnd-kit/sortable";
import { timerMode } from "@/components/features/pomodoro/types";
import { MODE_TIMES } from "@/components/features/pomodoro/constant";

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
}

export interface CustomTimeDuration {
    focus: number,
    shortBreak: number,
    longBreak: number
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [task, setTask] = useState<Task[]>([]);
  const [activeTaskID, setActiveTaskID] = useState<string | null>(null);
  const [duration, setDuration] = useState<CustomTimeDuration>({
    focus: MODE_TIMES.focus,
    shortBreak: MODE_TIMES.shortBreak,
    longBreak: MODE_TIMES.longBreak,
  });
  const [mode, setMode] = useState<timerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(MODE_TIMES.focus * 60);
  const [isActive, setIsActive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. LOAD DATA (Hanya sekali saat mount)
  useEffect(() => {
    const savedData = localStorage.getItem("FOCUS_NOW_KEY");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setTask(parsed.task || []);
      setActiveTaskID(parsed.activeTaskID || null);
      if (parsed.duration) {
        setDuration(parsed.duration);
        // Set waktu awal berdasarkan durasi yang disimpan & mode saat ini
        setTimeLeft(parsed.duration[mode] * 60);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. SAVE DATA
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("FOCUS_NOW_KEY", JSON.stringify({ task, activeTaskID, duration }));
    }
  }, [task, activeTaskID, duration, isLoaded]);

  // 3. TIMER LOGIC
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playAlarm();
      setIsActive(false);
      // Reset ke durasi awal mode saat ini setelah alarm
      setTimeLeft(duration[mode] * 60);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, duration]);

  // 4. DOCUMENT TITLE & PROGRESS (Derived State)
  const progress = useMemo(() => {
    const totalSeconds = duration[mode] * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  }, [timeLeft, duration, mode]);

  useEffect(() => {
    if (isActive) {
      const minute = Math.floor(timeLeft / 60).toString().padStart(2, "0");
      const second = (timeLeft % 60).toString().padStart(2, "0");
      const label = mode === "focus" ? "Focus" : mode === "shortBreak" ? "Short Break" : "Long Break";
      document.title = `[${minute}:${second}] - ${label} | FocusNOW`;
    } else {
      document.title = "FocusNOW";
    }
  }, [timeLeft, isActive, mode]);

  // HELPER FUNCTIONS
  const playAlarm = () => {
    const audio = new Audio("/sound/alarm.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => console.log("Audio play blocked:", err));
  };

  const updateDuration = (newDuration: CustomTimeDuration) => {
    setDuration(newDuration);
    // Jika timer sedang tidak jalan, langsung update timeLeft-nya
    if (!isActive) {
        setTimeLeft(newDuration[mode] * 60);
    }
  };

  const toggleTask = (id: string) => {
    setTask((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)));
  };

  const addTask = (title: string) => {
    const newTask: Task = { id: crypto.randomUUID(), title, isCompleted: false, dateCreated: Date.now() };
    setTask([newTask, ...task]);
  };

  const deleteTask = (id: string) => {
    setTask(task.filter((t) => t.id !== id));
    if (activeTaskID === id) setActiveTaskID(null);
  };

  const reorderTask = (activeID: string, overID: string) => {
    setTask((items) => {
      const oldIndex = items.findIndex((t) => t.id === activeID);
      const newIndex = items.findIndex((t) => t.id === overID);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const activeTask = task.find((t) => t.id === activeTaskID);

  return (
    <PomodoroContext.Provider
      value={{
        task, activeTaskID, setActiveTaskID, activeTask, addTask, toggleTask,
        deleteTask, reorderTask, duration, updateDuration, mode, setMode,
        timeLeft, setTimeLeft, isActive, setIsActive, progress
      }}
    >
      {isLoaded ? children : null}
    </PomodoroContext.Provider>
  );
}

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext);
  if (!context) throw new Error("usePomodoroContext must be inside Provider!");
  return context;
};