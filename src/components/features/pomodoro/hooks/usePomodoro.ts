"use client";

import { useEffect, useState } from "react";
import { MODE_TIMES } from "../constant";
import { timerMode } from "../types";

export function usePomodoro() {
    const [mode, setMode] = useState<timerMode>('focus');
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(MODE_TIMES.focus);

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsActive(false);
                    return 0;
                }

                return prev - 1
            });
        }, 1000)

        return () => clearInterval(interval);
    }, [isActive])

    useEffect(() => {
        const label = mode === 'focus' ? 'Focus' :
                      mode === 'shortBreak' ? 'Short Break' :
                      'Long Break'

        document.title = `[${timeLeft}] - ${label} | FocusNOW`;
    }, [timeLeft, mode]);

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
    };
}