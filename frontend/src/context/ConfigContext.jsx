import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
    const [images, setImages] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                // Fetch dynamic image mappings from backend
                const response = await axios.get('/api/config/images');
                setImages(response.data || {});
            } catch (error) {
                console.error("Failed to fetch image config:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    // Helper to get image, with a fallback
    const getImage = (key, fallbackUrl) => {
        return images[key] || fallbackUrl;
    };

    return (
        <ConfigContext.Provider value={{ images, getImage, loading }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => useContext(ConfigContext);
