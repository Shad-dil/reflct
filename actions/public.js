import { unstable_cache } from "next/cache";

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
