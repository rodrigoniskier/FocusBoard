import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task, Status, Priority, DragResult } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface BoardState {
  tasks: Task[];
  searchQuery: string;
  statusFilter: Status | 'ALL';
  priorityFilter: Priority | 'ALL';
  tagFilter: string;
  isSyncing: boolean;
  focusedTaskId: string | null;
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (result: DragResult) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: Status | 'ALL') => void;
  setPriorityFilter: (priority: Priority | 'ALL') => void;
  setTagFilter: (tag: string) => void;
  setFocusedTask: (id: string | null) => void;
  importBoard: (data: any) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      tasks: [],
      searchQuery: '',
      statusFilter: 'ALL',
      priorityFilter: 'ALL',
      tagFilter: '',
      isSyncing: false,
      focusedTaskId: null,

      addTask: (taskData) => {
        set((state) => {
          const newTask: Task = {
            ...taskData,
            id: uuidv4(),
            createdAt: Date.now(),
          };
          return { tasks: [...state.tasks, newTask] };
        });
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      moveTask: (result: DragResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (
          destination.droppableId === source.droppableId &&
          destination.index === source.index
        ) {
          return;
        }

        set((state) => {
          const newTasks = Array.from(state.tasks);
          
          // Reordering logic
          // Find the task being moved
          const taskIndex = newTasks.findIndex(t => t.id === draggableId);
          if (taskIndex === -1) return state;
          
          const task = newTasks[taskIndex];
          const newStatus = destination.droppableId as Status;
          
          // Update status if column changed
          if (task.status !== newStatus) {
            newTasks[taskIndex] = { ...task, status: newStatus };
          }
          
          // Reorder arrays based on position if we wanted exact persistent ordering,
          // but for simplicity, we map status exactly.
          // Note: In a production heavily-ordered board, we'd store a `position` or `order` field.
          // Here we just mutate status and rely on React UI rendering based on created/moved.
          // Alternatively, let's splice to rearrange.
          
          const updatedTask = newTasks.splice(taskIndex, 1)[0];
          updatedTask.status = newStatus;
          
          // Figure out where to insert it in the full tasks array.
          // We need to find the destination index among the filtered list of same status.
          const tasksInDestStatus = newTasks.filter(t => t.status === newStatus);
          if (destination.index >= tasksInDestStatus.length) {
            newTasks.push(updatedTask);
          } else {
            const referenceTask = tasksInDestStatus[destination.index];
            const insertIndex = newTasks.findIndex(t => t.id === referenceTask.id);
            newTasks.splice(insertIndex, 0, updatedTask);
          }
          
          return { tasks: newTasks };
        });
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setStatusFilter: (status) => set({ statusFilter: status }),
      setPriorityFilter: (priority) => set({ priorityFilter: priority }),
      setTagFilter: (tag) => set({ tagFilter: tag }),
      setFocusedTask: (id) => set({ focusedTaskId: id }),
      
      importBoard: (data) => {
        if (data && Array.isArray(data.tasks)) {
          set({ tasks: data.tasks });
        }
      }
    }),
    {
      name: 'focusboard-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isSyncing = false; // Finished loading
        }
      },
    }
  )
);
