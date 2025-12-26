import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"

export default function NavBar() {
    return (
        <nav className="bg-gray-200 h-16 w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-700 pl-6">FocusNOW</h1>

            <div className="flex gap-5 pr-6">
                <Button>Sign-In</Button>
                <Sheet>
                    <SheetTrigger>
                        <Button>View Task</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Your Active Task</SheetTitle>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    )
}