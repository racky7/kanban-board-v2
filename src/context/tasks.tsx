import React, { createContext, useState } from "react";
import merge from "deepmerge";
import { Status, StatusesConfig, Task, TaskMap } from "@/lib/task";

type TaskContextType = {
  activeTask: string | undefined;
  setActiveTask: React.Dispatch<React.SetStateAction<string | undefined>>;

  tasks: TaskMap;
  getTask: (taskId: string | undefined) => Task | undefined;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTaskStatus: (
    taskId: string,
    currentStatus: string,
    updatedStatus: string
  ) => void;

  statuses: StatusesConfig;
  setStatuses: (statuses: Status[]) => void;

  statusOrders: string[];
  setStatusOrders: React.Dispatch<React.SetStateAction<string[]>>;
};

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

export const TaskContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeTask, setActiveTask] = useState<string | undefined>(undefined);
  const [tasks, setTasksState] = useState<TaskMap>({});
  const [statuses, setStatusesState] = useState<StatusesConfig>({});
  const [statusOrders, setStatusOrders] = useState<string[]>([]);

  const setTasks = (newTasks: Task[]) => {
    const tasksByStatus: TaskMap = {};

    statusOrders.forEach((status) => {
      tasksByStatus[status] = [];
    });

    // Group tasks by status
    newTasks.forEach((task) => {
      if (!tasksByStatus[task.status]) {
        tasksByStatus[task.status] = [];
      }
      tasksByStatus[task.status].push(task);
    });

    setTasksState((previousTasks) => merge(previousTasks, tasksByStatus));
  };

  const getTask = (taskId: string | undefined) => {
    if (!taskId) {
      return undefined;
    }

    return Object.values(tasks)
      .flat()
      .find((task) => task.id === taskId);
  };

  const addTask = (task: Task) => {};

  const updateTaskStatus = (
    taskId: string,
    currentStatus: string,
    updatedStatus: string
  ) => {
    const task = getTask(taskId);
    if (!task) {
      return;
    }
    task.status = updatedStatus;

    // remove task from current status && update task in new status
    setTasksState((previousTasks) => {
      previousTasks[currentStatus] = previousTasks[currentStatus].filter(
        (t: Task) => t.id !== taskId
      );

      return merge(previousTasks, { [updatedStatus]: [task] });
    });
  };

  const setStatuses = (statusList: Status[]) => {
    const statusConfig: StatusesConfig = {};
    statusList.forEach((status) => {
      statusConfig[status.key] = status;
    });
    setStatusesState(statusConfig);
  };

  return (
    <TaskContext.Provider
      value={{
        activeTask,
        setActiveTask,
        tasks,
        getTask,
        setTasks,
        addTask,
        updateTaskStatus,
        statusOrders,
        setStatusOrders,
        statuses,
        setStatuses,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export function useTaskContext() {
  const context = React.useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskContextProvider");
  }
  return context;
}
