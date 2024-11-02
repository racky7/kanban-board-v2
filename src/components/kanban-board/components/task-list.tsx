import { Badge } from "@/components/ui/badge";
import { useTaskContext } from "@/context/tasks";
import { getTasks } from "@/lib/api";
import { Task } from "@/lib/task";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import TaskModal from "./task-modal";

type TaskListProps = {
  statusKey: string;
  classname?: string;
};

const TaskCard = ({
  task,
  onClick,
  isActive,
}: {
  task: Task;
  isActive: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      data-taskId={task.id}
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
        <Badge variant="secondary" className="font-light">
          {task.status}
        </Badge>
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
            onClick={() => {
              setActiveTask(task.id);
              setTaskModalOpen(true);
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
