"use client"

import { useTRPC } from "@/trpc/client";
import { CallUI } from "./call-ui";
import {
    Call,
    CallingState,
    StreamCall,
    StreamVideo,
    StreamVideoClient,
} from "@stream-io/video-react-sdk"
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, BotIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string;
}

export const CallConnect = ({
    meetingId,
    meetingName,
    userId,
    userImage,
    userName,
}: Props) => {
    const trpc = useTRPC();
    const [client, setClient] = useState<StreamVideoClient>();
    const [call, setCall] = useState<Call>();
    
    const { mutateAsync: generateToken } = useMutation(
        trpc.meetings.generateToken.mutationOptions(),
    )

    // 1. Initialize Client using the SDK's "getOrCreateInstance"
    useEffect(() => {
        const _client = StreamVideoClient.getOrCreateInstance({
            apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
            user: { id: userId, name: userName, image: userImage },
            tokenProvider: () => generateToken(),
        });

        setClient(_client);

        return () => {
            // In dev, we don't disconnect on every HMR to keep the socket alive
            if (process.env.NODE_ENV === 'production') {
                _client.disconnectUser();
            }
        };
    }, [userId, userName, userImage]);

    // 2. Initialize Call with State Guards
    useEffect(() => {
        if (!client) return;

        const _call = client.call("default", meetingId);
        
        const joinCall = async () => {
            try {
                // Only join if we aren't already in it
                if (_call.state.callingState === CallingState.IDLE) {
                    await _call.join({ create: true });
                    // Default Talk.AI setup
                    await _call.camera.disable();
                    await _call.microphone.disable();
                }
                setCall(_call);
            } catch (error) {
                console.error("Connection failed:", error);
            }
        };

        joinCall();

        return () => {
            // Only leave if the state allows it
            if (_call.state.callingState !== CallingState.LEFT) {
                _call.leave().catch(console.error);
            }
            setCall(undefined);
        };
    }, [client, meetingId]);

    if (!client || !call) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-900 gap-y-4">
                <div className="relative">
                    <div className="absolute h-16 w-16 animate-pulse rounded-full bg-green-500/20 blur-xl" />
                    <BotIcon className="z-10 h-10 w-10 text-green-500 animate-bounce" />
                </div>
                <Loader2Icon className="h-5 w-5 animate-spin text-slate-400" />
            </div>
        )
    }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <CallUI meetingName={meetingName} />
            </StreamCall>
        </StreamVideo>
    );
};