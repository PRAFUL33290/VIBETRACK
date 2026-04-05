"use client";

import { useStore } from "@/store/useStore";
import { format, parseISO, compareDesc } from "date-fns";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Trash2 } from "lucide-react";

export default function HistoryPage() {
  const moods = useStore((state) => state.moods);
  const deleteMood = useStore((state) => state.deleteMood);

  // Sort moods by date descending
  const sortedMoods = [...moods].sort((a, b) =>
    compareDesc(parseISO(a.date), parseISO(b.date))
  );

  return (
    <div className="container max-w-md mx-auto px-4 pt-12 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
          <CalendarIcon className="text-primary" size={28} />
          History
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Your past entries</p>
      </header>

      {sortedMoods.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
          <div className="text-4xl mb-4 opacity-50">🌱</div>
          <p className="text-muted-foreground">No entries yet.</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Start tracking your mood today!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMoods.map((mood, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={mood.id}
              className="bg-card p-5 rounded-2xl shadow-sm border border-border/50 flex gap-4"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-muted/50 flex flex-col items-center justify-center">
                <span className="text-3xl">{mood.emoji}</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      {format(parseISO(mood.date), "EEEE, MMM d")}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">
                        Intensity: {mood.intensity}/5
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMood(mood.id)}
                    className="p-2 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                    aria-label="Delete entry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {mood.note && (
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80 bg-muted/30 p-3 rounded-xl">
                    "{mood.note}"
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
