"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetOne } from "../../types"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { CornerDownRight, VideoIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<AgentGetOne>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
        <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2">
                <GeneratedAvatar seed={row.original.name} className="w-8 h-8 rounded-full" />
                <span className="font-semibold capitalize">{row.original.name}</span>
            </div>
            <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
                <CornerDownRight className="w-3 h-3" />
                <span>{row.original.instructions}</span>
            </div>
        </div>
    )
  },
  {
    accessorKey: "meetingsCount",
    header: "Meetings",
    cell: ({ row }) => (
        <Badge
            variant="outline"
            className="flex items-center gap-x-2 [&>svg]:size-4"
        >
            <VideoIcon className="text-blue-700" />
            5 Meetings
        </Badge>
    )
  }
]