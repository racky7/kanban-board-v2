import React, { createContext, useState } from "react";
import merge from "deepmerge";
import { Status, StatusesConfig, Task, TaskMap } from "@/lib/task";

type TaskContextType = {
  activeTask: string | undefined;
  setActiveTask: React.Dispatch<React.SetStateAction<string | undefined>>;

  activeTaskIndex: number | undefined;
  setActiveTaskIndex: React.Dispatch<React.SetStateAction<number | undefined>>;

  activeStatus: string | undefined;
  setActiveStatus: React.Dispatch<React.SetStateAction<string | undefined>>;

  tasks: TaskMap;
  getTask: (taskId: string | undefined) => Task | undefined;
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (
    taskId: string,
    currentStatus: string,
    updatedStatus: string
  ) => void;

  statuses: StatusesConfig;
  setStatuses: (statuses: Status[]) => void;

  statusOrders: string[];
  setStatusOrders: React.Dispatch<React.SetStateAction<string[]>>;

  taskModalOpen: boolean;
  setTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  statusAlertModalOpen: boolean;
  setStatusAlertModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  pendingStatus: Task["status"] | undefined;
  setPendingStatus: React.Dispatch<
    React.SetStateAction<Task["status"] | undefined>
  >;
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
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | undefined>(
    undefined
  );

  const [activeStatus, setActiveStatus] = useState<string | undefined>(
    undefined
  );

  const [tasks, setTasksState] = useState<TaskMap>({});
  const [statuses, setStatusesState] = useState<StatusesConfig>({});
  const [statusOrders, setStatusOrders] = useState<string[]>([]);

  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const [statusAlertModalOpen, setStatusAlertModalOpen] = useState(false);

  const [pendingStatus, setPendingStatus] = useState<
    Task["status"] | undefined
  >(undefined);

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
    setActiveStatus(statusList[0].key);
  };

  return (
    <TaskContext.Provider
      value={{
        activeTask,
        setActiveTask,
        activeTaskIndex,
        setActiveTaskIndex,
        activeStatus,
        setActiveStatus,
        tasks,
        getTask,
        setTasks,
        updateTaskStatus,
        statusOrders,
        setStatusOrders,
        statuses,
        setStatuses,
        taskModalOpen,
        setTaskModalOpen,
        statusAlertModalOpen,
        setStatusAlertModalOpen,
        pendingStatus,
        setPendingStatus,
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
