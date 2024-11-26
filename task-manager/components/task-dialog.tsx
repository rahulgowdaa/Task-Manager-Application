"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    title: string;
    description: string;
    dueDate?: string; // Added due date field
    createdAt?: string;
    status?: string; // Added status field
    priority?: number; // Added priority field
  } | null;
}

export function TaskDialog({ isOpen, onClose, task }: TaskDialogProps) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-light-sky-blue rounded-lg">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Task Title */}
          <div>
            <h3 className="font-medium text-gray-800">Title: {task.title}</h3>
          </div>

          {/* Task Description */}
          <div>
            <p className="text-sm text-gray-600">
              Description: {task.description}
            </p>
          </div>

          {/* Task Status */}
          {task.status && (
            <div>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span className="font-medium capitalize">
                  {task.status.replace("_", " ")}
                </span>
              </p>
            </div>
          )}

          {/* Task Priority */}
          {task.priority !== undefined && (
            <div>
              <p className="text-sm text-gray-600">
                Priority:{" "}
                <span className="font-medium">{task.priority}</span>
              </p>
            </div>
          )}

          {/* Task Due Date */}
          {task.dueDate && (
            <div>
              <p className="text-sm text-gray-600">
                Due Date:{" "}
                <span className="font-medium">
                  {format(new Date(task.dueDate), "PPP")}
                </span>
              </p>
            </div>
          )}

          {/* Task Creation Date */}
          {task.createdAt && (
            <div>
              <p className="text-sm text-gray-600">
                Created At:{" "}
                <span className="font-medium">
                  {format(new Date(task.createdAt), "PPP")}
                </span>
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
