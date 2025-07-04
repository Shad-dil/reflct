"use client";
import { getAnalytics } from "@/actions/analytics";
import { getMoodById, getMoodTrend } from "@/app/lib/moods";
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
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

  const CustomToolTip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium">{format(parseISO(label), "MMM d")}</p>
          <p className="text-orange-600">Average Mood: {payload[0].value}</p>
          <p className="text-blue-600">Entries {payload[1].value}</p>
        </div>
      );
    }
  };

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
                Mood Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                {getMoodById(stats.mostFrequentMood)?.emoji || "❓"}{" "}
                {getMoodTrend(stats.averageScore)}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Chart  */}
        <Card>
          <CardHeader>
            <CardTitle>Mood Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={timeline}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    // tickFormatter={(date) => format(parseISO(date), "MMM d")}
                  />
                  <YAxis yAxisId={"left"} domain={[0, 10]} />
                  <YAxis
                    yAxisId={"right"}
                    domain={[0, 10]}
                    orientation="right"
                  />
                  <Tooltip content={<CustomToolTip />} />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="averageScore"
                    stroke="#f97316"
                    yAxisId="left"
                    name="Average Mood"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="entryCount"
                    stroke="#3b82f6"
                    name="Number of Entries"
                    strokeWidth={2}
                    yAxisId="right"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MoodAnalytics;
