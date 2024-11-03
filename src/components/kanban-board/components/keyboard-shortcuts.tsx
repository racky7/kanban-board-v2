import { useTaskContext } from "@/lib/hooks/use-task-context";
import { useHotkeys } from "react-hotkeys-hook";

export default function KeyboardShortcuts() {
  const {
    tasks,
    activeTask,
    setActiveTask,
    activeTaskIndex,
    setActiveTaskIndex,
    activeStatus,
    setActiveStatus,
    statusOrders,
    taskModalOpen,
    setTaskModalOpen,
    statusAlertModalOpen,
    setStatusAlertModalOpen,
    setPendingStatus,
  } = useTaskContext();

  const scrollToItem = (id: string) => {
    const element = document.querySelector(`[data-taskid="${id}"]`);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  const updateActiveTask = (
    index: number,
    status: string | undefined = undefined
  ) => {
    if (!activeStatus) return;
    const task = tasks[status ?? activeStatus][index];
    setActiveTaskIndex(index);
    setActiveTask(task.id);
    scrollToItem(task.id);
  };

  const getAppropriateTaskIndex = (
    status: string,
    currentIndex: number | undefined
  ): number => {
    const statusTasks = tasks[status];
    if (!statusTasks?.length) return 0;

    if (typeof currentIndex === "undefined") return 0;

    return currentIndex >= statusTasks.length
      ? statusTasks.length - 1
      : currentIndex;
  };

  const handleStatusChange = (newStatus: string) => {
    setActiveStatus(newStatus);
    const newIndex = getAppropriateTaskIndex(newStatus, activeTaskIndex);
    updateActiveTask(newIndex, newStatus);
  };

  const handleArrowDown = () => {
    if (!activeStatus || !tasks[activeStatus]?.length || taskModalOpen) return;

    if (typeof activeTaskIndex === "undefined") {
      updateActiveTask(0);
      return;
    }

    const newIndex = activeTaskIndex + 1;
    if (newIndex < tasks[activeStatus].length) {
      updateActiveTask(newIndex);
    }
  };

  const handleArrowUp = () => {
    if (!activeStatus || tasks[activeStatus].length < 2 || taskModalOpen)
      return;

    if (typeof activeTaskIndex === "undefined") {
      updateActiveTask(0);
      return;
    }

    if (activeTaskIndex > 0) {
      updateActiveTask(activeTaskIndex - 1);
    }
  };

  const handleArrowRight = () => {
    if (!activeStatus || taskModalOpen) return;

    const currentStatusIndex = statusOrders.indexOf(activeStatus);
    const isNotLastStatus = currentStatusIndex < statusOrders.length - 1;

    if (isNotLastStatus) {
      const nextStatus = statusOrders[currentStatusIndex + 1];
      handleStatusChange(nextStatus);
    }
  };

  const handleArrowLeft = () => {
    if (!activeStatus || taskModalOpen) return;

    const currentStatusIndex = statusOrders.indexOf(activeStatus);

    if (currentStatusIndex > 0) {
      const prevStatus = statusOrders[currentStatusIndex - 1];
      handleStatusChange(prevStatus);
    } else {
      handleStatusChange(statusOrders[0]);
    }
  };

  const handleStatusHotKey = (event: KeyboardEvent) => {
    if (!taskModalOpen || statusAlertModalOpen) {
      return;
    }

    const statusIndex: number = +event.key - 1;

    setPendingStatus(statusOrders[statusIndex]);
    setStatusAlertModalOpen(true);
  };

  useHotkeys("arrowRight", handleArrowRight);
  useHotkeys("arrowLeft", handleArrowLeft);
  useHotkeys("arrowDown", handleArrowDown);
  useHotkeys("arrowUp", handleArrowUp);
  useHotkeys(["1", "2", "3"], handleStatusHotKey);
  useHotkeys("enter", () => {
    if (!activeTask) return;

    if (activeTask && !taskModalOpen) {
      setTaskModalOpen(true);
    }
  });

  return <></>;
}
