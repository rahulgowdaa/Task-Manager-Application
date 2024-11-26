"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { User } from "@/types"
import { UserAvatar } from "./user-avatar"

interface Task {
  id: string
  title: string
  description: string
  status: string
  dueDate: string
  userId: string
}

interface AddTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: { 
    id?: string
    title: string
    description: string
    status: string
    dueDate: Date
    assignee: { id: string; name: string }
  }) => void
  statuses: string[]
  users: User[]
  initialData?: Task | null
}

export function AddTaskDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  statuses, 
  users,
  initialData 
}: AddTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState(statuses[0])
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [assignee, setAssignee] = useState<User | null>(null)

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description)
      setStatus(initialData.status)
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate) : undefined)
      const taskUser = users.find(u => u.id === initialData.userId)
      setAssignee(taskUser || null)
    } else {
      // Reset form when adding new task
      setTitle("")
      setDescription("")
      setStatus(statuses[0])
      setDueDate(undefined)
      setAssignee(null)
    }
  }, [initialData, users, statuses])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (dueDate && assignee) {
      onSave({
        id: initialData?.id,
        title,
        description,
        status,
        dueDate,
        assignee: {
          id: assignee.id,
          name: assignee.firstName || assignee.lastName || "Unknown User", // Use a fallback for name
        },
      });
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <label htmlFor="assignee" className="text-sm font-medium">
              Assignee
            </label>
            <Select 
              value={assignee?.id} 
              onValueChange={(value) => setAssignee(users.find(u => u.id === value) || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Assign to..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center">
                      <UserAvatar user={user} size="sm" />
                      <span className="ml-2">{user.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Save Changes' : 'Add Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

