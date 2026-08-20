export interface App {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  categoryColour: string;
  description: string;
  owner: string;
  status: 'Active' | 'Inactive' | 'Deprecated';
  url?: string;
  tags?: string;
  createdAt: string;
  taskCount: number;
  openTaskCount: number;
}

export interface AppCreateDto {
  name: string;
  categoryId: number;
  description: string;
  owner: string;
  status: string;
  url?: string;
  tags?: string;
}

export interface AppUpdateDto {
  name?: string;
  categoryId?: number;
  description?: string;
  owner?: string;
  status?: string;
  url?: string;
  tags?: string;
}
