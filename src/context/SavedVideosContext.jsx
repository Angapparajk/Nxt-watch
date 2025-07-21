import { createContext, useState } from 'react';

const SavedVideosContext = createContext({
  savedVideosList: [],
  updateSave: () => {},
});

export const SavedVideosContextProvider = ({ children }) => {
  const [savedVideosList, setSavedVideosList] = useState([]);
  const updateSave = video => {
    setSavedVideosList(prev => {
      const exists = prev.find(v => v.id === video.id);
      if (exists) {
        return prev.filter(v => v.id !== video.id);
      } else {
        return [...prev, video];
      }
    });
  };
  return (
    <SavedVideosContext.Provider value={{ savedVideosList, updateSave }}>
      {children}
    </SavedVideosContext.Provider>
  );
};

export default SavedVideosContext;
