import { createContext, useContext, useState } from "react";

// create the context by the advantage of create context
export const SearchContext = createContext()

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context){
    throw new Error("useSearch must be used within a searchProvider")
  }return context
};

export const SearchProvider = ( { children } ) => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm}}>
      {children}
    </SearchContext.Provider>
  )
};