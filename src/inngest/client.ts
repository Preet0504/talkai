import { Inngest, EventSchemas } from "inngest";

// Define the event types
type Events = {
    // 🎯 Use the name you called in the webhook: "meetings/processing"
    "meetings/processing": {
        data: {
            meetingId: string;
            transcriptUrl?: string | null; // Match your DB/Webhook naming
            recordingUrl?: string | null;
        };
    };
}

export const inngest = new Inngest({
    id: "meet-ai",
    schemas: new EventSchemas().fromRecord<Events>(),
});