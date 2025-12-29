"use client"

import { Card, CardHeader, CardTitle, CardFooter } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Play, Pause, RotateCcw } from "lucide-react"

import { usePomodoro } from "../hooks/usePomodoro";
import { timerMode } from "../types";
import { usePomodoroContext } from "@/context/PomodoroContext";

export default function Timer() {

const { activeTask} = usePomodoroContext();
const {
  mode,
  timeLeft,
  isActive,
  setIsActive,
  switchMode,
  reset,
  formatTime
} = usePomodoro()

return (
    <div className="flex justify-center items-center mt-20">
      
      <div className="">
        <div className="text-center mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="text-xs font-bold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full">
            Current Focus
          </span>
          <h2 className="text-2xl font-semibold text-gray-800 mt-2">
            {activeTask ? activeTask.title : "Ready to focus?"}
          </h2>
          {!activeTask && (
            <p className="text-sm text-gray-400 mt-1">Select a task from your list to start</p>
          )}
        </div>

        <Card className="w-[400px] shadow-xl border-t-4 border-t-primary">
          <CardHeader className="text-center">
            <div className="flex justify-center gap-2 mb-4">
              {(['focus', 'shortBreak', 'longBreak'] as timerMode[]).map(m => (
                <Button
                  key={m}
                  size='sm'
                  variant={mode === m ? 'default' : 'outline'}
                  onClick={() => switchMode(m)}
                >
                  {m === 'focus' ? "Focus" : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </Button>
              ))}

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
            
            <Button size="icon" variant="outline" onClick={reset}>
              <RotateCcw className="h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}