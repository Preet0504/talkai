"use client";
import { ErrorState } from "@/components/error-state";

const ErrorPage = () => {
    return (
        <ErrorState 
            title="Failed to Load Agents"
            message="There was an error fetching agents. Please try again."
        />
    );
}

export default ErrorPage;