import React, { useState } from 'react';
import { ShoppingList } from '../types';
import Modal from './Modal';

interface SidebarProps {
  lists: ShoppingList[];
  activeListId: string | null;
  onSelectList: (id: string) => void;
  onAddList: (name: string) => void;
  onDeleteList: (id: string) => void;
  onClose: () => void;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ lists, activeListId, onSelectList, onAddList, onDeleteList, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onAddList(newListName.trim());
      setNewListName('');
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-col flex-shrink-0 h-screen bg-darker text-light border-r border-gray-700 w-64">
        <header className="p-4 flex-shrink-0 flex justify-between items-center border-b border-gray-700">
            <h1 className="text-3xl font-bold text-accent">ListCal</h1>
            <div><p className="-ml-4 text-xs  text-accent">By Fankrits</p>
             <p className="flex -ml-4 text-xs  text-accent">& Gemini 
              <svg fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z" fill="url(#prefix__paint0_radial_980_20147)"/><defs><radialGradient id="prefix__paint0_radial_980_20147" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"><stop offset=".067" stopColor="#9168C0"/><stop offset=".343" stopColor="#5684D1"/><stop offset=".672" stopColor="#1BA1E3"/></radialGradient></defs></svg></p> </div>
           
            <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:bg-secondary hover:text-white transition-colors" aria-label="Close sidebar">
                <CloseIcon />
            </button>
        </header>

        <div className="p-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            aria-label="Create New List"
          >
            <PlusIcon />
            <span className="ml-2">New List</span>
          </button>
        </div>
        
        <nav className="flex-grow overflow-y-auto px-4">
          <ul>
            {lists.map((list) => (
              <li key={list.id} className="my-1 group">
                <div
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer transition-colors ${
                    activeListId === list.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => onSelectList(list.id)}
                  title={list.name}
                >
                    <span className="truncate flex-1">{list.name}</span>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteList(list.id); }} className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrashIcon/>
                    </button>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New List">
        <form onSubmit={handleAddList}>
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Enter list name"
            className="w-full bg-secondary text-light p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
            autoFocus
          />
          <button
            type="submit"
            className="mt-4 w-full bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Create
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Sidebar;