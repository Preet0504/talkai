"use client";

import { useState, useEffect, useId } from "react";
import { useMutation } from "@tanstack/react-query";
import { Channel as StreamChannel } from "stream-chat";
import {
  useCreateChatClient,
  Chat,
  Channel,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { useSound } from "@/components/sound/sound-provider";

import "stream-chat-react/dist/css/v2/index.css";

interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string | undefined;
}

export const ChatUI = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
}: Props) => {
  const trpc = useTRPC();
  const { mutateAsync: generateChatToken } = useMutation(
    trpc.meetings.generateChatToken.mutationOptions()
  );
  const [channel, setChannel] = useState<StreamChannel>();
  const { play } = useSound();

  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
    tokenOrProvider: generateChatToken,
    userData: {
      id: userId,
      name: userName,
      image: userImage,
    },
  });
  useEffect(() => {
    if (!client) return;

    const channel = client.channel("messaging", meetingId, {
      members: [userId],
    });

    setChannel(channel);
  }, [client, meetingId, meetingName, userId]);

  useEffect(() => {
    if (!client) return;
    const handleMessage = (event: { user?: { id?: string } }) => {
      if (event.user?.id && event.user.id !== userId) {
        play("notify");
      }
    };
    client.on("message.new", handleMessage);
    return () => {
      client.off("message.new", handleMessage);
    };
  }, [client, userId, play]);

  if (!client)
    return (
      <LoadingState
        title="Loading Chat"
        description="This may take a few seconds"
      />
    );

  return (
    <div className="bg-card rounded-lg border border-border/60 overflow-hidden shadow-elevated h-[min(70vh,640px)] [&_.str-chat]:h-full [&_.str-chat__container]:h-full [&_.str-chat__main-panel]:h-full [&_.str-chat__main-panel]:flex [&_.str-chat__main-panel]:flex-col [&_.str-chat__list]:min-h-0 [&_.str-chat__message-list-scroll]:max-h-none">
      <Chat client={client}>
        <Channel channel={channel}>
          <Window>
            <MessageList />
            <MessageInput />
          </Window>
        </Channel>
      </Chat>
    </div>
  );
};
