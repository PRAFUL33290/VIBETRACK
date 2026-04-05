"use client";

import { useStore } from "@/store/useStore";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function HabitList() {
  const habits = useStore((state) => state.habits);
  const toggleHabit = useStore((state) => state.toggleHabit);
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Daily Habits</h2>
        <span className="text-sm text-muted-foreground">{format(new Date(), "MMM d, yyyy")}</span>
      </div>

      <div className="space-y-3">
        {habits.map((habit) => {
          const isCompleted = habit.completedDates.includes(today);

          return (
            <motion.button
              whileTap={{ scale: 0.98 }}
              key={habit.id}
              onClick={() => toggleHabit(habit.id, today)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                isCompleted
                  ? "bg-primary/10 border-primary/30"
                  : "bg-muted/30 border-transparent hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-lg shadow-sm">
                  {habit.icon}
                </div>
                <span className={cn("font-medium", isCompleted && "text-primary")}>
                  {habit.name}
                </span>
              </div>
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/30"
                )}
              >
                {isCompleted && <Check size={14} strokeWidth={3} />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
