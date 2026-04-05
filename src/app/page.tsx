import { MoodPicker } from "@/components/MoodPicker";
import { HabitList } from "@/components/HabitList";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="container max-w-md mx-auto px-4 pt-12 pb-24">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            VibeTrack
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">How are you today?</p>
        </div>
        <ThemeToggle />
      </header>

      <MoodPicker />
      <HabitList />
    </div>
  );
}
