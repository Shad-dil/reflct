"use client";
import { getAnalytics } from "@/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import AnalyticsLoading from "./AnalyticsLoading";

const timeOptions = [
  { value: "7d", label: "Last 7 Days" },
  { value: "15d", label: "Last 15 Days" },
  { value: "30d", label: "Last 30 Days" },
];

const MoodAnalytics = () => {
  const [period, setPeriod] = useState("7d");
  const {
    loading,
    data: analytics,
    fn: fetchAnalytics,
  } = useFetch(getAnalytics);

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);
  const { isLoaded } = useUser();

  if (loading || !analytics?.data || !isLoaded) {
    return <AnalyticsLoading />;
  }

  const { stats, timeline } = analytics.data;
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-5xl font-bold title-gradient">Dashboard</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((option) => {
              return (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl  font-bold">{stats.totalEntries}</p>
              <p className="text-xs text-muted-foreground">
                ~{stats.dailyAverage} Entries Per Day
              </p>
            </CardContent>
          </Card>
          {/* Average Mood  */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Average Mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl  font-bold">{stats.totalEntries}/10</p>
              <p className="text-xs text-muted-foreground">
                Overall Mood Score
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl  font-bold">{stats.totalEntries}</p>
              <p className="text-xs text-muted-foreground">
                ~{stats.dailyAverage} Entries Per Day
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MoodAnalytics;
