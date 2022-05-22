import { addDays, differenceInDays, formatDistanceToNow, isFuture, sub } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Duration, Item, ItemsContainer, ItemStatus } from '../containers/items';
import { FirebaseContainer } from '../containers/firebase';
import { toTimestamp, toDate } from '../firebase';
import { TextInput, RadioButton } from './forms';
import { AnimatePresence, motion } from "framer-motion"

const getDaysFromDuration = (duration: Duration) => {
  switch (duration) {
    case 'short':
      return 3;
    case 'medium':
      return 7;
    case 'long':
      return 14;
    default:
      return 0;
  }
};

export const AddItem = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  if (status === 'loading') return <p>loading...</p>;
  if (status === 'error') return <p>error :(</p>;
  return (
    <div
      className={`p-2 rounded border-2 border-gray-800 text-gray-800 overflow-hidden`}
    >
      <p className="font-bold" onClick={() => setIsOpen((io) => !io)}>
        Add Grocery
      </p>
      <AnimatePresence>
        {
          isOpen && <motion.div initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}><ItemForm collapse={() => { setIsOpen(false) }} /></motion.div>
        }
      </AnimatePresence>

    </div>
  );
};

const ItemForm = ({ collapse }: { collapse: () => void }) => {
  const { handleSubmit, register, reset } = useForm<Item>();
  const { user } = FirebaseContainer.useContainer();
  const { add, refetchList, list: { status: listStatus } } = ItemsContainer.useContainer();

  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const onSubmit = async (values: Item) => {
    await add.execute({
      ...values,
      quantity: 1,
      userId: user!.uid,
      status: ItemStatus.fresh,
      createdAt: toTimestamp(new Date()),
      expiresAt: toTimestamp(
        addDays(new Date(), getDaysFromDuration(values.duration)),
      ),
    });
    await refetchList();
    reset()
    // collapse()
  };
  return <form
    onSubmit={handleSubmit(onSubmit)}
  >
    <TextInput
      name="name"
      label="item name"
      placeholder="bananas"
      inputRef={(ref: HTMLInputElement) => {
        register(ref, { required: true })
        inputRef.current = ref
      }}
    />
    <div className="flex flex-col py-2">
      <p className="uppercase text-xs tracking-wider font-bold text-gray-600">
        use within
    </p>
      <RadioButton
        name="duration"
        value="short"
        label="use within 3d"
        inputRef={register()}
      />
      <RadioButton
        name="duration"
        value="medium"
        label="use within 7d"
        inputRef={register()}
        defaultChecked
      />
      <RadioButton
        name="duration"
        value="long"
        label="use within 14d"
        inputRef={register()}
      />
    </div>
    {add.error && <p>{add.error.toString()}</p>}
    <button
      type="submit"
      className="bg-gray-800 border-2 rounded border-gray-800 text-gray-200 px-4 py-1 font-bold tracking-wider uppercase"
    >
      Save
    </button>
  </form>
}

enum Urgency {
  meh = 'bg-green-500',
  shit = 'bg-yellow-500',
  fuck = 'bg-red-500',
}
const getUrgencyFromExpiresAt = (expiresAt: Date) => {
  const distance = differenceInDays(expiresAt, new Date());
  if (distance < 2) return Urgency.fuck;
  if (distance < 6) return Urgency.shit;
  if (distance < 13) return Urgency.meh;
};

const sortDescendingByExpiresAt = (a: Item, b: Item) => {
  const distance = differenceInDays(toDate(a.expiresAt), toDate(b.expiresAt));
  return distance >= 0 ? 1 : -1
}

export const ListItems = () => {
  const {
    list: { status },
    items
  } = ItemsContainer.useContainer();

  if (status !== 'loading' && (!items || items.length == 0))
    return <p className="text-center py-8">no items :(</p>;

  return (
    <div>
      <AnimatePresence>
        {items?.sort(sortDescendingByExpiresAt).map((v) => {
          if (v == null) return null
          return (
            <ItemEntry item={v as Required<Item>} key={v.id} />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

const ItemStatusIndicator = (item: Item) => {
  const expiresAtDate = toDate(item.expiresAt);
  switch (item.status) {
    case ItemStatus.frozen:
      return <div
        className={`text-white rounded mx-2 px-2 py-1 ${ItemActionType.freeze}`}
      >
        frozen
</div>
    case ItemStatus.used:
      return <div
        className={`text-white rounded mx-2 px-2 py-1 ${ItemActionType.use}`}
      >
        used
</div>
    case ItemStatus.discarded:
      return <div
        className={`text-white rounded mx-2 px-2 py-1 ${ItemActionType.discard}`}
      >
        discarded
</div>
    default:
      return <>
        {isFuture(expiresAtDate) ? <div
          className={`text-white rounded mx-2 px-2 py-1 ${getUrgencyFromExpiresAt(
            expiresAtDate,
          )}`}
        >
          use in {formatDistanceToNow(expiresAtDate)}
        </div> : <div
          className={`text-white rounded mx-2 px-2 py-1 ${Urgency.fuck}`}
        >
          discard :(
</div>}
      </>
  }
}

const ItemEntry = ({ item }: { item: Required<Item> }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { editItem } = ItemsContainer.useContainer()
  return <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    className={`p-2 my-2 rounded border-2 ${item.status != ItemStatus.fresh ? "border-gray-400 text-gray-400 " : "border-gray-800 text-gray-800"} flex flex-col`}
  >
    <div className="flex justify-between" onClick={() => { setIsOpen(io => !io) }}>
      <p className="px-2 py-1">{item.name}</p>
      <ItemStatusIndicator {...item} />
    </div>
    <AnimatePresence>
      {isOpen && item.status === ItemStatus.fresh && (
        <motion.div
          className="overflow-y-hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex m-2">
            <ItemAction name="use" onClick={() => {
              editItem(item.id, { status: ItemStatus.used })
            }} type={ItemActionType.use} />
            <ItemAction name="freeze" onClick={() => {
              editItem(item.id, { status: ItemStatus.frozen })
            }} type={ItemActionType.freeze} className="mx-2" />
            <ItemAction name="discard" onClick={() => {
              editItem(item.id, { status: ItemStatus.discarded })
            }} type={ItemActionType.discard} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
}

enum ItemActionType {
  discard = "border-red-500 border-2 text-red-500",
  freeze = "border-blue-500 border-2 text-blue-500",
  use = "border-green-500  border-2 text-green-500"
}

type ItemActionProps = {
  name: string,
  type: ItemActionType,
  onClick: React.MouseEventHandler<HTMLDivElement>,
  className?: string
}
const ItemAction = ({ name, onClick, type, className = '' }: ItemActionProps) => {
  return <div className={`px-4 py-1 text-white rounded hover:opacity-50 ${type} ${className}`} onClick={onClick}>
    {name}
  </div>
}