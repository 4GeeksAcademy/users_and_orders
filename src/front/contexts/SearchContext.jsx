import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within SearchProvider");
    }
    return context;
};

export const SearchProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCallback, setSearchCallback] = useState(null);
    const [clearCallback, setClearCallback] = useState(null);

    const registerSearch = (onSearch, onClear) => {
        setSearchCallback(() => onSearch);
        setClearCallback(() => onClear);
    };

    const unregisterSearch = () => {
        setSearchCallback(null);
        setClearCallback(null);
        setSearchTerm("");
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (searchCallback) {
            searchCallback(term);
        }
    };

    const handleClear = () => {
        setSearchTerm("");
        if (clearCallback) {
            clearCallback();
        }
    };

    return (
        <SearchContext.Provider
            value={{
                searchTerm,
                registerSearch,
                unregisterSearch,
                handleSearch,
                handleClear,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
