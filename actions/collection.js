"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createCollection(data) {
  try {
    const authResult = await auth();

    const { userId } = authResult;
    if (!userId) throw new Error("User is not authenticated");
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User Not Found");
    const collection = db.collection.create({
      data: {
        name: data.name,
        description: data.description,
        userId: user.id,
      },
    });
    revalidatePath("/dashboard");
    return collection;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getCollection() {
  const authResult = await auth();

  const { userId } = authResult;
  if (!userId) throw new Error("User is not authenticated");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User Not Found");
  const collections = db.collection.findMany({
    where: {
      userId: user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  return collections;
}

export async function getSingleCollection({ collectionId }) {
  const authResult = await auth();

  const { userId } = authResult;
  if (!userId) throw new Error("User is not authenticated");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User Not Found");
  const collections = await db.collection.findUnique({
    where: {
      userId: user.id,
      id: collectionId,
    },
  });

  return collections;
}

export async function deleteCollection(collectionId) {
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
    const collection = await db.collection.findFirst({
      where: {
        id: collectionId,
      },
    });
    if (!collection) throw new Error("Collection Not Found");

    // Now delete the collection
    await db.collection.delete({
      where: {
        id: collectionId,
      },
    });
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}
