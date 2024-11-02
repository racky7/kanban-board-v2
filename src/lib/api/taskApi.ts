import { Status, Task } from "../task";
import { getRandomElement } from "../utils";
import { faker } from "@faker-js/faker";

const mockStatuses: Status[] = [
  { key: "todo", color: "blue", label: "To Do" },
  { key: "in-progress", color: "yellow", label: "In Progress" },
  { key: "done", color: "green", label: "Done" },
];

const statusOrders = mockStatuses.map((status) => status.key);

const generateMockTasks = (status: string, numTasks: number): Task[] => {
  const priorities = ["low", "medium", "high"];
  const labels: string[] = [
    "bug",
    "feature",
    "enhancement",
    "internal tool",
    "new tool",
  ];

  return Array.from({ length: numTasks }, () => ({
    id: faker.string.uuid(),
    name: faker.lorem.sentence(),
    labels: [getRandomElement(labels)],
    status: status,
    priority: getRandomElement(priorities),
    created_at: faker.date.recent({ days: 10 }),
    updated_at: faker.date.soon({ days: 5 }),
  }));
};

const mockTasks = (status: string) =>
  generateMockTasks(status, faker.number.int({ min: 1, max: 2 }));

export const getStatuses = async (): Promise<{
  statuses: Status[];
  statusOrders: string[];
}> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Promise.resolve({
    statuses: mockStatuses,
    statusOrders,
  });
};

export const getTasks = async (status: string): Promise<Task[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return Promise.resolve(mockTasks(status));
};
