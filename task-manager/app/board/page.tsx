"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { TaskDialog } from "@/components/task-dialog";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  userId: string;
  priority?: number; // Assuming priority is optional
}

export interface User {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  image?: string | null;
}

export default function BoardPage() {
  const router = useRouter(); // Initialize useRouter for navigation
  const { data: session, status } = useSession();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("dueDate");
  const { toast } = useToast();

  const statuses = ["TODO", "IN_PROGRESS", "DONE"];
  const users = session?.user
    ? [{ ...session.user }].filter((user): user is User => user.email !== null && user.email !== undefined)
    : [];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTasks();
    }
  }, [fetchTasks, status]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortCriteria(value);
  };

  const handleAddTask = async (task: {
    title: string;
    description: string;
    status: string;
    dueDate: Date;
    assignee: { id: string; name: string };
  }) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error("Failed to create task");

      toast({
        title: "Success",
        description: "Task created successfully",
      });
      setIsAddTaskOpen(false);
      fetchTasks();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = async (task: {
    id?: string; // Make id optional
    title: string;
    description: string;
    status: string;
    dueDate: Date;
    assignee: { id: string; name: string };
  }) => {
    if (!task.id) {
      toast({
        title: "Error",
        description: "Task ID is required for editing",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error("Failed to update task");

      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      setIsEditTaskOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      fetchTasks();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const closeTaskDialog = () => {
    setSelectedTask(null);
    setIsTaskDialogOpen(false);
  };

  const handleDragEnd = async (result: {
    source: { droppableId: string };
    destination: { droppableId: string } | null;
    draggableId: string;
  }) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;
    const taskId = draggableId;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update task status");

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      toast({
        title: "Success",
        description: "Task status updated",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const filterTasksByStatus = (status: string) => {
    return tasks
      .filter(
        (task) =>
          task.status === status &&
          (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortCriteria === "dueDate") {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else if (sortCriteria === "priority") {
          return (a.priority || 0) - (b.priority || 0);
        } else if (sortCriteria === "name") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  };

  const TaskCard = ({ task, index }: { task: Task; index: number }) => (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="cursor-pointer"
          onClick={() => handleTaskClick(task)}
        >
          <Card className="mb-4">
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div {...provided.dragHandleProps}>
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </div>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="sr-only">Open menu</span>
                      <Pencil className="mr-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTask(task);
                        setIsEditTaskOpen(true);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              {task.dueDate && (
                <p className="text-xs text-gray-500">
                  Due: {format(new Date(task.dueDate), "PPP")}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );

  return (
    <div className="space-y-4">
      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 bg-blue-600 p-4 rounded-lg">
            <Button
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => setIsAddTaskOpen(true)}
            >
              Add Task
            </Button>
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search tasks..."
                className="bg-white/10 text-white placeholder:text-white/70"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <Select defaultValue="dueDate" onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Sort by Due Date</SelectItem>
                <SelectItem value="priority">Sort by Priority</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statuses.map((status) => (
                <div key={status} className="bg-white rounded-lg shadow p-4">
                  <h2 className="font-semibold mb-4">
                    {status.replace("_", " ")}
                  </h2>
                  <Droppable droppableId={status}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[200px]"
                      >
                        {filterTasksByStatus(status).map((task, index) => (
                          <TaskCard key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>

          <AddTaskDialog
            isOpen={isAddTaskOpen}
            onClose={() => setIsAddTaskOpen(false)}
            onSave={handleAddTask}
            statuses={statuses}
            users={users}
          />

          <AddTaskDialog
            isOpen={isEditTaskOpen}
            onClose={() => {
              setIsEditTaskOpen(false);
              setEditingTask(null);
            }}
            onSave={handleEditTask}
            statuses={statuses}
            users={users}
            initialData={editingTask}
          />

          <TaskDialog
            isOpen={isTaskDialogOpen}
            onClose={closeTaskDialog}
            task={selectedTask}
          />
        </>
      )}
    </div>
  );
}
