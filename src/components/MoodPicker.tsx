"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const emojis = ["😭", "😔", "😐", "🙂", "🤩"];

export function MoodPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("🙂");
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState("");
  const addMood = useStore((state) => state.addMood);

  const handleSave = () => {
    addMood({
      date: format(new Date(), "yyyy-MM-dd"),
      emoji: selectedEmoji,
      intensity,
      note,
    });
    setIsOpen(false);
    setNote("");
    setIntensity(3);
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <h2 className="text-xl font-semibold mb-4">How are you feeling?</h2>

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary-foreground font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span>Log your mood</span>
          <span className="text-xl">✨</span>
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center bg-muted/50 p-4 rounded-full">
            {emojis.map((emoji, index) => (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(emoji)}
                className={cn(
                  "text-3xl transition-transform hover:scale-110",
                  selectedEmoji === emoji ? "scale-125 drop-shadow-md" : "opacity-50 grayscale"
                )}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex justify-between">
              <span>Intensity</span>
              <span>{intensity}/5</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Add a note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What made you feel this way?"
              className="w-full p-3 rounded-xl bg-muted/50 border-none focus:ring-2 focus:ring-primary/50 resize-none h-24"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-medium hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              Save Mood
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
