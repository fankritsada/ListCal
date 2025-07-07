
export interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: Item[];
}
