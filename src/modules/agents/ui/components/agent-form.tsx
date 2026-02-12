import { useTRPC } from "@/trpc/client"
import { AgentGetOne } from "../../types"
import { useRouter } from "next/router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import z from "zod"
import { agentsInsertSchema } from "../../schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
// import { on } from "events"


interface AgentFormProps {
    onSuccess: () => void
    onCancel: () => void
    initialValues?: AgentGetOne
}

export const AgentForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: AgentFormProps) => {
    const trpc = useTRPC();
    // const router = useRouter();
    const queryClient = useQueryClient();
    const createAgent = useMutation({
        ...trpc.agents.create.mutationOptions({
            onSuccess: async () => {
            // This is the magic line. Replace 'list' with whatever your 
            // main query is named in your tRPC router (e.g., getMany, list, etc.)
            await queryClient.invalidateQueries({
                queryKey: trpc.agents.getMany.queryKey(),
            });
            
            onSuccess(); // Close the modal/form
            },
            onError: () => {}
        })
    });

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name || "",
            instructions: initialValues?.instructions || "",
        }
     }
    );

    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending

    const onSubmit = (data: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit) {
            console.log("Edit agent", data);
        }
        else {
            createAgent.mutate(data);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <GeneratedAvatar seed={form.watch("name")} className="w-24 h-24 rounded-full" />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Agent Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Agent Instructions" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center justify-end gap-x-2">
                    <Button variant="outline" onClick={onCancel} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isEdit ? "Save Changes" : "Create Agent"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}