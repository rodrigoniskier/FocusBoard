import React, { useState } from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { CardEditor } from './components/CardEditor';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useBoardStore } from './store/useStore';

export default function App() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const { tasks, focusedTaskId } = useBoardStore();

  const handleOpenNewCard = () => {
    setEditingTaskId(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditCard = (id: string) => {
    setEditingTaskId(id);
    setIsEditorOpen(true);
  };

  useKeyboardShortcuts(handleOpenNewCard, focusedTaskId, handleOpenEditCard);

  const editingTask = editingTaskId ? tasks.find(t => t.id === editingTaskId) : null;

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-200 overflow-hidden">
      <Header onNewTask={handleOpenNewCard} />
      
      <main className="flex-1 flex overflow-hidden">
        <Board onCardClick={handleOpenEditCard} />
      </main>

      {isEditorOpen && (
        <CardEditor 
          task={editingTask} 
          onClose={() => {
            setIsEditorOpen(false);
            setEditingTaskId(null);
          }} 
        />
      )}
    </div>
  );
}

