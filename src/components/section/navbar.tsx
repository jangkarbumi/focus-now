import { Button } from "../ui/button"
import { UserRound, LogOutIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"

import { TaskContainer } from "../features/task-management/components/TaskContainer"

export default function NavBar() {
    return (
        <nav className="bg-gray-200 h-16 w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-700 pl-6">FocusNOW</h1>

            <div className="flex gap-5 pr-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>View Task</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Your Active Task</SheetTitle>
                        </SheetHeader>

                        <TaskContainer />
                    </SheetContent>
                </Sheet>

                <Popover>
                    <PopoverTrigger>
                        <Button>
                            <UserRound/>
                            <span>jangkarbumi</span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-64">
                        <div className="flex flex-col gap-4 items-center">
                            <Button className="w-32">
                                Profile
                            </Button>

                            <Button className="w-32 bg-red-500 hover:bg-red-400">
                                <LogOutIcon/>
                                <span>Log-out</span>
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </nav>
    )
}