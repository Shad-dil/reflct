"use client";
import { createCollection, getCollection } from "@/actions/collection";
import {
  createjournalEntry,
  getDraft,
  getJournalEntry,
  saveDraft,
  updateJournalEntry,
} from "@/actions/journal";
import { getMoodById, MOODS } from "@/app/lib/moods";
import { journalSchema } from "@/app/lib/schema";
import CollectionForm from "@/components/CollectionForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "react-quill-new/dist/quill.snow.css";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const JournalEntryPage = () => {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const {
    data: existingEntry,
    loading: entryLoading,
    fn: fetchEntry,
  } = useFetch(getJournalEntry);

  const {
    data: draftData,
    loading: draftLoading,
    fn: fetchDraft,
  } = useFetch(getDraft);

  const { loading: savingDraft, fn: saveDraftFn } = useFetch(saveDraft);
  const {
    data: actionResult,
    loading: actionLoading,
    fn: actionFn,
  } = useFetch(isEditMode ? updateJournalEntry : createjournalEntry);
  const {
    data: collections = [],
    loading: collectionsLoading,
    fn: fetchCollections,
  } = useFetch(getCollection);

  const {
    data: createdCollection,
    loading: createCollectionLoading,
    fn: createCollectionFn,
  } = useFetch(createCollection);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
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

  const router = useRouter();

  useEffect(() => {
    fetchCollections();
    if (editId) {
      setIsEditMode(true);
      fetchEntry();
    } else {
      setIsEditMode(false);
      fetchDraft();
    }
  }, [editId]);

  useEffect(() => {
    if (isEditMode && existingEntry) {
      reset({
        title: existingEntry.title || "",
        content: existingEntry.content || "",
        mood: existingEntry.mood || "",
        collectionId: existingEntry.collectionId,
      });
    } else if (draftData?.success && draftData?.data) {
      reset({
        title: draftData.data.title || "",
        content: draftData.data.content || "",
        mood: draftData.data.mood || "",
        collectionId: "",
      });
    } else {
      reset({
        title: "",
        content: "",
        mood: "",
        collectionId: "",
      });
    }
  }, [draftData, isEditMode, existingEntry]);

  useEffect(() => {
    if (actionResult && !actionLoading) {
      if (!isEditMode) {
        saveDraftFn({ title: "", content: "", mood: "" });
      }
      router.push(
        `/collection/${
          actionResult.collectionId ? actionResult.collectionId : "unorganized"
        }`
      );
      toast.success(
        `Entry ${isEditMode ? "Updated" : "Created"} Successfully !`
      );
    }
  }, [actionResult, actionLoading]);

  const onSubmit = handleSubmit(async (data) => {
    // Handle form submission
    const mood = getMoodById(data.mood);
    actionFn({
      ...data,
      moodScore: mood.score,
      moodQuery: mood.pixabayQuery,
      ...(isEditMode && { id: editId }),
    });
  });

  useEffect(() => {
    if (createdCollection) {
      setIsCollectionDialogOpen(false);
      fetchCollections();
      setValue("collectionId", createCollection.id);
      toast.success(`Collection ${createdCollection.name} is created`);
    }
  }, [createdCollection]);

  const handleCreateCollection = async (data) => {
    createCollectionFn(data);
  };
  const isLoading =
    actionLoading ||
    collectionsLoading ||
    entryLoading ||
    draftLoading ||
    savingDraft;
  return (
    <div className="py-8">
      <form className="space-y-2 mx-auto" onSubmit={onSubmit}>
        <h1 className="text-5xl md:text-6xl title-gradient">
          {isEditMode ? "Edit Entry" : "Whats on your mind?"}
        </h1>
        {isLoading && <BarLoader color="orange" width={"100%"} />}
        <div className="space-y-2">
          <label className="text-sm font-md">Title</label>
          <Input
            {...register("title")}
            disabled={isLoading}
            placeholder="Enter title"
            className={`py-5 md:text-md ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          {errors?.title && (
            <span className="text-red-500 text-sm">{errors.title.message}</span>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-md">How are you feeling?</label>
          <Controller
            name="mood"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  className={`py-5 md:text-md ${
                    errors.title ? "border-red-500" : ""
                  }`}
                >
                  <SelectTrigger
                    className={`${errors.title ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select Mood ..." />
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
              );
            }}
          />
          {errors?.mood && (
            <span className="text-red-500 text-sm">{errors.mood.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-md">
            {getMoodById(getValues("mood"))?.prompt ?? "Write your Thought.."}
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => {
              return (
                <ReactQuill
                  readOnly={isLoading}
                  theme="snow"
                  value={field.value}
                  onChange={field.onChange}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["blockquote", "code-block"],
                      ["link"],
                      ["clean"],
                    ],
                  }}
                />
              );
            }}
          />
          {errors?.content && (
            <span className="text-red-500 text-sm">
              {errors.content.message}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-md">
            Add to your collection (optional)
          </label>
          <Controller
            name="collectionId"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  onValueChange={(value) => {
                    if (value === "new") {
                      setIsCollectionDialogOpen(true);
                    } else {
                      field.onChange(value);
                    }
                  }}
                  value={field.value}
                  className={`py-5 md:text-md ${
                    errors.title ? "border-red-500" : ""
                  }`}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Collection ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((collection) => {
                      return (
                        <SelectItem
                          value={collection.id}
                          key={collection.id}
                          className="flex items-center gap-2"
                        >
                          {collection.name}
                        </SelectItem>
                      );
                    })}
                    <SelectItem value="new">
                      <span className="text-orange-600">
                        + Create New Collection...
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors?.collectionId && (
            <span className="text-red-500 text-sm">
              {errors.collectionId.message}
            </span>
          )}
        </div>
        <div className="space-x-4 flex">
          <Button variant="journal" type="submit" disabled={actionLoading}>
            {isEditMode ? "Update" : "Publish"}
          </Button>
          {isEditMode && (
            <Button
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/journal/${existingEntry.id}`);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
      <CollectionForm
        loading={createCollectionLoading}
        onSuccess={handleCreateCollection}
        open={isCollectionDialogOpen}
        setOpen={setIsCollectionDialogOpen}
      />
    </div>
  );
};

export default JournalEntryPage;
