import { getDailyPrompts } from "@/actions/public";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import faqs from "@/data/faqs";
import {
  BarChart2,
  Book,
  Calendar,
  ChevronRight,
  FileText,
  Lock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Book,
    title: "Rich Text Editor",
    description:
      "Express yourself with a powerful editor supporting markdown, formatting, and more.",
  },
  {
    icon: Sparkles,
    title: "Daily Inspiration",
    description:
      "Get inspired with daily prompts and mood-based imagery to spark your creativity.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your thoughts are safe with enterprise-grade security and privacy features.",
  },
];

export default async function Home() {
  const advice = await getDailyPrompts();

  return (
    <div className="container relative mx-auto px-4 pt-16 pb-16">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 title-gradient">
          Your Space to Reflect <br /> Your Story to Tell
        </h1>
        <p className="text-lg md:text-xl text-orange-800 mb-8">
          Capture Your thoughts, track your moods and reflect on your journey in
          a beautiful, secure space
        </p>
        <div className="relative ">
          <div
            className="absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent 
          pointer-events-none z-10"
          />
          <div className="bg-black rounded-2xl p-4 max-full mx-auto">
            <div className="border-b border-orange-100 pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <span className="text-gray-300 font-medium">
                  Today&rsquo;s Entry
                </span>
              </div>
              <div className="flex gap-2">
                <div className="h-2 w-3 rounded-full bg-gray-700" />
                <div className="h-2 w-3 rounded-full bg-gray-500" />
                <div className="h-2 w-3 rounded-full bg-gray-400" />
              </div>
            </div>
            <div className="space-y-4 p-4">
              <h3 className="text-xl font-semibold text-gray-200">
                {advice ? advice : "What's on your mind?"}
              </h3>
              <Skeleton className="h-4 bg-gray-900 rounded w-3/4" />
              <Skeleton className="h-4 bg-gray-900 rounded w-full" />
              <Skeleton className="h-4 bg-gray-900 rounded w-2/3" />
            </div>
          </div>
        </div>
        <div className="flex justify-center  gap-4">
          <Link href={"/dashboard"}>
            <Button
              variant="journal"
              className="px-8 py-6 rounded-full flex items-center gap-2"
            >
              Start Writing <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href={"#features"}>
            <Button
              variant="outline"
              className="px-8 py-6 rounded-full border-orange-600 text-orange-600 hover:bg-orange-100"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
      <section
        id="features"
        className="mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => {
          return (
            <Card key={index} className="shadow-lg">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-xl text-orange-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-orange-700">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/*1st Feature*/}
      <div className="space-y-24 mt-24">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FileText className="h-w-6 text-orange-700" />
            </div>
            <h3 className="text-2xl font-bold text-orange-900 ">
              Rich Text Editor
            </h3>
            <p className="text-xl text-orange-700">
              Express yourself fully with our editor featuring:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-orange-400 rounded-full" />
                <span>Format Text with ease</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-orange-400 rounded-full" />
                <span>Embed Links</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4 bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
            <div className="flex gap-2 mb-6">
              <div className="h-8 w-8 rounded bg-orange-100" />
              <div className="h-8 w-8 rounded bg-orange-100" />
              <div className="h-8 w-8 rounded bg-orange-100" />
            </div>
            <div className="h-4 bg-orange-100 rounded w-3/4" />
            <div className="h-4 bg-orange-100 rounded w-full" />
            <div className="h-4 bg-orange-100 rounded w-2/3" />
          </div>
        </div>
        {/*2nd Feature*/}
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4 bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
            <div className="h-40 bg-gradient-to-t from-orange-100 to-orange-50 rounded-lg"></div>
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-orange-100 rounded " />
              <div className="h-4 w-16 bg-orange-100 rounded " />
              <div className="h-4 w-16 bg-orange-100 rounded " />
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <BarChart2 className="h-w-6 text-orange-700" />
            </div>
            <h3 className="text-2xl font-bold text-orange-900 ">
              Mood Analytics
            </h3>
            <p className="text-xl text-orange-700">
              Track your Emotional journey with powerful analytics:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-orange-400 rounded-full" />
                <span>Visual Moods trends</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-orange-400 rounded-full" />
                <span>Pattern recognition</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <TestimonialCarousel />

      {/* FAQs */}
      <div className="mt-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-orange-900">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full mx-auto">
          {faqs.map((faq, index) => {
            return (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-orange-900 text-xl">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-orange-700">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
      <div className="mt-24">
        <Card className="bg-gradient-to-t from-orange-100 to-amber-100">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-orange-900 mb-6">
              Start reflecting on your journey today
            </h2>
            <p className="text-lg text-orange-700 mb-8 max-w-2xl mx-auto">
              join thousand of writers who have already discovered the power of
              digital journaling
            </p>
            <Link href={"/dashboard"}>
              <Button size="lg" variant="journal" className="animate-bounce">
                Get Started for free <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
