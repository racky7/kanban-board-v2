import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Comment } from "@/lib/comment";
import { useQuery } from "@tanstack/react-query";
import { getComments } from "@/lib/api/commentApi";
import { AvatarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { faker } from "@faker-js/faker";

export default function CommentArea({
  taskId,
  className,
}: {
  taskId: string | undefined;
  className?: string;
}) {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fakeUsername] = useState(faker.internet.userName());

  const getCommentsQuery = useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => getComments(taskId!),
  });

  useEffect(() => {
    if (getCommentsQuery.status === "success") {
      setComments(getCommentsQuery.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCommentsQuery.status]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (comment) {
      setComments([
        ...comments,
        {
          id: faker.string.uuid(),
          content: comment,
          sender: fakeUsername,
          createdAt: new Date(),
        },
      ]);
      setComment("");
    }
  };

  if (getCommentsQuery.status === "pending") {
    return <div>Loading comments...</div>;
  }

  return (
    <div
      className={cn("max-w-[70%] h-full overflow-auto space-y-2", className)}
    >
      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="p-3 ">
            <div className="flex items-center space-x-3">
              <AvatarIcon className="h-4 w-4" />
              <span className="font-medium text-gray-900 text-sm lowercase">
                {comment.sender}
              </span>
              <span className="text-gray-500 text-xs flex-shrink-0">
                {comment.createdAt.toLocaleString()}
              </span>
            </div>
            <span className="text-gray-700 flex-1 text-sm">
              {comment.content}
            </span>
          </div>
        ))}
      </div>

      <form className="space-y-2 px-2" onSubmit={handleFormSubmit}>
        <Textarea
          value={comment}
          placeholder="Leave a comment"
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        <div className="flex justify-end">
          <Button type="submit">
            <Send className="w-4 h-4" />
            <span>Submit</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
