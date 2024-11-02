import { Badge } from "@/components/ui/badge";
import { useTaskContext } from "@/context/tasks";
import { getTasks } from "@/lib/api";
import { Task } from "@/lib/task";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import TaskModal from "./task-modal";

type TaskListProps = {
  statusKey: string;
  classname?: string;
};

const TaskCard = ({ task, onClick }: { task: Task; onClick?: () => void }) => {
  return (
    <div
      className="bg-white hover:bg-gray-50 cursor-default mb-2 p-4 rounded-md text-sm space-y-4"
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
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const { activeTask, tasks, setTasks, setActiveTask } = useTaskContext();
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
          }
          setTaskModalOpen(value);
        }}
      />
    </>
  );
}
