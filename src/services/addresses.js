// Address book service - backed by the live auth/addresses API.
import { BASE_URL } from "./api";

const getToken = () => localStorage.getItem("token") || localStorage.getItem("userToken");

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const adaptAddress = (a) => ({
  id: a.id,
  name: a.name,
  phone: a.phone,
  email: a.email,
  districtId: a.district_id,
  district: a.district,
  zoneId: a.zone_id,
  zone: a.zone,
  address: a.address,
  isDefault: !!a.is_default,
});

export const getAddresses = async () => {
  const res = await fetch(`${BASE_URL}auth/addresses`, {
    headers: { Accept: "application/json", ...authHeaders() },
  });
  const data = await res.json().catch(() => ({}));
  if (!data.status) return [];
  return (data.addresses || []).map(adaptAddress);
};

export const saveAddress = async (address) => {
  const formData = new FormData();
  formData.append("name", address.name);
  formData.append("phone", address.phone);
  formData.append("email", address.email || "");
  formData.append("district_id", address.districtId);
  formData.append("zone_id", address.zoneId);
  formData.append("address", address.address);

  const url = address.id
    ? `${BASE_URL}auth/addresses/${address.id}`
    : `${BASE_URL}auth/addresses`;

  const res = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json", ...authHeaders() },
    body: formData,
  });
  const data = await res.json().catch(() => ({}));

  if (!data.status) {
    throw new Error(data.message || "Failed to save address.");
  }
  return getAddresses();
};

export const deleteAddress = async (id) => {
  await fetch(`${BASE_URL}auth/addresses/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json", ...authHeaders() },
  });
  return getAddresses();
};

// NOTE: backend এ এখনো "set default address" এর আলাদা কোনো endpoint নেই
// (is_default শুধু নতুন address create এর সময় backend নিজে থেকে সেট করে -
// প্রথম address টা default হয়)। তাই আপাতত এই function টা শুধু list refresh করে।
export const setDefaultAddress = async () => getAddresses();
