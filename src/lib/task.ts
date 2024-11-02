export type Task = {
  id: string;
  name: string;
  labels: string[];
  status: string;
  created_at: Date;
  updated_at: Date;
  priority: string;
};

export type TaskMap = Record<string, Task[]>;

export type Status = {
  key: string;
  color: string;
  label: string;
  icon?: React.ReactElement;
};

export type StatusesConfig = Record<string, Status>;
