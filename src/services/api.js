const BASE_URL = "https://backend.gadgetglobe.com.bd/api/";


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
    if (!res.success) {
        throw new Error("Slider fetch unsuccessful");
    }
    return res?.data?.data || [];
}

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
    const res = await fetchData("popular-category-data");
    if (!res.success) {
        throw new Error("Premium categories fetch unsuccessful");
    }
    return res?.data?.data || [];
}

export const getProductsByEndpoint = async (endpoint) => {
    const res = await fetchData(endpoint);

    if (!res.success) {
        throw new Error(`${endpoint} fetch unsuccessful`);
    }

    return res?.data?.data || [];
};

export const getMostViewedProducts = async () => {
    const res = await fetchData("most-viewed-product-data");
    if (!res.success) {
        throw new Error("Most viewed products fetch unsuccessful");
    }
    return res?.data?.data || [];
}

export const getDealofDayProducts = async () => {
    const res = await fetchData("deal-of-the-day");
    if (!res.success) {
        throw new Error("Deal of the day products fetch unsuccessful")
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


// Fetch product details by slug
export const getProductDetailsBySlug = async (slug) => {
  try {
    const res = await fetch(`${BASE_URL}product-details/${slug}`);
    
    // Check if response is JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("API did not return JSON. Check the endpoint or server error.");
    }

    const data = await res.json();

    if (!data.product) {
      throw new Error(`Product details fetch unsuccessful for slug: ${slug}`);
    }

    return data;

  } catch (error) {
    console.error("Error in getProductDetailsBySlug:", error);
    throw error;
  }
};