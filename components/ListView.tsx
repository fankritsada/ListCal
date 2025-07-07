
import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingList, Item } from '../types';


interface ListViewProps {
  list: ShoppingList;
  onUpdateList: (list: ShoppingList) => void;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
    
);

const ResetIcon = () => (
    // <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    //     <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
    // </svg>
<svg className="h-6 w-6 mr-2"  viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M426.667 106.667v42.666l-68.666-.003c36.077 31.659 58.188 77.991 58.146 128.474-.065 78.179-53.242 146.318-129.062 165.376s-154.896-15.838-191.92-84.695C58.141 289.63 72.637 204.42 130.347 151.68a85.33 85.33 0 0 0 33.28 30.507 124.59 124.59 0 0 0-46.294 97.066c1.05 69.942 58.051 126.088 128 126.08 64.072 1.056 118.71-46.195 126.906-109.749 6.124-47.483-15.135-92.74-52.236-118.947L320 256h-42.667V106.667zM202.667 64c23.564 0 42.666 19.103 42.666 42.667s-19.102 42.666-42.666 42.666S160 130.231 160 106.667 179.103 64 202.667 64" fillRule="evenodd"/></svg>

);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const QuantityStepper = ({ value, onChange } : {value: number, onChange: (newValue: number) => void}) => {
    return (
        <div className="flex items-center justify-center gap-1.5">
            <button
                type="button"
                onClick={() => onChange(Math.max(0, value - 1))}
                className="bg-secondary hover:bg-gray-600 rounded-md w-7 h-7 flex items-center justify-center text-xl font-bold transition-colors text-light"
                aria-label="Decrease quantity"
            >
             -
            </button>
            <input 
                type="text" 
                value={value} 
                onChange={(e) => {
                    const num = parseInt(e.target.value, 10);
                    onChange(isNaN(num) ? 0 : num);
                }}
                className="w-12 bg-dark text-center outline-none focus:bg-secondary rounded p-1 font-medium" 
            />
            <button
                type="button"
                onClick={() => onChange(value + 1)}
                className="bg-secondary hover:bg-gray-600 rounded-md w-7 h-7 flex items-center justify-center text-xl font-bold transition-colors text-light"
                aria-label="Increase quantity"
            >
             +
            </button>
        </div>
    );
};


const ListView: React.FC<ListViewProps> = ({ list, onUpdateList }) => {
  const [newItem, setNewItem] = useState({ name: '', quantity: '1', price: '' });
  const [editedListName, setEditedListName] = useState(list.name);
  const [isAddFormVisible, setAddFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // When the active list changes, exit edit mode and reset the temp list name.
    setEditedListName(list.name);
    setIsEditing(false);
  }, [list.id]);


  const total = useMemo(() => {
    return list.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }, [list.items]);

  const handleItemChange = (id: string, field: keyof Omit<Item, 'id'>, value: string | number) => {
    const updatedItems = list.items.map((item) => {
       if (item.id === id) {
           const parsedValue = (field === 'price' || field === 'quantity') && typeof value === 'string' 
                ? parseInt(value, 10) || 0 
                : value;
           return { ...item, [field]: parsedValue };
       }
       return item;
    });
    onUpdateList({ ...list, items: updatedItems });
  };
  
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseInt(newItem.quantity, 10);
    const price = parseInt(newItem.price, 10);

    if (newItem.name.trim() && !isNaN(quantity) && quantity >= 0 && !isNaN(price) && price >= 0) {
      const item: Item = {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        quantity,
        price,
      };
      onUpdateList({ ...list, items: [...list.items, item] });
      setNewItem({ name: '', quantity: '1', price: '' });
      setAddFormVisible(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = list.items.filter((item) => item.id !== id);
    onUpdateList({ ...list, items: updatedItems });
  };
  
  const handleResetQuantities = () => {
    const resetItems = list.items.map(item => ({...item, quantity: 0}));
    onUpdateList({...list, items: resetItems});
  };
  
  const handleSaveListName = (e?: React.FormEvent) => {
    e?.preventDefault();
    if(editedListName.trim() && editedListName.trim() !== list.name){
      onUpdateList({...list, name: editedListName.trim()});
    }
  };

  const toggleEditMode = () => {
      if (isEditing) {
          handleSaveListName();
      }
      setIsEditing(prev => !prev);
  }


  return (
    <div className="flex-1 flex flex-col bg-dark text-light p-8 overflow-y-auto">
      <header className="mb-6 flex justify-between items-center ml-8 -mt-4">
        {isEditing ? (
             <form onSubmit={handleSaveListName} className="flex-grow">
                 <input
                    type="text"
                    value={editedListName}
                    onChange={(e) => setEditedListName(e.target.value)}
                    onBlur={() => handleSaveListName()}
                    className="text-4xl font-extrabold text-white bg-transparent w-full focus:outline-none focus:border-accent border-b-2 border-transparent"
                    autoFocus
                />
            </form>
        ) : (
             <h2 className="text-4xl font-extrabold text-white">{list.name}</h2>
        )}
      </header>
      
      {isAddFormVisible ? (
        <form onSubmit={handleAddItem} className="mb-6 flex flex-wrap gap-4 items-end bg-darker p-4 rounded-lg">
            <div className="flex-grow min-w-[200px]">
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-400 mb-1">Item Name</label>
                <input id="itemName" type="text" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} placeholder="e.g., Apples" className="w-full bg-secondary text-light p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" required autoFocus/>
            </div>
            
            <div>
                <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-400 mb-1">Price</label>
                <input id="itemPrice" type="number" min="0" step="1" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} placeholder="e.g., 2" className="w-28 bg-secondary text-light p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent" required/>
            </div>
            <div className="flex gap-2">
                <button type="submit" className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors h-10">Add</button>
                <button type="button" onClick={() => setAddFormVisible(false)} className="bg-secondary hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors h-10">Cancel</button>
            </div>
        </form>
      ) : (
        <div className="mb-6">
            <button onClick={() => setAddFormVisible(true)} className="flex items-center bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                <PlusIcon/> Add New Item
            </button>
        </div>
      )}


      <div className="flex-grow">
        <table className="w-full text-left">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="p-2 w-2/5">Name</th>
              <th className="p-2 w-1/5 text-center">Quantity</th>
              <th className="p-2 w-1/5 text-right">Price</th>
              <th className="p-2 w-1/5 text-right">Subtotal</th>
              <th className="p-2 text-center w-[5%]">{isEditing ? 'Del' : ''}</th>
            </tr>
          </thead>
          <tbody>
            {list.items.map(item => (
              <tr key={item.id} className="border-b border-gray-800 hover:bg-darker">
                <td className="p-2">
                    {isEditing ? (
                        <input  type="text" value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} className="w-full bg-transparent outline-none focus:bg-secondary rounded p-1"/>
                    ) : (
                        item.name
                    )}
                </td>
                <td className="p-2">
                    <QuantityStepper value={item.quantity} onChange={(newVal) => handleItemChange(item.id, 'quantity', newVal)} />
                </td>
                <td className="p-2 text-right">
                    {isEditing ? (
                         <input type="number" min="0" step="1" value={item.price}  onChange={(e) => handleItemChange(item.id, 'price', e.target.value)} className="w-24 bg-transparent text-right outline-none focus:bg-secondary rounded p-1"/>
                    ) : (
                        item.price
                    )}
                </td>
                <td className="p-2 text-right text-gray-400">${(item.quantity * item.price).toFixed(2)}</td>
                <td className="p-2 text-center">
                    {isEditing && (
                        <button onClick={() => handleDeleteItem(item.id)} className="text-gray-500 hover:text-red-500 transition-colors p-1"><TrashIcon/></button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-8 pt-4 border-t-2 border-gray-700 flex justify-between items-center">
        <div className="flex gap-4">
            <button onClick={toggleEditMode} className="flex items-center bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                <EditIcon/> {isEditing ? 'Done' : 'Edit List'}
            </button>
            <button onClick={handleResetQuantities} className="flex items-center bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                <ResetIcon/> Reset Quantities
            </button>
        </div>
        <div className="text-right">
          <span className="text-lg text-gray-400">Total:</span>
          <span className="text-3xl font-bold text-accent ml-2">${total.toFixed(2)}</span>
        </div>
      </footer>

    </div>
  );
};

export default ListView;
