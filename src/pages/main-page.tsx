import KanbanBoard from "@/components/kanban-board";

export default function MainPage() {
  return (
    <div className="h-screen w-full p-2 bg-gray-200">
      <div className="w-full h-full bg-gray-50 rounded-md">
        <KanbanBoard />
      </div>
    </div>
  );
}
