"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createCollection(data) {
  try {
    const authResult = await auth();

    const { userId } = authResult;
    if (!userId) throw new Error("User is not authenticated");
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User Not Found");
    const existingCollection = await prisma.collection.findUnique({
      where: {
        name_userId: {
          name: data.name, // replace with the actual name
          userId: user.id, // replace with the actual user ID
        },
      },
    });

    if (existingCollection) {
      // Handle the case where the collection already exists
      throw new Error(
        "A collection with this name already exists for this user."
      );
    }
    const collection = prisma.collection.create({
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
  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User Not Found");
  const collections = prisma.collection.findMany({
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
  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User Not Found");
  const collections = await prisma.collection.findUnique({
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
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User  Not Found");

    // Await the findFirst call
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
      },
    });
    if (!collection) throw new Error("Collection Not Found");

    // Now delete the collection
    await prisma.collection.delete({
      where: {
        id: collectionId,
      },
    });
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}
