import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getStatuses } from "@/lib/api";
import { useEffect } from "react";
import TaskList from "./task-list";
import { useTaskContext } from "@/lib/hooks/use-task-context";

export default function Board({ classname }: { classname?: string }) {
  const { statuses, tasks, statusOrders, setStatuses, setStatusOrders } =
    useTaskContext();

  const getStatusesQuery = useQuery({
    queryKey: ["statuses"],
    queryFn: getStatuses,
  });

  useEffect(() => {
    if (getStatusesQuery.status === "success") {
      setStatusOrders(getStatusesQuery.data.statusOrders);
      setStatuses(getStatusesQuery.data.statuses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStatusesQuery.status]);

  return (
    <div className={cn("w-full h-full px-2 pt-1", classname)}>
      <div className="h-full w-full flex gap-3 mb-1 overflow-auto">
        {statusOrders.map((status, index) => (
          <div
            key={`status-${index}`}
            className="h-full flex flex-col min-w-[356px] max-w-[356px] px-1 bg-gray-100"
          >
            <div className="p-4 flex items-center gap-x-2">
              <div className="font-medium text-sm">
                {statuses[status].label}{" "}
              </div>
              <div className="text-sm text-muted-foreground">
                {typeof tasks[status]?.length !== "undefined"
                  ? tasks[status].length
                  : 0}
              </div>
            </div>
            <TaskList statusKey={status} classname="flex-1 overflow-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
