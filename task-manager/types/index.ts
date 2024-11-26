export interface User {
  id: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  image?: string | null;
  avatarUrl?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  dueDate: string;
  assignee: User | null;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

