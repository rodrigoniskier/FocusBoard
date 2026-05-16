import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { useBoardStore } from '../store/useStore';
import { Task, Status, Priority } from '../types';

interface CardEditorProps {
  task?: Task | null;
  onClose: () => void;
}

export function CardEditor({ task, onClose }: CardEditorProps) {
  const { addTask, updateTask, deleteTask } = useBoardStore();
  
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<Status>(task?.status || 'TODO');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'MEDIUM');
  const [tagsInput, setTagsInput] = useState(task?.tags?.join(', ') || '');

  // Handle Escape and Enter in the editor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && e.ctrlKey) {
         // Ctrl+Enter to save to avoid preventing newlines in textarea
         handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, description, status, priority, tagsInput]);
  
  // Also autofocus title
  useEffect(() => {
    document.getElementById('task-title-input')?.focus();
  }, []);

  const handleSave = () => {
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (task) {
      updateTask(task.id, { title, description, status, priority, tags });
    } else {
      addTask({ title, description, status, priority, tags });
    }
    onClose();
  };

  const handleDelete = () => {
    if (task && window.confirm('Are you sure you want to delete this card?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg w-full overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            {task ? 'Edit Card' : 'New Card'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label htmlFor="task-title-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Title *
            </label>
            <input
              id="task-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Update landing page copy"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="TODO">To Do</option>
                <option value="DOING">Doing</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
               Description (Markdown supported)
             </label>
             <textarea
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               rows={4}
               placeholder="- Task 1\n- Task 2"
               className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm outline-none transition-colors"
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
               Tags (comma separated)
             </label>
             <input
               type="text"
               value={tagsInput}
               onChange={(e) => setTagsInput(e.target.value)}
               placeholder="frontend, design, bug"
               className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
             />
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="text-xs text-slate-500 dark:text-slate-400">
             Tip: Press <kbd className="bg-slate-200 dark:bg-slate-600 px-1 rounded">Ctrl</kbd> + <kbd className="bg-slate-200 dark:bg-slate-600 px-1 rounded">Enter</kbd> to save
          </div>
          <div className="flex gap-2">
            {task && (
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors text-sm font-medium"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            )}
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm shadow-blue-200 dark:shadow-none text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 transition-colors"
              disabled={!title.trim()}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
