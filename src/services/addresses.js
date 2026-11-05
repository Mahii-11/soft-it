// Address book service.
// TODO: Backend এ address API ready হলে এই ফাইলের function গুলো API call দিয়ে replace করতে হবে।
// এখন data browser এর localStorage এ (user অনুযায়ী আলাদা key এ) থাকে।

const storageKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return `addresses_${user?.id || user?.email || "guest"}`;
  } catch {
    return "addresses_guest";
  }
};

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey()) || "[]");
  } catch {
    return [];
  }
};

const write = (list) => localStorage.setItem(storageKey(), JSON.stringify(list));

export const getAddresses = async () => read();

export const saveAddress = async (address) => {
  const list = read();

  if (address.id) {
    const updated = list.map((a) =>
      a.id === address.id ? { ...a, ...address } : a
    );
    write(updated);
    return updated;
  }

  const created = {
    ...address,
    id: Date.now(),
    isDefault: list.length === 0,
  };
  const next = [...list, created];
  write(next);
  return next;
};

export const deleteAddress = async (id) => {
  let list = read().filter((a) => a.id !== id);
  if (list.length && !list.some((a) => a.isDefault)) {
    list[0] = { ...list[0], isDefault: true };
  }
  write(list);
  return list;
};

export const setDefaultAddress = async (id) => {
  const list = read().map((a) => ({ ...a, isDefault: a.id === id }));
  write(list);
  return list;
};
