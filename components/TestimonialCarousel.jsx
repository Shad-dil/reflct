"use client";

import Testimonial from "@/data/Testimonial";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

const TestimonialCarousel = () => {
  return (
    <div className="mt-24">
      <h2 className="text-3xl font-bold text-center text-orange-900 mb-12">
        What Our Writers Say
      </h2>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent>
          {Testimonial.map((item, index) => {
            return (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <blockquote className="space-y-4">
                      <p className="text-orange-700 italic">
                        &quot;{item.text}&quot;
                      </p>
                      <footer>
                        <div className="font-semibold text-orange-900">
                          {item.author}
                        </div>
                        <div className="text-sm text-orange-600">
                          {item.role}
                        </div>
                      </footer>
                    </blockquote>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default TestimonialCarousel;
