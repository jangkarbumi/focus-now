"use client"

import { Card, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Play, Pause, RotateCcw } from "lucide-react"

import { useEffect, useState } from "react"

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const modeTimes = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 10 * 60
}

export default function Timer() {
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(modeTimes.focus);
    const [isActive, setIsActive] = useState(false);

    const formatTime = (seconds: number) => {
        const minute = Math.floor(seconds / 60)
        const second = seconds % 60
        return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
            if (prev <= 1) {
                setIsActive(false);
                return 0;
            }
            return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive]);

    useEffect(() => {
        const modeLabel = 
                mode === 'focus' ? 'Focus' :
                mode === 'shortBreak' ? 'Short Break' :
                'Long Break';
        
        document.title = `[${formatTime(timeLeft)}] - ${modeLabel} | FocusNOW`
    }, [timeLeft, mode])

    const switchMode = (newMode: TimerMode) => {
        setMode(newMode)
        setTimeLeft(modeTimes[newMode])
        setIsActive(false)
    }

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(modeTimes[mode])
    }

return (
    <div className="flex justify-center items-center mt-20">
      <Card className="w-[400px] shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center">
          <div className="flex justify-center gap-2 mb-4">
            <Button 
              variant={mode === 'focus' ? "default" : "outline"} 
              size="sm"
              onClick={() => switchMode('focus')}
            >
              Focus
            </Button>
            <Button 
              variant={mode === 'shortBreak' ? "default" : "outline"} 
              size="sm"
              onClick={() => switchMode('shortBreak')}
            >
              Short Break
            </Button>
            <Button 
              variant={mode === 'longBreak' ? "default" : "outline"} 
              size="sm"
              onClick={() => switchMode('longBreak')}
            >
              Long Break
            </Button>
          </div>
          <CardTitle className="text-8xl font-bold tracking-tighter text-gray-800">
            {formatTime(timeLeft)}
          </CardTitle>
        </CardHeader>
        
        <CardFooter className="flex justify-center gap-4 pb-8">
          <Button 
            size="lg" 
            className="w-32 text-lg"
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          
          <Button size="icon" variant="outline" onClick={resetTimer}>
            <RotateCcw className="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}