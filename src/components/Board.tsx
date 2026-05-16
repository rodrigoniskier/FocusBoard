import React, { useMemo } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useBoardStore } from '../store/useStore';
import { Column } from './Column';
import { Task } from '../types';

interface BoardProps {
  onCardClick: (id: string) => void;
}

export function Board({ onCardClick }: BoardProps) {
  const { tasks, searchQuery, moveTask } = useBoardStore();

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(lowerQuery) ||
          t.description.toLowerCase().includes(lowerQuery) ||
          t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    
    return filtered;
  }, [tasks, searchQuery]);

  const onDragEnd = (result: DropResult) => {
    // Only map exact fields we need to avoid passing non-serializable elements to store
    moveTask({
       draggableId: result.draggableId,
       type: result.type,
       reason: result.reason,
       mode: result.mode,
       source: {
          index: result.source.index,
          droppableId: result.source.droppableId
       },
       destination: result.destination ? {
          index: result.destination.index,
          droppableId: result.destination.droppableId
       } : undefined
    });
  };

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden select-none p-4 md:p-8">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row items-start gap-6 h-full min-w-0 md:min-w-max pb-4">
          <Column
            status="TODO"
            title="To Do"
            tasks={getTasksByStatus('TODO')}
            onCardClick={onCardClick}
          />
          <Column
            status="DOING"
            title="Doing"
            tasks={getTasksByStatus('DOING')}
            onCardClick={onCardClick}
          />
          <Column
            status="DONE"
            title="Done"
            tasks={getTasksByStatus('DONE')}
            onCardClick={onCardClick}
          />
        </div>
      </DragDropContext>
    </div>
  );
}
