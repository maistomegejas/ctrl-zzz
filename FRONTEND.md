# Frontend Architecture - CTRL-ZZZ
## React + TypeScript + Vite

## Technology Stack

### Core Technologies
- **React 18.3+** - UI library with concurrent features
- **TypeScript 5.3+** - Type safety and developer experience
- **Vite 5+** - Fast build tool and dev server
- **React Router 6** - Client-side routing

### State Management
- **Zustand** - Lightweight global state management
- **React Query (TanStack Query)** - Server state management, caching, and synchronization
- **Context API** - For theme, auth context, and other cross-cutting concerns

### UI/Component Library
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** or **Radix UI** - Accessible component primitives
- **React DnD** or **dnd-kit** - Drag and drop for boards
- **Lucide React** - Icon library
- **Framer Motion** - Animations

### Forms & Validation
- **React Hook Form** - Performant form management
- **Zod** - TypeScript-first schema validation

### Data Visualization
- **Recharts** or **Chart.js with React** - For reports, burndown charts, velocity charts

### Additional Tools
- **Axios** - HTTP client with interceptors
- **date-fns** - Date manipulation (lightweight alternative to moment.js)
- **React Hot Toast** or **Sonner** - Toast notifications
- **clsx** - Conditional className utility
- **SignalR Client** - Real-time updates

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **MSW (Mock Service Worker)** - API mocking for development and tests

## Project Structure

```
frontend/
├── public/                        # Static assets
│   ├── favicon.ico
│   └── assets/                   # Images, fonts, etc.
│
├── src/
│   ├── components/                # Reusable components
│   │   ├── common/               # Generic UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Modal/
│   │   │   ├── Dropdown/
│   │   │   ├── Avatar/
│   │   │   ├── Badge/
│   │   │   ├── Card/
│   │   │   ├── Table/
│   │   │   ├── Pagination/
│   │   │   ├── Spinner/
│   │   │   ├── ErrorBoundary/
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Breadcrumb/
│   │   │   ├── MainLayout/
│   │   │   └── index.ts
│   │   │
│   │   └── domain/               # Domain-specific reusable components
│   │       ├── WorkItemCard/
│   │       ├── WorkItemList/
│   │       ├── UserAvatar/
│   │       ├── PriorityBadge/
│   │       ├── StatusBadge/
│   │       ├── AssigneeSelect/
│   │       └── index.ts
│   │
│   ├── features/                  # Feature modules (co-located by domain)
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── ForgotPasswordForm.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useLogin.ts
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── services/
│   │   │   │   └── authService.ts
│   │   │   ├── store/
│   │   │   │   └── authStore.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── projects/
│   │   │   ├── components/
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── ProjectForm.tsx
│   │   │   │   ├── ProjectSettings.tsx
│   │   │   │   └── ProjectList.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProjects.ts
│   │   │   │   ├── useProject.ts
│   │   │   │   └── useCreateProject.ts
│   │   │   ├── pages/
│   │   │   │   ├── ProjectsPage.tsx
│   │   │   │   ├── ProjectDetailPage.tsx
│   │   │   │   └── ProjectSettingsPage.tsx
│   │   │   ├── services/
│   │   │   │   └── projectService.ts
│   │   │   └── types/
│   │   │       └── project.types.ts
│   │   │
│   │   ├── workitems/
│   │   │   ├── components/
│   │   │   │   ├── WorkItemForm.tsx
│   │   │   │   ├── WorkItemDetail.tsx
│   │   │   │   ├── WorkItemComments.tsx
│   │   │   │   ├── WorkItemActivity.tsx
│   │   │   │   ├── WorkItemAttachments.tsx
│   │   │   │   ├── CreateTaskModal.tsx
│   │   │   │   ├── CreateBugModal.tsx
│   │   │   │   ├── CreateStoryModal.tsx
│   │   │   │   └── CreateEpicModal.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useWorkItems.ts
│   │   │   │   ├── useWorkItem.ts
│   │   │   │   ├── useCreateWorkItem.ts
│   │   │   │   └── useUpdateWorkItem.ts
│   │   │   ├── pages/
│   │   │   │   ├── WorkItemsListPage.tsx
│   │   │   │   └── WorkItemDetailPage.tsx
│   │   │   ├── services/
│   │   │   │   └── workItemService.ts
│   │   │   └── types/
│   │   │       └── workitem.types.ts
│   │   │
│   │   ├── boards/
│   │   │   ├── components/
│   │   │   │   ├── KanbanBoard.tsx
│   │   │   │   ├── ScrumBoard.tsx
│   │   │   │   ├── BoardColumn.tsx
│   │   │   │   ├── BoardCard.tsx
│   │   │   │   ├── BoardFilters.tsx
│   │   │   │   └── BoardSettings.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useBoard.ts
│   │   │   │   └── useDragDrop.ts
│   │   │   ├── pages/
│   │   │   │   └── BoardPage.tsx
│   │   │   ├── services/
│   │   │   │   └── boardService.ts
│   │   │   └── types/
│   │   │       └── board.types.ts
│   │   │
│   │   ├── sprints/
│   │   │   ├── components/
│   │   │   │   ├── SprintList.tsx
│   │   │   │   ├── SprintForm.tsx
│   │   │   │   ├── SprintBacklog.tsx
│   │   │   │   └── SprintProgress.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useSprints.ts
│   │   │   │   └── useActiveSprint.ts
│   │   │   ├── pages/
│   │   │   │   ├── SprintsPage.tsx
│   │   │   │   └── SprintDetailPage.tsx
│   │   │   ├── services/
│   │   │   │   └── sprintService.ts
│   │   │   └── types/
│   │   │       └── sprint.types.ts
│   │   │
│   │   ├── backlog/
│   │   │   ├── components/
│   │   │   │   ├── BacklogList.tsx
│   │   │   │   ├── EpicSection.tsx
│   │   │   │   └── BacklogPrioritization.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useBacklog.ts
│   │   │   ├── pages/
│   │   │   │   └── BacklogPage.tsx
│   │   │   └── types/
│   │   │       └── backlog.types.ts
│   │   │
│   │   ├── reports/
│   │   │   ├── components/
│   │   │   │   ├── BurndownChart.tsx
│   │   │   │   ├── VelocityChart.tsx
│   │   │   │   ├── CumulativeFlowDiagram.tsx
│   │   │   │   ├── SprintReport.tsx
│   │   │   │   └── TeamPerformance.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useReportData.ts
│   │   │   ├── pages/
│   │   │   │   └── ReportsPage.tsx
│   │   │   └── types/
│   │   │       └── report.types.ts
│   │   │
│   │   ├── teams/
│   │   │   ├── components/
│   │   │   │   ├── TeamList.tsx
│   │   │   │   ├── TeamForm.tsx
│   │   │   │   └── TeamMembersList.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useTeams.ts
│   │   │   ├── pages/
│   │   │   │   └── TeamsPage.tsx
│   │   │   └── types/
│   │   │       └── team.types.ts
│   │   │
│   │   ├── users/
│   │   │   ├── components/
│   │   │   │   ├── UserProfile.tsx
│   │   │   │   └── UserSettings.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useUser.ts
│   │   │   ├── pages/
│   │   │   │   └── ProfilePage.tsx
│   │   │   └── types/
│   │   │       └── user.types.ts
│   │   │
│   │   └── notifications/
│   │       ├── components/
│   │       │   ├── NotificationBell.tsx
│   │       │   └── NotificationList.tsx
│   │       ├── hooks/
│   │       │   └── useNotifications.ts
│   │       └── types/
│   │           └── notification.types.ts
│   │
│   ├── hooks/                     # Global custom hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useClickOutside.ts
│   │   ├── useInfiniteScroll.ts
│   │   └── index.ts
│   │
│   ├── services/                  # Global services
│   │   ├── api/
│   │   │   ├── client.ts         # Axios instance configuration
│   │   │   ├── interceptors.ts   # Request/response interceptors
│   │   │   └── endpoints.ts      # API endpoint constants
│   │   ├── signalr/
│   │   │   └── hubConnection.ts  # SignalR setup
│   │   └── storage/
│   │       └── localStorage.ts   # Local storage wrapper
│   │
│   ├── store/                     # Global state management
│   │   ├── index.ts              # Export all stores
│   │   ├── uiStore.ts            # UI state (sidebar open, theme, etc.)
│   │   └── notificationStore.ts  # Global notifications
│   │
│   ├── types/                     # Global TypeScript types
│   │   ├── api.types.ts          # API response types
│   │   ├── common.types.ts       # Common shared types
│   │   └── index.ts
│   │
│   ├── utils/                     # Utility functions
│   │   ├── dateUtils.ts
│   │   ├── stringUtils.ts
│   │   ├── validationUtils.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   │
│   ├── styles/                    # Global styles
│   │   ├── index.css             # Tailwind imports
│   │   └── variables.css         # CSS custom properties
│   │
│   ├── router/                    # Routing configuration
│   │   ├── index.tsx             # Router setup
│   │   ├── routes.tsx            # Route definitions
│   │   └── ProtectedRoute.tsx    # Auth guard component
│   │
│   ├── config/                    # Configuration
│   │   ├── env.ts                # Environment variables with validation
│   │   └── constants.ts          # App-wide constants
│   │
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── vite-env.d.ts             # Vite type declarations
│
├── .env.example                   # Example environment variables
├── .env.development              # Development environment
├── .env.production               # Production environment
├── .eslintrc.cjs                 # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── index.html                    # HTML entry point
├── package.json
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.node.json            # TypeScript config for Vite
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
└── README.md
```

## Component Architecture

### Component Structure Pattern
Each component follows this structure:
```tsx
// Button.tsx
import { ComponentProps, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'button-base',
        variant === 'primary' && 'button-primary',
        variant === 'secondary' && 'button-secondary',
        variant === 'danger' && 'button-danger',
        size === 'sm' && 'button-sm',
        size === 'md' && 'button-md',
        size === 'lg' && 'button-lg',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
```

### Feature Module Pattern
Each feature is self-contained with its own:
- Components
- Hooks (React Query queries/mutations)
- Types
- Services
- Pages

Example:
```tsx
// features/workitems/hooks/useWorkItem.ts
import { useQuery } from '@tanstack/react-query';
import { workItemService } from '../services/workItemService';

export function useWorkItem(id: string) {
  return useQuery({
    queryKey: ['workItem', id],
    queryFn: () => workItemService.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// features/workitems/services/workItemService.ts
import { apiClient } from '@/services/api/client';
import { WorkItem, CreateWorkItemDto } from '../types/workitem.types';

export const workItemService = {
  getById: async (id: string): Promise<WorkItem> => {
    const response = await apiClient.get(`/api/v1/workitems/${id}`);
    return response.data.data;
  },

  create: async (dto: CreateWorkItemDto): Promise<WorkItem> => {
    const response = await apiClient.post('/api/v1/workitems', dto);
    return response.data.data;
  },

  // ... other methods
};
```

## State Management Strategy

### 1. Server State (React Query)
For all data from the API:
- Automatic caching
- Background refetching
- Optimistic updates
- Mutation handling

```tsx
// Query
const { data: workItems, isLoading, error } = useWorkItems(projectId);

// Mutation with optimistic update
const updateWorkItem = useMutation({
  mutationFn: workItemService.update,
  onMutate: async (updatedItem) => {
    await queryClient.cancelQueries({ queryKey: ['workItem', updatedItem.id] });
    const previousItem = queryClient.getQueryData(['workItem', updatedItem.id]);
    queryClient.setQueryData(['workItem', updatedItem.id], updatedItem);
    return { previousItem };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['workItem', variables.id], context?.previousItem);
  },
  onSettled: (data) => {
    queryClient.invalidateQueries({ queryKey: ['workItem', data?.id] });
  },
});
```

### 2. Client State (Zustand)
For UI state and client-only data:

```tsx
// store/uiStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'light',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
```

## Routing Strategy

### Route Structure
```
/                           → Landing/Dashboard
/auth/login                 → Login page
/auth/register              → Register page

/projects                   → All projects
/projects/:projectId        → Project detail

/projects/:projectId/board  → Kanban/Scrum board
/projects/:projectId/backlog → Product backlog
/projects/:projectId/sprints → Sprint management
/projects/:projectId/sprints/:sprintId → Sprint detail

/projects/:projectId/workitems → Work items list
/projects/:projectId/workitems/:workItemId → Work item detail

/projects/:projectId/reports → Reports dashboard
/projects/:projectId/settings → Project settings

/profile                    → User profile
/settings                   → User settings
/admin                      → Admin dashboard (role-based)
```

### Protected Routes
```tsx
// router/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
```

## API Integration

### Axios Setup
```tsx
// services/api/client.ts
import axios from 'axios';
import { API_BASE_URL } from '@/config/env';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
    }
    return Promise.reject(error);
  }
);
```

## Forms & Validation

### Form Pattern with React Hook Form + Zod
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  assigneeId: z.string().uuid().optional(),
  storyPoints: z.number().min(0).max(100).optional(),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export function CreateTaskForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
  });

  const onSubmit = (data: CreateTaskFormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('title')} error={errors.title?.message} />
      {/* Other fields */}
    </form>
  );
}
```

## Drag & Drop for Boards

### Using dnd-kit
```tsx
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export function KanbanBoard() {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Update work item status
      updateWorkItemStatus(active.id, over.id);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {columns.map((column) => (
        <SortableContext
          key={column.id}
          items={column.workItems}
          strategy={verticalListSortingStrategy}
        >
          <BoardColumn column={column} />
        </SortableContext>
      ))}
    </DndContext>
  );
}
```

## Real-time Updates with SignalR

```tsx
// services/signalr/hubConnection.ts
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export const createHubConnection = (token: string) => {
  return new HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/hubs/notifications`, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
};

// In component
useEffect(() => {
  const connection = createHubConnection(accessToken);

  connection.on('WorkItemUpdated', (workItem) => {
    // Invalidate React Query cache
    queryClient.invalidateQueries(['workItem', workItem.id]);
  });

  connection.start();

  return () => {
    connection.stop();
  };
}, [accessToken]);
```

## Performance Optimization

### Code Splitting
```tsx
// router/routes.tsx
import { lazy } from 'react';

const ProjectsPage = lazy(() => import('@/features/projects/pages/ProjectsPage'));
const BoardPage = lazy(() => import('@/features/boards/pages/BoardPage'));
```

### Virtual Scrolling for Large Lists
```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

export function WorkItemsList({ items }: { items: WorkItem[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div key={virtualItem.key} style={{ height: `${virtualItem.size}px` }}>
            <WorkItemCard item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## AI Integration Points (Future)

### Where AI Features Will Be Integrated

1. **Work Item Creation**
   - AI-assisted description generation
   - Automatic priority suggestion
   - Similar ticket detection

2. **Sprint Planning**
   - AI-generated sprint summaries
   - Capacity recommendations
   - Risk assessment

3. **Reports Dashboard**
   - AI insights on team performance
   - Predictive burndown
   - Anomaly detection alerts

4. **Search & Discovery**
   - Natural language search
   - Semantic work item matching

### Component Structure for AI Features
```tsx
// features/workitems/components/AISuggestions.tsx
export function AISuggestions({ workItemId }: { workItemId: string }) {
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['ai-suggestions', workItemId],
    queryFn: () => aiService.getSuggestions(workItemId),
    enabled: AI_FEATURES_ENABLED, // Feature flag
  });

  if (!AI_FEATURES_ENABLED) return null;

  return (
    <Card>
      <CardHeader>AI Suggestions</CardHeader>
      <CardBody>
        {suggestions?.map((suggestion) => (
          <SuggestionItem key={suggestion.id} suggestion={suggestion} />
        ))}
      </CardBody>
    </Card>
  );
}
```

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)
```tsx
// components/common/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests with MSW
```tsx
// features/workitems/hooks/useWorkItems.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useWorkItems } from './useWorkItems';

const server = setupServer(
  rest.get('/api/v1/workitems', (req, res, ctx) => {
    return res(ctx.json({ data: [{ id: '1', title: 'Test Task' }] }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('fetches work items', async () => {
  const { result } = renderHook(() => useWorkItems('project-1'));

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toHaveLength(1);
});
```

## Accessibility

- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- Color contrast compliance (WCAG AA)

## Internationalization (Future)

Setup for future i18n support:
- Use `react-i18next`
- Extract all strings to translation files
- Support for RTL languages

## Build & Deployment

### Development
```bash
npm run dev      # Start dev server
npm run test     # Run tests
npm run lint     # Lint code
```

### Production Build
```bash
npm run build    # Build for production
npm run preview  # Preview production build
```

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SIGNALR_HUB_URL=http://localhost:5000/hubs/notifications
VITE_AI_FEATURES_ENABLED=false
```

## Styling Strategy

### Tailwind Configuration
```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...},
        // Jira-like color palette
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### Component Styling Pattern
- Tailwind for layout and basic styling
- CSS modules for complex components (if needed)
- Consistent spacing scale (4px base)
- Design tokens in CSS variables

## Key UI/UX Considerations

1. **Responsive Design**: Mobile-first approach, works on tablets and desktops
2. **Loading States**: Skeleton loaders for better perceived performance
3. **Empty States**: Helpful messages and CTAs when no data
4. **Error States**: User-friendly error messages with retry options
5. **Optimistic UI**: Immediate feedback before server confirmation
6. **Keyboard Shortcuts**: Power user features (e.g., 'C' to create task)
7. **Dark Mode**: Support from day one

## Progressive Enhancement

Start with core functionality, progressively add:
1. Basic CRUD operations
2. Drag & drop
3. Real-time updates
4. Advanced filtering
5. AI features

---

**Document Version**: 1.0
**Last Updated**: 2025-11-05
**Status**: Planning Phase
