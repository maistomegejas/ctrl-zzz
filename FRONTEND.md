# Frontend Architecture - CTRL-ZZZ
## Vite + React + TypeScript + Redux + DaisyUI

## Tech Stack

- **Vite** - Build tool
- **React 18+** - UI library
- **TypeScript** - Type safety
- **React Router 6** - Routing
- **Redux Toolkit** - State management
- **DaisyUI + Tailwind CSS** - UI components and styling
- **Axios** - HTTP client
- **React Hook Form + Zod** - Forms & validation
- **@microsoft/signalr** - Real-time updates

## Project Structure

```
frontend/
├── src/
│   ├── components/                # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── MainLayout.tsx
│   │
│   ├── features/                  # Feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── authSlice.ts      # Redux slice
│   │   │   ├── authService.ts    # API calls
│   │   │   └── types.ts
│   │   │
│   │   ├── projects/
│   │   │   ├── components/
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── ProjectList.tsx
│   │   │   │   └── ProjectForm.tsx
│   │   │   ├── projectsSlice.ts
│   │   │   ├── projectService.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── workitems/
│   │   │   ├── components/
│   │   │   │   ├── WorkItemCard.tsx
│   │   │   │   ├── WorkItemList.tsx
│   │   │   │   ├── WorkItemDetail.tsx
│   │   │   │   ├── WorkItemForm.tsx
│   │   │   │   └── CommentsList.tsx
│   │   │   ├── workItemsSlice.ts
│   │   │   ├── workItemService.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── boards/
│   │   │   ├── components/
│   │   │   │   ├── KanbanBoard.tsx
│   │   │   │   ├── BoardColumn.tsx
│   │   │   │   └── BoardCard.tsx
│   │   │   ├── boardsSlice.ts
│   │   │   └── types.ts
│   │   │
│   │   └── sprints/
│   │       ├── components/
│   │       │   ├── SprintList.tsx
│   │       │   └── SprintForm.tsx
│   │       ├── sprintsSlice.ts
│   │       └── types.ts
│   │
│   ├── store/                     # Redux store
│   │   ├── index.ts              # Store configuration
│   │   └── hooks.ts              # Typed hooks
│   │
│   ├── services/                  # API services
│   │   ├── api.ts                # Axios instance
│   │   └── signalr.ts            # SignalR connection
│   │
│   ├── types/                     # Global types
│   │   └── index.ts
│   │
│   ├── hooks/                     # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   └── useSignalR.ts
│   │
│   ├── router/                    # Routes
│   │   ├── index.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── utils/                     # Utilities
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── App.tsx                    # Main app
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
│
├── .env.example
├── .env.development
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Key Patterns

### 1. Redux Slice Pattern

```typescript
// features/workitems/workItemsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { workItemService } from './workItemService';
import { WorkItem, CreateWorkItemDto } from './types';

interface WorkItemsState {
  items: WorkItem[];
  currentItem: WorkItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkItemsState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchWorkItems = createAsyncThunk(
  'workItems/fetchAll',
  async (projectId: string) => {
    const response = await workItemService.getAll(projectId);
    return response.data;
  }
);

export const createWorkItem = createAsyncThunk(
  'workItems/create',
  async (dto: CreateWorkItemDto) => {
    const response = await workItemService.create(dto);
    return response.data;
  }
);

// Slice
const workItemsSlice = createSlice({
  name: 'workItems',
  initialState,
  reducers: {
    setCurrentItem: (state, action: PayloadAction<WorkItem>) => {
      state.currentItem = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWorkItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch work items';
      })
      .addCase(createWorkItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const { setCurrentItem, clearError } = workItemsSlice.actions;
export default workItemsSlice.reducer;
```

### 2. API Service Pattern

```typescript
// features/workitems/workItemService.ts
import api from '@/services/api';
import { WorkItem, CreateWorkItemDto, UpdateWorkItemDto } from './types';

export const workItemService = {
  getAll: (projectId: string) =>
    api.get<WorkItem[]>(`/api/workitems?projectId=${projectId}`),

  getById: (id: string) =>
    api.get<WorkItem>(`/api/workitems/${id}`),

  create: (dto: CreateWorkItemDto) =>
    api.post<WorkItem>('/api/workitems', dto),

  update: (id: string, dto: UpdateWorkItemDto) =>
    api.put<WorkItem>(`/api/workitems/${id}`, dto),

  delete: (id: string) =>
    api.delete(`/api/workitems/${id}`),

  updateStatus: (id: string, statusId: string) =>
    api.patch(`/api/workitems/${id}/status`, { statusId }),
};
```

### 3. Axios Setup

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 4. Redux Store Setup

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import projectsReducer from '@/features/projects/projectsSlice';
import workItemsReducer from '@/features/workitems/workItemsSlice';
import sprintsReducer from '@/features/sprints/sprintsSlice';
import boardsReducer from '@/features/boards/boardsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    workItems: workItemsReducer,
    sprints: sprintsReducer,
    boards: boardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 5. Component with Redux

```typescript
// features/workitems/components/WorkItemList.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchWorkItems } from '../workItemsSlice';
import WorkItemCard from './WorkItemCard';

interface WorkItemListProps {
  projectId: string;
}

export default function WorkItemList({ projectId }: WorkItemListProps) {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.workItems);

  useEffect(() => {
    dispatch(fetchWorkItems(projectId));
  }, [dispatch, projectId]);

  if (loading) return <div className="loading loading-spinner"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <WorkItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### 6. Forms with React Hook Form + Zod

```typescript
// features/workitems/components/WorkItemForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '@/store/hooks';
import { createWorkItem } from '../workItemsSlice';

const workItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  projectId: z.string().uuid(),
  assigneeId: z.string().uuid().optional(),
  storyPoints: z.number().min(0).max(100).optional(),
});

type WorkItemFormData = z.infer<typeof workItemSchema>;

export default function WorkItemForm({ projectId }: { projectId: string }) {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WorkItemFormData>({
    resolver: zodResolver(workItemSchema),
    defaultValues: { projectId },
  });

  const onSubmit = async (data: WorkItemFormData) => {
    await dispatch(createWorkItem(data));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          {...register('title')}
          type="text"
          className="input input-bordered"
        />
        {errors.title && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.title.message}
            </span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Priority</span>
        </label>
        <select {...register('priority')} className="select select-bordered">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Create Work Item
      </button>
    </form>
  );
}
```

## Routing Setup

```typescript
// router/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '@/features/auth/components/LoginPage';
import ProjectsPage from '@/features/projects/pages/ProjectsPage';
import ProjectDetailPage from '@/features/projects/pages/ProjectDetailPage';
import BoardPage from '@/features/boards/pages/BoardPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <ProjectsPage />,
          },
          {
            path: '/projects/:projectId',
            element: <ProjectDetailPage />,
          },
          {
            path: '/projects/:projectId/board',
            element: <BoardPage />,
          },
        ],
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
```

```typescript
// router/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

## SignalR Setup

```typescript
// services/signalr.ts
import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection | null = null;

export const createSignalRConnection = (token: string) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_API_URL}/hubs/notifications`, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  return connection;
};

export const getConnection = () => connection;
```

```typescript
// hooks/useSignalR.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createSignalRConnection } from '@/services/signalr';
import { fetchWorkItems } from '@/features/workitems/workItemsSlice';

export const useSignalR = (projectId: string) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken) return;

    const connection = createSignalRConnection(accessToken);

    connection.start().then(() => {
      connection.invoke('JoinProject', projectId);

      // Listen for work item updates
      connection.on('WorkItemUpdated', (workItem) => {
        // Refresh work items or update specific item
        dispatch(fetchWorkItems(projectId));
      });
    });

    return () => {
      connection.invoke('LeaveProject', projectId);
      connection.stop();
    };
  }, [accessToken, projectId, dispatch]);
};
```

## DaisyUI Components

DaisyUI provides pre-built Tailwind components. Use them for quick development:

```tsx
// Button variants
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-error">Delete</button>

// Card
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Card Title</h2>
    <p>Card content</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Action</button>
    </div>
  </div>
</div>

// Modal
<dialog className="modal" id="my_modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Modal Title</h3>
    <p>Modal content</p>
    <div className="modal-action">
      <button className="btn">Close</button>
    </div>
  </div>
</dialog>

// Badge
<div className="badge badge-primary">Primary</div>
<div className="badge badge-error">Error</div>

// Loading spinner
<span className="loading loading-spinner loading-lg"></span>
```

## Tailwind Config

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark', 'cupcake'], // Choose themes
  },
};
```

## Environment Variables

```env
# .env.development
VITE_API_URL=http://localhost:5000
VITE_SIGNALR_URL=http://localhost:5000/hubs/notifications
```

## Main App Setup

```typescript
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import Router from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>
);
```

```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## TypeScript Config

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Vite Config

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "@reduxjs/toolkit": "^2.2.0",
    "react-redux": "^9.1.0",
    "axios": "^1.6.7",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    "@microsoft/signalr": "^8.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "tailwindcss": "^3.4.1",
    "daisyui": "^4.7.2",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35"
  }
}
```

---

**Version**: 1.0
**Updated**: 2025-11-05
