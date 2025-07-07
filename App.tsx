import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import ListView from './components/ListView';
import { ShoppingList } from './types';

const WelcomeScreen = () => (
    <div className="flex-1 flex flex-col justify-center items-center bg-dark text-gray-400 p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h2 className="text-3xl font-bold text-gray-300">Welcome to ListCal</h2>
        <p className="mt-2 text-lg">Create a new list or select one to get started.</p>
    </div>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);


function App() {
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('listcal-lists', []);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!activeListId && lists.length > 0) {
      setActiveListId(lists[0].id);
    }
    if (activeListId && !lists.some(list => list.id === activeListId)) {
        setActiveListId(lists.length > 0 ? lists[0].id : null);
    }
  }, [lists, activeListId]);

  const handleAddList = (name: string) => {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      items: [],
    };
    const updatedLists = [...lists, newList];
    setLists(updatedLists);
    setActiveListId(newList.id);
  };

  const handleDeleteList = (id: string) => {
      const updatedLists = lists.filter(list => list.id !== id);
      setLists(updatedLists);
  };

  const handleUpdateList = (updatedList: ShoppingList) => {
    const updatedLists = lists.map((list) =>
      list.id === updatedList.id ? updatedList : list
    );
    setLists(updatedLists);
  };

  const activeList = lists.find((list) => list.id === activeListId);

  return (
    <div className="flex h-screen font-sans bg-darker">
      {isSidebarOpen && (
          <Sidebar
            onClose={() => setIsSidebarOpen(false)}
            lists={lists}
            activeListId={activeListId}
            onSelectList={setActiveListId}
            onAddList={handleAddList}
            onDeleteList={handleDeleteList}
          />
      )}
      <main className="flex-1 flex flex-col overflow-x-hidden relative">
        {!isSidebarOpen && (
             <button
                onClick={() => setIsSidebarOpen(true)}
                className="absolute top-4 left-4 z-10 p-2 bg-primary hover:bg-blue-700 text-white rounded-md"
                aria-label="Open sidebar"
             >
                <MenuIcon />
            </button>
        )}
        {activeList ? (
          <ListView list={activeList} onUpdateList={handleUpdateList} />
        ) : (
          <WelcomeScreen />
        )}
      </main>
    </div>
  );
}

export default App;