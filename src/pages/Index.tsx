
import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim() !== '') {
      const task: Task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Checklist</h1>
          <p className="text-gray-600">Stay organized and get things done</p>
          {totalCount > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              {completedCount} of {totalCount} tasks completed
            </div>
          )}
        </div>

        {/* Add Task Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border-gray-200 focus:border-blue-400 focus:ring-blue-100"
            />
            <Button 
              onClick={addTask}
              className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Check className="h-16 w-16 mx-auto opacity-20" />
              </div>
              <p className="text-gray-500 text-lg">No tasks yet</p>
              <p className="text-gray-400 text-sm">Add your first task above to get started</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {task.completed && <Check className="h-3 w-3 text-white" />}
                  </button>
                  
                  <span
                    className={`flex-1 transition-all duration-200 ${
                      task.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {task.text}
                  </span>
                  
                  <Button
                    onClick={() => deleteTask(task.id)}
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
