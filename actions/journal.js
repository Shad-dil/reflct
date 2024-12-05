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
