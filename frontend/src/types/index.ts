export enum WorkItemType {
  Epic = 0,
  Story = 1,
  Task = 2,
  Bug = 3,
  Subtask = 4
}

export enum WorkItemStatus {
  ToDo = 0,
  InProgress = 1,
  InReview = 2,
  Done = 3,
  Blocked = 4
}

export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3,
  Blocker = 4
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt?: string
}

export interface Project {
  id: string
  name: string
  key: string
  description?: string
  ownerId: string
  createdAt: string
  updatedAt?: string
}

export interface WorkItem {
  id: string
  title: string
  description?: string
  type: WorkItemType
  status: WorkItemStatus
  priority: Priority
  storyPoints?: number
  originalEstimateMinutes?: number
  remainingEstimateMinutes?: number
  timeLoggedMinutes?: number
  projectId: string
  assigneeId?: string
  reporterId?: string
  parentId?: string
  sprintId?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateProjectDto {
  name: string
  key: string
  description?: string
  ownerId: string
}

export interface CreateWorkItemDto {
  title: string
  description?: string
  type: WorkItemType
  priority: Priority
  storyPoints?: number
  projectId: string
  assigneeId?: string
  reporterId?: string
  parentId?: string
  sprintId?: string
}

export interface UpdateWorkItemDto {
  title: string
  description?: string
  status: WorkItemStatus
  priority: Priority
  storyPoints?: number
  originalEstimateMinutes?: number
  remainingEstimateMinutes?: number
  timeLoggedMinutes?: number
  assigneeId?: string
  reporterId?: string
  sprintId?: string
}

export interface CreateUserDto {
  email: string
  name: string
  password: string
}

export interface Sprint {
  id: string
  name: string
  goal?: string
  startDate?: string
  endDate?: string
  isActive: boolean
  isCompleted: boolean
  projectId: string
  createdAt: string
  updatedAt?: string
}

export interface CreateSprintDto {
  name: string
  goal?: string
  endDate?: string
  projectId: string
}

export interface UpdateSprintDto {
  name: string
  goal?: string
  endDate?: string
}

export interface Comment {
  id: string
  content: string
  workItemId: string
  userId?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateCommentDto {
  content: string
  workItemId: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  name: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
}
