import { Badge } from "@/components/ui/badge";
import { getTasks } from "@/lib/api";
import { StatusesConfig, Task } from "@/lib/task";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import TaskModal from "./task-modal";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTaskContext } from "@/lib/hooks/use-task-context";

type TaskListProps = {
  statusKey: string;
  classname?: string;
};

const TaskCard = ({
  task,
  onClick,
  isActive,
  statuses,
  statusOrders,
  onStatusUpdate,
}: {
  task: Task;
  isActive: boolean;
  onClick?: () => void;
  statuses: StatusesConfig;
  statusOrders: string[];
  onStatusUpdate: (status: string) => void;
}) => {
  return (
    <div
      data-taskid={task.id}
      className={cn(
        "bg-white hover:bg-gray-50 cursor-default mb-2 p-4 rounded-md text-sm space-y-4",
        isActive ? "border border-indigo-500" : null
      )}
      onClick={() => {
        onClick?.();
      }}
    >
      <div className="text-sm">{task.name}</div>
      <div className="flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Badge variant="secondary" className="font-light">
              {task.status}
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuLabel className="text-xs">
              Change Status
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusOrders.map((status) => (
              <DropdownMenuCheckboxItem
                checked={task.status === status}
                key={`${task.id}-menu-status-${status}`}
                className="text-xs"
                onCheckedChange={(checked) => {
                  if (checked) {
                    onStatusUpdate(status);
                  }
                }}
              >
                {statuses[status].label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex gap-1">
          <Badge variant="outline" className="font-semibold">
            {task.priority}
          </Badge>
          {task.labels.map((label) => (
            <Badge key={label} variant="outline" className="text-xs font-light">
              {label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function TaskList({ statusKey, classname }: TaskListProps) {
  const {
    activeTask,
    activeTaskIndex,
    setActiveTaskIndex,
    activeStatus,
    setActiveTask,
    tasks,
    setTasks,
    taskModalOpen,
    setTaskModalOpen,
    statuses,
    statusOrders,
    updateTaskStatus,
  } = useTaskContext();

  const getTasksQuery = useQuery({
    queryKey: ["tasks", statusKey],
    queryFn: () => getTasks(statusKey),
  });

  useEffect(() => {
    if (getTasksQuery.status === "success") {
      setTasks(getTasksQuery.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTasksQuery.status]);

  return (
    <>
      <div className={cn("px-2", classname)}>
        {tasks[statusKey]?.map((task, index) => (
          <TaskCard
            key={`task-${index}-${task.id}`}
            isActive={activeTaskIndex === index && activeStatus === statusKey}
            task={task}
            statuses={statuses}
            statusOrders={statusOrders}
            onClick={() => {
              setActiveTask(task.id);
              setTaskModalOpen(true);
            }}
            onStatusUpdate={(updatedStatus) => {
              updateTaskStatus(task.id, task.status, updatedStatus);
              setActiveTask(undefined);
              setActiveTaskIndex(undefined);
            }}
          />
        ))}
      </div>
      <TaskModal
        open={typeof activeTask !== "undefined" && taskModalOpen}
        onOpenChange={(value) => {
          if (value === false) {
            setActiveTask(undefined);
            setActiveTaskIndex(undefined);
          }
          setTaskModalOpen(value);
        }}
      />
    </>
  );
}
