import { timerMode } from "./types";

export const MODE_TIMES: Record<timerMode, number> = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 10 * 60,
}