import Link from "next/link";
import Markdown from "react-markdown";
import { format } from "date-fns";
import { 
  SparklesIcon, 
  FileTextIcon, 
  BookOpenTextIcon, 
  FileVideoIcon, 
  ClockFadingIcon 
} from "lucide-react";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";

import { MeetingGetOne } from "../../types";

interface Props {
  data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary" className="w-full">
        <div className="bg-white rounded-lg border px-3">
          <ScrollArea>
            <TabsList className="p-0 bg-background justify-start rounded-none h-13">
              <TabsTrigger
                value="summary"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground gap-x-2"
              >
                <BookOpenTextIcon className="size-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground gap-x-2"
              >
                <FileTextIcon className="size-4" />
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="recording"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground gap-x-2"
              >
                <FileVideoIcon className="size-4" />
                Recording
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground gap-x-2"
              >
                <SparklesIcon className="size-4" />
                Ask AI
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* --- TAB CONTENT SECTIONS (UN-NESTED) --- */}

        {/* 1. Summary Tab */}
        <TabsContent value="summary" className="mt-4">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex flex-col gap-y-5">
              <h2 className="text-2xl font-medium capitalize">{data.name}</h2>
              
              <div className="flex gap-x-4 items-center text-sm text-muted-foreground">
                <Link
                  href={`/agents/${data.agent.id}`}
                  className="flex items-center gap-x-2 underline underline-offset-4 capitalize text-foreground"
                >
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={data.agent.name}
                    className="size-5"
                  />
                  {data.agent.name}
                </Link>
                <span>•</span>
                <p>{data.startedAt ? format(new Date(data.startedAt), "PPP") : ""}</p>
                <span>•</span>
                <Badge
                  variant="outline"
                  className="flex items-center gap-x-2 [&>svg]:size-3.5"
                >
                  <ClockFadingIcon className="text-blue-700" />
                  {data.duration ? formatDuration(data.duration) : "No duration"}
                </Badge>
              </div>

              <div className="flex items-center gap-x-2 text-primary font-medium">
                <SparklesIcon className="size-4" />
                <p>AI generated summary</p>
              </div>

              <div className="prose prose-sm max-w-none">
                <Markdown
                  components={{
                    h1: (props) => <h1 className="text-2xl font-medium mb-4" {...props} />,
                    h2: (props) => <h2 className="text-xl font-medium mb-3" {...props} />,
                    h3: (props) => <h3 className="text-lg font-medium mb-2" {...props} />,
                    p: (props) => <p className="mb-4 leading-relaxed text-gray-700" {...props} />,
                    ul: (props) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                    ol: (props) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
                    li: (props) => <li className="mb-1" {...props} />,
                    strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
                  }}
                >
                  {data.summary || "The summary is being processed. Please refresh in a moment."}
                </Markdown>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 2. Transcript Tab */}
        <TabsContent value="transcript" className="mt-4">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-x-2 mb-4">
               <FileTextIcon className="size-5 text-muted-foreground" />
               <h3 className="font-medium">Full Transcript</h3>
            </div>
            <div className="text-sm text-muted-foreground italic">
               {data.transcriptUrl ? (
                 <p>Transcript data is available. (You can map your transcript JSON here).</p>
               ) : (
                 <p>No transcript available for this meeting.</p>
               )}
            </div>
          </div>
        </TabsContent>

        {/* 3. Recording Tab */}
        <TabsContent value="recording" className="mt-4">
          <div className="bg-white rounded-lg border p-4">
            {data.recordingUrl ? (
              <video
                src={data.recordingUrl}
                className="w-full rounded-lg shadow-sm"
                controls
              />
            ) : (
              <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Recording not found or still processing.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* 4. Chat Tab */}
        <TabsContent value="chat" className="mt-4">
          <div className="bg-white rounded-lg border p-20 text-center">
            <SparklesIcon className="size-10 mx-auto mb-4 text-primary/20" />
            <h3 className="text-lg font-medium">Ask AI coming soon</h3>
            <p className="text-muted-foreground">You will soon be able to chat with your meeting data.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};