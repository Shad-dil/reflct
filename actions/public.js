"use server";
import { unstable_cache } from "next/cache";

export const getPixabayImage = async (query) => {
  try {
    const res = await fetch(
      `https://pixabay.com/api?q=${query}&key=${process.env.PIXABAY_API_KEY}&min_width=1280&min_height=720&image_type=illustration&category=feelings`
    );
    const data = res.json();
    return data.hits[0]?.largeImageURL || null;
  } catch (error) {
    console.log("Pixabay API Error", error);
    return null;
  }
};

export const getDailyPrompts = unstable_cache(
  async () => {
    try {
      const res = await fetch("https://api.adviceslip.com/advice", {
        cache: "no-store",
      });
      const data = await res.json();
      return data.slip.advice;
    } catch (error) {
      return {
        success: false,
        data: "Whats on your mind today?",
      };
    }
  },
  ["daily-prompt"],
  {
    revalidate: 84600,
    tags: ["daily-prompt"],
  }
);
