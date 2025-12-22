import useLocalStorage from "use-local-storage";
import axios from "axios";

// Simple in-memory cache for GET requests
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Create axios instance with default config
const axiosInstance = axios.create({
  timeout: 30000, // 30 seconds timeout
});

// Response interceptor for caching and silent error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get' && response.status === 200) {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => {
    // Silently handle permission API errors - don't log or throw
    // This is expected for Admin users who don't have UserPermission records
    if (error.config && error.config.url && error.config.url.includes('permission')) {
      // Return a mock successful response with empty data instead of rejecting
      return Promise.resolve({
        data: { status: false, message: '', data: [], meta: {}, code: 200 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config
      });
    }
    return Promise.reject(error);
  }
);

const postData = async (url = "", data) => {
    try {
        let token = localStorage.getItem("token") 

        if (token) {
            token = token;
        }
        var header = { headers: {  Authorization: token, 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' } };
        let response = await axiosInstance.post(url, data, header)
        return response;

    } catch (e) {
        console.log("---post---", JSON.stringify(e.response))
        return e.response?.data || { error: 'Request failed' }
    }
};
const postDataContent = async (url = "", data,config) => {
    try {
        let token = localStorage.getItem("token")
        let response = await axiosInstance.post(url, data, {
            headers: { Authorization: token, "content-type": 'multipart/form-data;', 'Cache-Control': 'no-cache', },
        });
        return response.data;
    } catch (e) {
        console.log("---post mut   e---", JSON.stringify(e))
        return e.response?.data || { error: 'Upload failed' }
    }
};
const getData = async (url = "", params = {}) => {
    try { 
        // Check cache first
        const cacheKey = `${url}${JSON.stringify(params || {})}`;
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }
        
        let token = localStorage.getItem("token");
        if (token) {
            token = token;
        }
        const headers = { 
            Authorization: token,
            'Cache-Control': 'no-cache'
        };

        // Pass params as query parameters using the params option
        const response = await axiosInstance.get(url, { headers, params });
        return response.data;
    } catch (e) {
        // Silently handle permission API errors - return success response with empty data
        // This is expected for Admin users and some company users who don't have UserPermission records
        if (url && url.includes('permission')) {
            // Return success response with empty data - no error, no message
            return { status: true, message: '', data: [], meta: {}, code: 200 };
        }
        // For other errors, return the error response but don't throw
        return e.response ? e.response.data : { status: false, error: 'Unknown error' };
    }
};

// Clear cache function (can be used when data needs to be refreshed)
export const clearCache = (url = null) => {
    if (url) {
        // Clear specific URL cache
        for (const [key] of cache.entries()) {
            if (key.startsWith(url)) {
                cache.delete(key);
            }
        }
    } else {
        // Clear all cache
        cache.clear();
    }
};

const putData = async (url = "", data) => {
    try {
        let token = localStorage.getItem("token")
        if (token) {
            token = token;
        }
        // alert(token)
        const headers = { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
        };
        let response = await axios.put(url, data, {
            headers: headers,
        });
        return response.data;
    } catch (e) {
        return e.response.data
    }
};

const deleteData = async (url = "", token = false) => {
    try {
        if (token) {
            token = "Bearer " + token;
        }
        let response = await axios.delete(url, {
            headers: { Authorization: token },
        });
        return response.data;
    } catch (e) {
        if (e.response.data.status == 403 || e.response.data.status == 401) {

        }
        console.log("------", JSON.stringify(e.response.data))
        return e.response.data
    }
};

export { postData, getData, deleteData, putData, postDataContent };