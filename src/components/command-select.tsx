import { ReactNode, useState } from "react";
import { ChevronsUpDownIcon, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "./ui/command";

interface Props {
  options: Array<{
    id: string;
    value: string;
    children: ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
  isLoading?: boolean;
  emptyMessage?: string;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Search an option",
  className,
  isLoading = false,
  emptyMessage = "No options found",
}: Props) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // Clear search when dialog closes
    if (!newOpen && onSearch) {
      onSearch("");
    }
  };
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "h-9 justify-between font-normal px-2",
          !selectedOption && "text-muted-foreground",
          className
        )}
        onClick={() => handleOpenChange(true)}
      >
        <div>{selectedOption?.children ?? placeholder}</div>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronsUpDownIcon />
        )}
      </Button>
      <CommandResponsiveDialog
        open={open}
        onOpenChange={handleOpenChange}
        shouldFilter={!onSearch}
      >
        <CommandInput placeholder="Search..." onValueChange={onSearch} />
        <CommandList>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : (
            <>
              <CommandEmpty>
                <span className="text-muted-foreground text-sm">
                  {emptyMessage}
                </span>
              </CommandEmpty>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  onSelect={() => {
                    onSelect(option.value);
                    handleOpenChange(false);
                  }}
                >
                  {option.children}
                </CommandItem>
              ))}
            </>
          )}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};
