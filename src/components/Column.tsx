import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Task, Status } from '../types';
import { TaskCard } from './TaskCard';
import { cn } from '../lib/utils';
import { MoreHorizontal, GripHorizontal } from 'lucide-react';

interface ColumnProps {
  status: Status;
  title: string;
  tasks: Task[];
  onCardClick: (id: string) => void;
}

const statusColors = {
  TODO: 'bg-slate-100/50 border border-slate-200/60 dark:bg-slate-800/50 dark:border-slate-700/60',
  DOING: 'bg-blue-50/30 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/50',
  DONE: 'bg-slate-100/50 border border-slate-200/60 dark:bg-slate-800/50 dark:border-slate-700/60',
};

const titleColors = {
  TODO: 'text-slate-700 dark:text-slate-200',
  DOING: 'text-blue-800 dark:text-blue-300',
  DONE: 'text-slate-700 dark:text-slate-200'
};

const badgeColors = {
  TODO: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  DOING: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  DONE: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
};

export function Column({ status, title, tasks, onCardClick }: ColumnProps) {
  return (
    <div className={cn("kanban-column flex flex-col flex-shrink-0 w-full rounded-xl max-h-full p-4", statusColors[status])}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className={cn("font-bold", titleColors[status])}>
            {title}
          </h2>
          <span className={cn("px-2 py-0.5 rounded text-xs font-bold", badgeColors[status])}>
            {tasks.length}
          </span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" aria-label="Column actions">
           <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                'min-h-[150px] min-h-full pb-8 transition-colors rounded-lg',
                snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
              )}
            >
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onClick={onCardClick}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}
