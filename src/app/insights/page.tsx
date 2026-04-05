"use client";

import { useStore } from "@/store/useStore";
import { format, subDays, parseISO, isSameDay } from "date-fns";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart2, TrendingUp, Zap } from "lucide-react";
import { useMemo } from "react";

export default function InsightsPage() {
  const moods = useStore((state) => state.moods);
  const habits = useStore((state) => state.habits);

  // Generate last 7 days data
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, "yyyy-MM-dd");

      const dayMoods = moods.filter((m) => m.date === dateStr);
      const avgIntensity = dayMoods.length > 0
        ? dayMoods.reduce((sum, m) => sum + m.intensity, 0) / dayMoods.length
        : null;

      data.push({
        name: format(date, "EEE"),
        fullDate: dateStr,
        intensity: avgIntensity,
      });
    }
    return data;
  }, [moods]);

  // Calculate habit streaks
  const habitStats = useMemo(() => {
    return habits.map(habit => {
      let streak = 0;
      let i = 0;
      // Simple streak calculation (looking back from today)
      while(true) {
        const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd");
        if (habit.completedDates.includes(dateStr)) {
          streak++;
          i++;
        } else if (i === 0) {
          // If not completed today, check yesterday to keep streak alive
          i++;
        } else {
          break;
        }
      }
      return { ...habit, streak };
    }).sort((a, b) => b.streak - a.streak);
  }, [habits]);

  const recentAvgMood = useMemo(() => {
    const recent = chartData.filter(d => d.intensity !== null);
    if (recent.length === 0) return 0;
    const sum = recent.reduce((acc, curr) => acc + (curr.intensity || 0), 0);
    return sum / recent.length;
  }, [chartData]);

  let message = "Keep tracking to see your insights!";
  if (recentAvgMood >= 4) message = "You've been feeling great lately! Keep that positive energy going. ✨";
  else if (recentAvgMood >= 3) message = "You're having a balanced week. Remember to take time for yourself. 🌿";
  else if (recentAvgMood > 0) message = "It seems like a tough week. Be kind to yourself, things will get better. 💙";

  return (
    <div className="container max-w-md mx-auto px-4 pt-12 pb-24 space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
          <BarChart2 className="text-primary" size={28} />
          Insights
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Your weekly summary</p>
      </header>

      {/* Motivating Message */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/20 rounded-full text-primary">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground mb-1">Weekly Vibe</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </div>

      {/* Mood Chart */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold flex items-center gap-2">
            <TrendingUp size={18} className="text-muted-foreground" />
            Mood Trend
          </h2>
          {recentAvgMood > 0 && (
            <span className="text-xs font-medium px-2 py-1 bg-secondary/20 text-secondary-foreground rounded-md">
              Avg: {recentAvgMood.toFixed(1)}/5
            </span>
          )}
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                dy={10}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 500 }}
                formatter={(value: any) => [`${value}/5`, 'Intensity']}
              />
              <Area
                type="monotone"
                dataKey="intensity"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIntensity)"
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Habit Streaks */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
        <h2 className="font-semibold mb-4">Current Streaks</h2>
        <div className="space-y-3">
          {habitStats.map(habit => (
            <div key={habit.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-xl">{habit.icon}</span>
                <span className="font-medium text-sm">{habit.name}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-background rounded-full border border-border shadow-sm">
                <span className="text-orange-500">🔥</span>
                <span className="font-bold text-sm">{habit.streak}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
