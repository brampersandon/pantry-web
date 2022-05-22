import { useEffect, useState } from 'react';
import { useCollection, useFirestoreAdd, useFirestoreDelete, useFirestoreEdit, useFirestoreQuery } from '../hooks/firebase';
import { createContainer } from 'unstated-next';
import type { Timestamp } from '../firebase';
import { FirebaseContainer } from './firebase';

export type Duration = 'short' | 'medium' | 'long';
export enum ItemStatus {
  fresh = 'fresh',
  frozen = 'frozen',
  used = 'used',
  discarded = 'discarded'
}
export interface Item {
  name: string;
  duration: Duration;
  quantity: number;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  userId: string;
  status: ItemStatus;
  id?: string;
}

const useItems = () => {
  const collection = useCollection('items');
  const [items, setItems] = useState<Item[]>([]);
  const {user} = FirebaseContainer.useContainer()

  const list = useFirestoreQuery<Required<Item>>('items');
  const add = useFirestoreAdd<Item>('items');
  const edit = useFirestoreEdit<Item>('items')
  const deleteFn = useFirestoreDelete('items')

  const listQuery = user != null ? collection.where('userId', '==', user?.uid).limit(10) : collection.limit(10)

  const refetchList = async () => {
    return list.execute(listQuery)
  }
  const deleteItem = async (id: string) => {
    await deleteFn.execute(id)
    setItems((old) => old.filter(i => i.id != id))
  }

  const editItem = async (id: string, data: Partial<Item>) => {
    await edit.execute(id, data)
    setItems(old => old.map((item) => {
      if (item.id === id) return {...item, ...data}
      return item
    }) as Item[])
  }

  useEffect(() => {
    list.execute(listQuery);
  }, []);

  useEffect(() => {
    if (list.value != null) setItems(list.value);
  }, [list.value]);

  return { items, setItems, list, refetchList, add, editItem, deleteItem };
};

export const ItemsContainer = createContainer(useItems);
