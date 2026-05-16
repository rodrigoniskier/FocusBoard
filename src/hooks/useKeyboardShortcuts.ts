import React, { useEffect } from 'react';
import { useBoardStore } from '../store/useStore';
import { Status } from '../types';

export function useKeyboardShortcuts(
  onNewCard: () => void,
  focusedCardId: string | null = null,
  onOpenCard: (id: string) => void = () => {}
) {
  const { tasks, moveTask, setFocusedTask } = useBoardStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case 'n':
        case 'N':
          e.preventDefault();
          onNewCard();
          break;
        case 'Escape':
          setFocusedTask(null);
          break;
        case ' ':
          if (focusedCardId) {
            e.preventDefault();
            onOpenCard(focusedCardId);
          }
          break;
        case 'ArrowRight':
        case 'ArrowLeft':
          if (focusedCardId) {
            e.preventDefault();
            const task = tasks.find(t => t.id === focusedCardId);
            if (!task) return;
            
            const statuses: Status[] = ['TODO', 'DOING', 'DONE'];
            const currentIndex = statuses.indexOf(task.status);
            
            let newStatus: Status | null = null;
            if (e.key === 'ArrowRight' && currentIndex < statuses.length - 1) {
              newStatus = statuses[currentIndex + 1];
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
              newStatus = statuses[currentIndex - 1];
            }
            
            if (newStatus) {
               // Simulate a drag result to use the existing moveTask logic
               moveTask({
                  draggableId: task.id,
                  type: 'DEFAULT',
                  source: { droppableId: task.status, index: 0 },
                  destination: { droppableId: newStatus, index: 0 },
                  reason: 'DROP',
                  mode: 'FLUID'
               });
               // Optionally auto-focus next card or keep focus
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewCard, focusedCardId, onOpenCard, tasks, moveTask, setFocusedTask]);
}
