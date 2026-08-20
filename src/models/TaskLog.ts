export interface TaskLog {
  id: number;
  appId: number;
  appName: string;
  title: string;
  status: 'Open' | 'In Progress' | 'Completed';
  notes?: string;
  requestedBy?: string;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskLogCreateDto {
  appId: number;
  title: string;
  status: string;
  notes?: string;
  requestedBy?: string;
  assignedTo?: string;
  dueDate?: string;
}

export interface TaskLogUpdateDto {
  title?: string;
  status?: string;
  notes?: string;
  requestedBy?: string;
  assignedTo?: string;
  dueDate?: string;
}
