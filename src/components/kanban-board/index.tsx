import { cn } from "@/lib/utils";

export default function KanbanBoard({ classname }: { classname?: string }) {
  return (
    <div className={cn("w-full h-full px-2 pt-1", classname)}>Kanban Board</div>
  );
}
