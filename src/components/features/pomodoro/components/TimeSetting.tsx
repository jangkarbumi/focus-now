'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { usePomodoro } from "../hooks/usePomodoro";

export function TimeSetting() {
    const {handleSaveNewDuration, isOpen, setIsOpen, setTempDuration, tempDuration, mode} = usePomodoro()

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <Button variant='outline' size='icon'>
                    <Settings2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Custom Input</DialogTitle>
                <DialogHeader>Input Your Custom Time</DialogHeader>
                
                <div>
                    <Input 
                    id="focus" type="number" className="col-span-3" 
                    value={tempDuration[mode]} 
                    onChange={(e) => setTempDuration({...tempDuration, [mode]: Math.max(0, Number(e.target.value))})}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveNewDuration()}
                    />
                </div>

                <DialogFooter>
                    <Button onClick={handleSaveNewDuration}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}