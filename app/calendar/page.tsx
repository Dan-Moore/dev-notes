import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { events, CalendarEvent } from "@/lib/io";
import { components } from "@/components/mdx-components";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";


/*
  return (
    <article className="prose prose-sm md:prose-base lg:prose-lg mx-auto">
      <h1>{props.frontMatter.title}</h1>
      <MDXRemote source={props.content} components={components} />
    </article>
  );
*/
function upcomingOrLatest(allEvents: CalendarEvent[]): CalendarEvent {
  return allEvents.sort( (a, b) => a.dates[0].getTime() - b.dates[0].getTime() )[0]
}

export default function Page() {
  let allEvents = events()
  let event = upcomingOrLatest(allEvents);
  return (
    <div className="flex flex-col">
            
          
      {/* Top half - Textarea 
      <div className="flex-1 p-6">
        <Textarea
          className="w-full h-full min-h-[40vh] p-4 resize-none"
          defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl."
        />

            <article className="prose prose-sm md:prose-base lg:prose-lg mx-auto">
      <h1>{props.frontMatter.title}</h1>
      <MDXRemote source={props.content} components={components} />
    </article>
*/}

<div className="flex-1 p-6">
  <MDXRemote source={event.banner.content} components={components} />
</div>

      {/* Bottom half - Carousel */}
      <div className="flex-1 p-6 flex items-center justify-center bg-muted/20">
        <Carousel className="w-full max-w-4xl">
          <CarouselContent className="-ml-4">
            {event.files.map((_, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/3">
                <div className="p-1">
                  
                  <Link href={_.link}>
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{_.details.title}</span>
                    </CardContent>
                  </Card></Link>
                  
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </div>
    
  )
}