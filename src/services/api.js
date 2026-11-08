import axios from "axios";
const BASE_URL = "https://gadget-backend.gadgetglobe.com.bd/api/";


/* For all Get requests */

const fetchData = async (endpoint, option = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
            },
            ...option,
        });
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch Error:", error.message);
        throw error;
    }
}



// Get Sliders 
export const getSliders = async () => {
    const res = await fetchData("slider-data");
    if (!(res.status ?? res.success)) {
        throw new Error("Slider fetch unsuccessful");
    }
    const list = Array.isArray(res?.data) ? res.data : res?.data?.data;
    return list || [];
}


export const getTopMenuData = async ()  => {
  const res = await fetchData("menu-data");
  if (!res.status) {
    throw new Error("Top Menu Data fetch unsufessful");
  }
  return res.data || [];
}

// GET search-products?search=...  -> { status, data: [ {id, name, slug, type, image, price, offer_price, ...} ], meta }
export const getsearchProducts = async (searchTerm) => {
  const res = await fetchData(`search-products?search=${encodeURIComponent(searchTerm)}`)

  if (!res) {
    throw new Error("Search product fetch unsuccessful");
  }

  // এখন data সরাসরি array; আগে data.data (paginated) ছিল - দুটোই চলবে
  const list = Array.isArray(res.data) ? res.data : res.data?.data;
  return list || [];
};

// GET shop/products?category=&size=&color=&min_price=&max_price=&page=&limit=
// -> { status, data: [...products], filters: { categories, sizes, colors, price: {min, max} },
//      meta: { total, per_page, current_page, last_page } }
export const getShopProducts = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.append(key, value);
  });
  const qs = query.toString();
  const res = await fetchData(`shop/products${qs ? `?${qs}` : ""}`);
  if (!res.status) {
    throw new Error("Shop products fetch unsuccessful");
  }
  return {
    products: res.data || [],
    filters: res.filters || {},
    meta: res.meta || {},
  };
};

// GET setting-data -> { logo, email, phone, address, copyright, site_description }
export const getSiteSettings = async () => {
  const res = await fetchData("setting-data");
  if (!res.status) {
    throw new Error("Site settings fetch unsuccessful");
  }
  return res.data || {};
};

// GET social-data -> [ { id, link, icon: "bi bi-facebook" } ]
export const getSocialLinks = async () => {
  const res = await fetchData("social-data");
  if (!res.status) {
    throw new Error("Social links fetch unsuccessful");
  }
  return res.data || [];
};

export const getWhyShopWithUs = async () => {
    const res = await fetchData("why-shop-data");
    if (!(res.status ?? res.success)) {
        throw new Error("Why shop with us fetch unsuccessful");
    }
    const list = Array.isArray(res?.data) ? res.data : res?.data?.data;
    return (list || [])
        .filter((item) => item.is_active ?? true)
        .sort((a, b) => (a.serial ?? 0) - (b.serial ?? 0));
}

export const getOfferBanner = async () => {
    const res = await fetchData("offer-banner-data");
    if (!res.success) {
        throw new Error("Offer banner fetch unsuccessful");
    }
    return res?.data?.data || [];
}

export const getPromoBanners = async () => {
    const res = await fetchData("promo-banner-data");
    if (!res.status) {
        throw new Error("Promo banners fetch unsuccessful");
    }
    return (res.data || [])
        .filter((banner) => banner.is_active)
        .sort((a, b) => a.serial - b.serial);
}

export const getPremimumCategories = async () => {
    const res = await fetchData("featured-category-data");
    if (!res.status) {
        throw new Error("Premium categories fetch unsuccessful");
    }
    return res.data || [];
}

// NOTE: the backend has no brands endpoint yet ("brand-data" is a guess).
// Change the endpoint here once it exists; the response shape is handled loosely.
export const getBrands = async () => {
    const res = await fetchData("brand-data");
    if (!(res.status ?? res.success)) {
        throw new Error("Brands fetch unsuccessful");
    }
    const list = Array.isArray(res?.data) ? res.data : res?.data?.data;
    return list || [];
}

export const getAllBrands = async () => {
    const res = await fetchData("all-brand-data");
    if (!(res.status ?? res.success)) {
        throw new Error("All brands fetch unsuccessful");
    }
    const list = Array.isArray(res?.data) ? res.data : res?.data?.data;
    return list || [];
}

export const getProductsByEndpoint =async (endpoint) => {
    const res = await fetchData(endpoint);

    if (!res.success) {
        throw new Error(`${endpoint} fetch unsuccessful`);
    }

    return res?.data?.data || [];
};

// "Just for You" section: [{ id, name, slug, image, total_views }]
export const getJustForYou = async () => {
    const res = await fetchData("just-for-you");
    if (!res.status) {
        throw new Error("Just for you fetch unsuccessful");
    }
    return res.data || [];
}

export const getMostViewedProducts = async () => {
    const res = await fetchData("most-viewed-products");
    if (!res.status) {
        throw new Error("Most viewed products fetch unsuccessful");
    }
    return res.data || [];
}

export const getNewArrivalProducts = async () => {
    const res = await fetchData("new-arrival-products");
    if (!res.status) {
        throw new Error("New arrival products fetch unsuccessful");
    }
    return res.data || [];
}

export const getDealofDayProducts = async () => {
    const res = await fetchData("flash-sale-products");
    if (!res.status) {
        throw new Error("Deal of the day products fetch unsuccessful")
    }
    return { flashSale: res.flash_sale || null, products: res.data || [] };
}


export const getOnlineSaleProducts = async () => {
  const res = await fetchData("offer-products");
  if (!res.success) {
    throw new Error("Online Sale Products fetch unsuccessful")
  }
  return res?.data?.data || [];
}


export const getOurLocations = async () => {
  const res = await fetchData("our-store-data");
  if (!(res.status ?? res.success)) {
    throw new Error("Our location fetch unsuccessful");
  }
  const list = Array.isArray(res?.data) ? res.data : res?.data?.data;
  return list || [];
}






export const getProductDetailsBySlugg = async (slug) => {
  const res = await fetchData(`product-details/${slug}`);
  if (!res.success) {
    throw new Error(`Product details fetch unsuccessful for slug: ${slug}`);
  }
  return res?.data?.product || null;
};



// Convert the product-details response into the shape ProductDetails page expects
const adaptProductDetails = (p) => {
  const sizes = p.sizes || [];
  const colors = p.colors || [];

  const variants = (p.combinations || []).map((c) => {
    const size = sizes.find((s) => Number(s.id) === Number(c.size_id));
    const color = colors.find((cl) => Number(cl.id) === Number(c.color_id));
    return {
      size_id: c.size_id,
      color_id: c.color_id,
      size: size?.name || null,
      color: color?.name || null,
      price: c.price,
      regular_price: c.regular_price,
      quantity: c.quantity,
      in_stock: c.quantity > 0,
    };
  });

  const basePrice = p.offer_price ?? p.price ?? p.min_price ?? 0;

  return {
    product: {
      id: p.id,
      name: p.name,
      slug: p.slug,
      thumbnail: p.image,
      gallery: (p.gallery || []).map((g) =>
        typeof g === "string" ? { url: g } : { url: g.url || g.image }
      ),
      short_description: p.short_description,
      description: p.description,
      sku: p.sku,
      brand: p.brand,
      price: {
        offer: basePrice,
        final: basePrice,
        regular: p.offer_price != null ? p.price : null,
      },
      stock: { in_stock: p.in_stock, quantity: p.stock_qty },
      colors: colors.map((c) => ({ ...c, color_id: Number(c.id) })),
      size_chart: sizes.map((s) => ({
        size_id: s.id,
        size: s.name,
        price: s.price,
        regular_price: s.regular_price,
      })),
      variants,
    },
    // same shape as the home page products, rendered by ProductCard
    related_products: p.related_products || [],
  };
};

// Fetch product details by slug
export const getProductDetailsBySlug = async (slug) => {
  try {
    const res = await fetch(`${BASE_URL}product-details/${slug}`);

    // Check if response is JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("API did not return JSON. Check the endpoint or server error.");
    }

    const json = await res.json();

    if (!json.status || !json.data?.id) {
      throw new Error(`Product details fetch unsuccessful for slug: ${slug}`);
    }

    return adaptProductDetails(json.data);

  } catch (error) {
    console.error("Error in getProductDetailsBySlug:", error);
    throw error;
  }
};

// Post Api

/*export async function createOrder(orderData) {
  try {
    console.log("Creating order with data:", orderData);

    const response = await fetch(`${BASE_URL}store-order`, {
      method: "POST",
      body: orderData,
    });

    if (!response.ok) {
      const errorText = await response.text(); // read server error message
      throw new Error(`Server Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
} */


export async function createOrder(orderData) {
  try {
    // login করা থাকলে token পাঠাতে হবে, না হলে order user এর সাথে link হয় না
    // (dashboard এর get-all-order এ আসে না)। guest হলে token ছাড়াই যাবে।
    const token = localStorage.getItem("token") || localStorage.getItem("userToken");

    const response = await fetch(`${BASE_URL}checkout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: orderData,
    });

    console.log("STATUS:", response.status);

    const text = await response.text();
    console.log("SERVER RESPONSE:", text);

    if (!text) {
      return { success: false, msg: "Empty response from server" };
    }

    return JSON.parse(text);

  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
}




// post api for login  / register



export const registerApi = async (data) => {
  try {
    const formData = new FormData();

    formData.append("name", data.name.trim());
    formData.append("email", data.email.trim());
    formData.append("phone", data.phone.trim());
    formData.append("password", data.password);
    formData.append(
      "password_confirmation",
      data.password_confirmation
    );

    console.log("REGISTER PAYLOAD:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const res = await axios.post(`${BASE_URL}auth/register`, formData);

    return res.data;
  } catch (error) {
    console.log("REGISTER ERROR:", error.response?.data);
    return error.response?.data || {
      status: false,
      message: "Server Error",
    };
  }
};

export const loginApi = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password.trim());

    console.log("LOGIN PAYLOAD:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await fetch(`${BASE_URL}auth/login`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    const text = await response.text();
    console.log("RAW RESPONSE:", text);

    return JSON.parse(text);
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    throw error;
  }
};

export const logoutApi = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}logout-api`,

  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
  }
  );

return await res.json();

};





// post api for upddating user profile


export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}auth/get-profile-details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;

  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
};

// POST auth/update-user-profile (form-data: name, email, phone, address, image)
export const updateUserProfile = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}auth/update-user-profile`, {
    method: "POST",
    headers: {
      Accept: "application/json", // না দিলে validation error এ Laravel redirect করে
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }

  // HTTP error (401, 422...) কে failure হিসেবে ধরা হয়
  if (!res.ok && data.status !== false) {
    data = { ...data, status: false };
  }
  return data;
};






// ✅ services/api.js

export const getUserOrders = async () => {
  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("userToken");

    const response = await fetch(`${BASE_URL}auth/get-all-order`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log("USER ORDERS RESPONSE:", data);

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch orders");
    }

    // নতুন API: order_date + products[{name, image, qty, unit_price, total_price}]
    // UI পুরনো নাম (created_at, order_products[].product_name) ব্যবহার করে, তাই এখানে map করা হলো
    if (Array.isArray(data?.orders)) {
      data.orders = data.orders.map((o) => ({
        ...o,
        created_at: o.created_at || o.order_date,
        order_products:
          o.order_products ||
          (o.products || []).map((p) => ({
            ...p,
            product_name: p.product_name || p.name,
            product_image: p.product_image || p.image,
            quantity: p.quantity ?? p.qty,
          })),
      }));
    }

    return data;
  } catch (error) {
    console.error("getUserOrders Error:", error);
    throw error;
  }
};




// Public order tracking (login লাগে না): POST track-order (form-data: order_id, phone)
// Response: { status, data: [ { order_id, order_date, order_status, order_status_text, total_amount, products: [...] } ] }
export const trackOrderPublic = async (orderId, phone) => {
  const body = new FormData();
  body.append("order_id", orderId);
  body.append("phone", phone);

  const response = await fetch(`${BASE_URL}track-order`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  });
  const data = await response.json().catch(() => ({}));

  const order = Array.isArray(data?.data) ? data.data[0] : data?.data;

  if (!response.ok || data?.status === false || !order) {
    throw new Error(data?.message || data?.msg || "Order not found. Please check your details.");
  }
  return order;
};

export const getSingleOrder = async (id) => {
  try {
    const token = localStorage.getItem("token"); 

    const response = await axios.get(
      `${BASE_URL}order-details/${id}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching single order:", error.response?.data || error);

    return { success: false };
  }
};

// Change password - profile update এর same API (auth/update-user-profile),
// শুধু password + password_confirmation field পাঠানো হয়
export const changePasswordApi = async (password, passwordConfirmation) => {
  try {
    const formData = new FormData();
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);

    const data = await updateUserProfile(formData);

    // backend এ status key না থাকলেও HTTP success হলে সফল ধরা হয়
    // (updateUserProfile HTTP error এ status:false বসিয়ে দেয়)
    return { ...data, status: data.status !== false && data.success !== false };
  } catch (error) {
    return { status: false, message: "Server Error" };
  }
};
