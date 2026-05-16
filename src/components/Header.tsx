import React, { useEffect, useState } from 'react';
import { useBoardStore } from '../store/useStore';
import { debounce } from '../lib/utils';
import { Download, Upload, Plus, Sun, Moon, Search, CheckCircle } from 'lucide-react';

interface HeaderProps {
  onNewTask: () => void;
}

export function Header({ onNewTask }: HeaderProps) {
  const { searchQuery, setSearchQuery, isSyncing, tasks, importBoard } = useBoardStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
  };

  const debouncedSearch = React.useCallback(
    debounce((q: string) => setSearchQuery(q), 300),
    [setSearchQuery]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ tasks }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'focusboard-export.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          importBoard(parsed);
          alert('Board imported successfully!');
        } catch (error) {
          alert('Failed to import JSON file. Ensure it is a valid FocusBoard backup.');
        }
      };
    }
  };

  return (
    <header className="px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0 shadow-sm transition-all z-10">
      <div className="flex items-center gap-8 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">FocusBoard</h1>
        </div>

        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="Search cards... (/)"
            value={localSearch}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-700 border-transparent rounded-md text-sm w-64 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            aria-label="Search tasks"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 justify-end">
        {!isSyncing && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-800/50" aria-label="Status: Saved" role="status">
            <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold uppercase tracking-wider">Synced</span>
          </div>
        )}

        <div className="flex items-center space-x-1 shrink-0">
          <label className="cursor-pointer p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors" aria-label="Import board">
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            <Upload className="w-5 h-5" />
          </label>
          <button onClick={handleExport} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors" aria-label="Export board">
            <Download className="w-5 h-5" />
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={onNewTask}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm flex items-center gap-2 hover:bg-blue-700 shadow-sm transition-all shadow-blue-200 dark:shadow-none"
            aria-label="New card (Shortcut: N)"
          >
            <Plus className="w-4 h-4" />
            New Card <kbd className="hidden sm:inline-block ml-1 px-1 bg-blue-500 rounded text-[10px] opacity-80">N</kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
