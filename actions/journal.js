"use server";
import { getMoodById, MOODS } from "@/app/lib/moods";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getPixabayImage } from "./public";
export async function createjournalEntry(data) {
  try {
    const authResult = await auth();
    const { userId } = authResult;
    if (!userId) throw new Error("unAuthorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User Not Found");
    if (!data.mood) throw new Error("Mood is required");
    const mood = MOODS[data.mood.toUpperCase()];
    if (!mood) throw new Error("Invalid Mood");

    const moodImageUrl = await getPixabayImage(data.moodQuery);
    const entry = db.entry.create({
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl: moodImageUrl,
        userId: user.id,
        collectionId: data.collectionId || null,
      },
    });

    await db.draft.deleteMany({
      where: {
        userId: user.id,
      },
    });
    revalidatePath("/dashboard");
    return entry;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getJournalEntries({
  collectionId,
  orderBy = "desc",
} = {}) {
  try {
    const authResult = await auth();
    const { userId } = authResult;
    if (!userId) throw new Error("unAuthorized");
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User Not Found");
    const entries = await db.entry.findMany({
      where: {
        userId: user.id,
        ...(collectionId === "unorganized"
          ? { collectionId: null }
          : collectionId
          ? { collectionId }
          : {}),
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: orderBy,
      },
    });
    const entriesWithMoodData = entries.map((entry) => ({
      ...entry,
      moodData: getMoodById(entry.mood),
    }));

    return {
      success: true,
      data: {
        entries: entriesWithMoodData,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getJournalEntry(id) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const entry = await db.entry.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!entry) throw new Error("Entry not found");

    return entry;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteJournal(id) {
  try {
    const authResult = await auth();

    const { userId } = authResult;
    if (!userId) throw new Error("User  is not authenticated");
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User  Not Found");

    // Await the findFirst call
    const journal = await db.entry.findFirst({
      where: {
        userId: user.id,
        id,
      },
    });
    if (!journal) throw new Error("Entry Not Found");

    // Now delete the Journal
    await db.entry.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard");

    return journal;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateJournalEntry(data) {
  try {
    const authResult = await auth();

    const { userId } = authResult;
    if (!userId) throw new Error("User  is not authenticated");
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User  Not Found");

    // Await the findFirst call
    const existingEntry = await db.entry.findFirst({
      where: {
        userId: user.id,
        id: data.id,
      },
    });
    if (!existingEntry) throw new Error("Entry Not Found");

    if (!data.mood) throw new Error("Mood is required");
    const mood = MOODS[data.mood.toUpperCase()];
    if (!mood) throw new Error("Invalid Mood");

    let moodImageUrl = existingEntry.moodImageUrl;
    if (existingEntry.mood !== mood.id)
      moodImageUrl = await getPixabayImage(data.moodQuery);
    const updatedEntry = db.entry.update({
      where: { id: data.id },
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl: moodImageUrl,
        userId: user.id,
        collectionId: data.collectionId || null,
      },
    });
    revalidatePath("/dashboard");
    revalidatePath(`/journal/${data.id}`);

    return updatedEntry;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getDraft(data) {
  try {
    const authResult = await auth();

    const { userId } = authResult;
    if (!userId) throw new Error("User  is not authenticated");
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User  Not Found");

    // Await the findFirst call
    const draft = await db.draft.findFirst({
      where: {
        userId: user.id,
      },
    });

    return { success: true, data: draft };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function saveDraft(data) {
  try {
    const authResult = await auth();

    const { userId } = authResult;
    if (!userId) throw new Error("User  is not authenticated");
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User  Not Found");

    // Await the findFirst call
    const draft = await db.entry.upsert({
      where: {
        userId: user.id,
      },
      create: {
        title: data.title,
        content: data.content,
        mood: data.mood,
        userId: user.id,
      },
      update: {
        title: data.title,
        content: data.content,
        mood: data.mood,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, data: draft };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
