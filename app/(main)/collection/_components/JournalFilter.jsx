"use client";

import { MOODS } from "@/app/lib/moods";
import EntryCard from "@/components/EntryCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SelectItem } from "@radix-ui/react-select";
import { format, isSameDay } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";

const JournalFilter = ({ entries }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [date, setDate] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState(entries);

  useEffect(() => {
    let filtered = entries;
    const query = searchQuery.toLowerCase();
    if (searchQuery) {
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query)
      );
    }
    if (selectedMood) {
      filtered = filtered.filter((entry) => entry.mood === selectedMood);
    }
    if (date) {
      filtered = filtered.filter((entry) =>
        isSameDay(new Date(entry.createdAt), date)
      );
    }
    setFilteredEntries(filtered);
  }, [entries, searchQuery, selectedMood, date]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMood("");
    setDate(null);
  };
  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search Entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            prefix={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <Select value={selectedMood} onValueChange={setSelectedMood}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Mood..." />
          </SelectTrigger>
          <SelectContent>
            {Object.values(MOODS).map((mood) => {
              return (
                <SelectItem
                  value={mood.id}
                  key={mood.id}
                  className="flex items-center gap-2"
                >
                  <span>
                    {mood.emoji} {mood.label}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {(searchQuery || selectedMood || date) && (
          <Button
            className="text-orange-600"
            variant="ghost"
            onClick={clearFilters}
          >
            Clear Filter
          </Button>
        )}
      </div>
      <div>
        Showing {filteredEntries.length} of {entries.length} entries
      </div>
      {filteredEntries.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500">No Entries Found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </>
  );
};

export default JournalFilter;
