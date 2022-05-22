import { useState, useCallback } from 'react';
import { FirebaseContainer } from '../containers/firebase';
import type {
  DocumentReference,
  FirebaseApp,
  FirebaseUser,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from '../firebase';

interface FirestoreDocBase {
  id?: string;
}

// Because we are after the `AppGate`, we know the app must be present
export const useApp = () => {
  const { app } = FirebaseContainer.useContainer();

  return app as FirebaseApp;
};

export const useUser = () => {
  const { user } = FirebaseContainer.useContainer();

  return user as FirebaseUser;
};

export const useCollection = (name: string) => {
  const app = useApp();
  const db = app.firestore();
  return db.collection(name);
};

export const useFirestoreAdd = <T,>(collectionName: string) => {
  const collection = useCollection(collectionName);
  const ret = useAsync<DocumentReference>(async (data: T) => {
    return collection.add(data);
  });

  return ret;
};

export const useFirestoreEdit = <T,>(collectionName: string) => {
  const collection = useCollection(collectionName);
  const ret = useAsync<void>(async (id: string, data: T) => {
    return collection.doc(id).update(data);
  });

  return ret;
};

export const useFirestoreDelete = (collectionName: string) => {
  const collection = useCollection(collectionName);
  const ret = useAsync<void>(async (id: string) => {
    return collection.doc(id).delete();
  });

  return ret;
};

const createDataFromDoc = <T,>(
  doc: QueryDocumentSnapshot,
): T & FirestoreDocBase => {
  return {
    ...(doc.data() as T),
    id: doc.id,
  };
};

export const useFirestoreQuery = <T extends FirestoreDocBase>(
  collectionName: string,
) => {
  const collection = useCollection(collectionName);
  const ret = useAsync<T[]>(async (query) => {
    const result = await query.get();
    return result.docs.map((d: QueryDocumentSnapshot) => {
      return createDataFromDoc(d) as T;
    });
  });
  return {
    collection,
    ...ret,
  };
};

type AsyncStatus = 'notasked' | 'loading' | 'success' | 'error';
// from https://usehooks.com/useAsync/
export const useAsync = <T, E = string>(
  asyncFunction: (...args: any[]) => Promise<T>,
) => {
  const [status, setStatus] = useState<AsyncStatus>('notasked');

  const [value, setValue] = useState<T | null>(null);

  const [error, setError] = useState<E | null>(null);

  // The execute function wraps asyncFunction and

  // handles setting state for pending, value, and error.

  // useCallback ensures the below useEffect is not called

  // on every render, but only if asyncFunction changes.

  const execute = useCallback(
    (...args) => {
      setStatus('loading');

      setValue(null);

      setError(null);

      return asyncFunction(...args)
        .then((response: any) => {
          setValue(response);

          setStatus('success');
        })

        .catch((error: any) => {
          setError(error);

          setStatus('error');
        });
    },
    [asyncFunction],
  );

  return { execute, status, value, error };
};
