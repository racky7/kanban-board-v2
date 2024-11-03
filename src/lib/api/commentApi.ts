import { faker } from "@faker-js/faker";
import { Comment } from "../comment";

// generate 4 comments from faker
const mockComments = Array.from({ length: 4 }, () => ({
  id: faker.string.uuid(),
  content: faker.lorem.sentence(),
  sender: faker.internet.username(),
  createdAt: faker.date.recent({ days: 1 }),
}));

export const getComments = async (taskId: string): Promise<Comment[]> => {
  void taskId;
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Promise.resolve(mockComments);
};
