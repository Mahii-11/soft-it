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