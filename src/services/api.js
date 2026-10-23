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

export const getsearchProducts = async (searchTerm) => {
  const res = await fetchData(`search-products?search=${searchTerm}`)

  if (!res) {
    throw new Error("Search product fetch unsuccessful");
  }

  return res?.data?.data || [];

};

export const getWhyShopWithUs = async () => {
    const res = await fetchData("why-shop-data");
    if (!res.success) {
        throw new Error("Why shop with us fetch unsuccessful");
    }
    return res?.data?.data || [];
}

export const getOfferBanner = async () => {
    const res = await fetchData("offer-banner-data");
    if (!res.success) {
        throw new Error("Offer banner fetch unsuccessful");
    }
    return res?.data?.data || [];
}

export const getPremimumCategories = async () => {
    const res = await fetchData("featured-category-data");
    if (!res.status) {
        throw new Error("Premium categories fetch unsuccessful");
    }
    return res.data || [];
}

export const getProductsByEndpoint = async (endpoint) => {
    const res = await fetchData(endpoint);

    if (!res.success) {
        throw new Error(`${endpoint} fetch unsuccessful`);
    }

    return res?.data?.data || [];
};

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
  if (!res.success) {
    throw new Error("Our location fetch unsuccessful");
  }
  return res?.data?.data || [];
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
    const response = await fetch(`${BASE_URL}store-order`, {
      method: "POST",
      headers: {
        Accept: "application/json",
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

    const res = await axios.post(`${BASE_URL}register-api`, formData);

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

    const response = await fetch(
      "https://gadget-backend.gadgetglobe.com.bd/api/store-login-api",
      {
        method: "POST",
        body: formData,
      }
    );

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

    const res = await fetch(`${BASE_URL}get-profile-details`, {
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

export const updateUserProfile = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}update-user-profile`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await res.text();
  console.log("RAW:", text);

  try {
    return JSON.parse(text);
  } catch {
    return { notification: text };
  }
};






// ✅ services/api.js

export const getUserOrders = async () => {
  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("userToken");

    const response = await fetch(
      "https://gadget-backend.gadgetglobe.com.bd/api/get-all-orders",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log("USER ORDERS RESPONSE:", data);

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch orders");
    }

    return data;
  } catch (error) {
    console.error("getUserOrders Error:", error);
    throw error;
  }
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