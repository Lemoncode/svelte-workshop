export interface Item {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  itemCollection: Item[];
}

export const createNewItem = (): Item => ({
  name: "",
  quantity: 1,
  price: 0,
});
