import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, GripVertical } from 'lucide-react';
import { Task } from '../types';
import { useBoardStore } from '../store/useStore';
import { cn } from '../lib/utils';

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: (id: string) => void;
}

const priorities = {
  LOW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  MEDIUM: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  HIGH: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  const { focusedTaskId, setFocusedTask } = useBoardStore();
  const isFocused = focusedTaskId === task.id;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(task.id);
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            'group relative p-4 mb-3 rounded-lg border card-shadow transition-all duration-200 outline-none cursor-grab active:cursor-grabbing',
            'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700',
            snapshot.isDragging 
              ? 'ring-4 ring-blue-500/20 border-blue-500 shadow-lg opacity-90 scale-[1.02] z-50'
              : 'hover:border-blue-300 dark:hover:border-blue-500/50',
            isFocused && 'ring-2 ring-blue-500 border-transparent shadow-md'
          )}
          onClick={() => {
            onClick(task.id);
            setFocusedTask(task.id);
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`Card: ${task.title}. Priority: ${task.priority}. Status: ${task.status}. Press space to edit.`}
        >
          {/* Drag Handle purely visual/accessible for screen readers, but whole card is draggable */}
          <div
            {...provided.dragHandleProps}
            className="absolute top-4 right-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            aria-label={`Drag handle for ${task.title}`}
          >
            <GripVertical className="w-5 h-5" />
          </div>

          <div className="mb-2 flex flex-wrap items-center gap-1.5 pr-6">
            <span
              className={cn(
                'px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider',
                priorities[task.priority]
              )}
            >
              {task.priority}
            </span>
            {task.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-slate-800 dark:text-white leading-tight mb-2">
            {task.title}
          </h3>

          {task.description && (
             <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 prose prose-sm dark:prose-invert max-w-none pointer-events-none">
               <ReactMarkdown>{task.description}</ReactMarkdown>
             </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center text-[10px] text-slate-400 dark:text-slate-500 font-medium font-mono">
               <Clock className="w-3 h-3 mr-1" />
               {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
