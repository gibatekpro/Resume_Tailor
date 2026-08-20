export interface Category {
  id: number;
  name: string;
  colour: string;
  createdAt: string;
  appCount: number;
}

export interface CategoryCreateDto {
  name: string;
  colour: string;
}

export interface CategoryUpdateDto {
  name?: string;
  colour?: string;
}
