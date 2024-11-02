import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskContext } from "@/context/tasks";
import StatusAlertDialog from "./status-alert-dialog";
import { useState } from "react";
import { Task } from "@/lib/task";

type TaskModalProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function TaskModal({ open, onOpenChange }: TaskModalProps) {
  const { activeTask, getTask, statuses, updateTaskStatus } = useTaskContext();
  const [statusAlertOpen, setStatusAlertOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<
    Task["status"] | undefined
  >(undefined);

  const task = getTask(activeTask);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="min-h-[80%] flex flex-col min-w-[80%] p-8 space-y-4"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl">{task?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 lg:max-w-[70%]">
            <div className="col-span-1 grid grid-cols-3 items-center">
              <div className="col-span-1">Status</div>
              <div className="col-span-2">
                <Select
                  value={task?.status}
                  onValueChange={(value) => {
                    setPendingStatus(value);
                    setStatusAlertOpen(true);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(statuses).map((status, index) => (
                      <SelectItem key={`${status}-${index}}`} value={status}>
                        {statuses[status].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="col-span-1 grid grid-cols-3 items-center">
              <div className="col-span-1">Priority</div>
              <div className="col-span-2">
                <Select disabled={true} value={task?.priority}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {task?.priority ? (
                      <SelectItem value={task.priority}>
                        {task.priority}
                      </SelectItem>
                    ) : null}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="col-span-1 grid grid-cols-3 items-center">
              <div className="col-span-1">Due Date</div>
              <div className="col-span-2 text-sm">
                {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className="col-span-1 grid grid-cols-3 items-center">
              <div className="col-span-1">Labels</div>
              <div className="col-span-2 flex gap-1">
                {task?.labels.map((label) => (
                  <Badge
                    key={`task-${label}`}
                    variant="outline"
                    className="text-xs font-light"
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="text-lg font-medium">Activity</div>
        </DialogContent>
      </Dialog>
      <StatusAlertDialog
        open={statusAlertOpen}
        onCancel={() => {
          setStatusAlertOpen(false);
        }}
        onConfirm={() => {
          if (task && pendingStatus) {
            updateTaskStatus(activeTask!, task.status, pendingStatus);
            setStatusAlertOpen(false);
          }
        }}
      />
    </>
  );
}
