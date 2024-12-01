"use client";
import { journalSchema } from "@/app/lib/schema";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import "react-quill-new/dist/quill.snow.css";
import { BarLoader } from "react-spinners";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const JournalEntryPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: "",
      content: "",
      mood: "",
      collectionId: "",
    },
  });

  const isLoading = false;

  return (
    <div className="py-8">
      <form>
        <h1 className="text-5xl md:text-6xl title-gradient">
          Whats on your mind?
        </h1>
        {isLoading && <BarLoader color="orange" width={"100%"} />}
        <div className="space-y-2">
          <label className="text-sm font-md">Title</label>
          <Input
            {...register("title")}
            placeholder="Enter title"
            className={`py-5 md:text-md ${
              errors.title ? "border-red-500" : ""
            }`}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-md">How are you feeling?</label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>
    </div>
  );
};

export default JournalEntryPage;
