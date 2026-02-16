import { inngest } from "./client";
import JSONL from "jsonl-parse-stringify";
import { StreamTranscriptionItem } from "@/modules/meetings/types";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";

import { db } from "@/db";
import { eq, inArray } from "drizzle-orm";
import { agents, meetings, user } from "@/db/schema";

// AI agent that converts raw transcripts into structured markdown summaries
const summarizer = createAgent({
  name: "summarizer",
  system:
    `You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z `.trim(),
  model: openai({ model: "gpt-4o", apiKey: process.env.OPENAI_API_KEY }),
});

/**
 * MEETING PROCESSING PIPELINE
 * 
 * Triggered when Stream Video finishes transcribing a meeting.
 * This function processes the raw transcript through multiple steps:
 * 1. Downloads the transcript from Stream's URL
 * 2. Parses the JSONL format into structured data
 * 3. Enriches transcript with speaker names (users + AI agents)
 * 4. Uses AI to generate a structured summary
 * 5. Saves the summary and marks meeting as completed
 */
export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    // Download raw transcript file from Stream Video
    const response = await step.run("fetch-transcript", async () => {
      return fetch(event.data.transcriptUrl).then((res) => res.text());
    });

    // Parse Stream's JSONL format into structured transcript items
    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptionItem>(response);
    });

    // Enrich transcript with speaker names (both human users and AI agents)
    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      // Get unique speaker IDs from transcript
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];
      
      // Look up human users and AI agents who participated
      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) => users.map((user) => ({ ...user })));

      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) => agents.map((agent) => ({ ...agent })));

      // Merge all speakers and attach names to transcript items
      const speakers = [...userSpeakers, ...agentSpeakers];
      return transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id
        );
        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
            },
          };
        }

        return {
          ...item,
          user: {
            name: speaker.name,
          },
        };
      });
    });

    // Generate AI summary of the enriched transcript
    const { output } = await summarizer.run(
      "Summarize the following trascript: " +
        JSON.stringify(transcriptWithSpeakers)
    );

    // Save summary to database and mark meeting as completed
    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(eq(meetings.id, event.data.meetingId));
    });
  }
);
