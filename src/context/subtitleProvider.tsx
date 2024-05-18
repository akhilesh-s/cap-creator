import { ISubtitle } from "@vb/types/video";
import React, { createContext, useContext, useState, useEffect } from "react";

interface SubtitleContextType {
  subtitles: ISubtitle[];
  addOrUpdateSubtitle: (subtitle: ISubtitle) => void;
}

interface ISubtitleProviderProps {
  children: React.ReactNode;
}

const SubtitleContext = createContext<SubtitleContextType>({
  subtitles: [],
  addOrUpdateSubtitle: () => {},
});

export const useSubtitle = () => {
  return useContext(SubtitleContext);
};

export const SubtitleProvider: React.FC<ISubtitleProviderProps> = ({
  children,
}) => {
  const [subtitles, setSubtitles] = useState<ISubtitle[]>([]);

  const addOrUpdateSubtitle = (newSubtitle: ISubtitle) => {
    setSubtitles((prevSubtitles) => {
      const index = prevSubtitles.findIndex(
        (sub) => sub.index === newSubtitle.index
      );
      if (index !== -1) {
        const updatedSubtitles = [...prevSubtitles];
        updatedSubtitles[index] = newSubtitle;
        return updatedSubtitles;
      } else {
        return [...prevSubtitles, newSubtitle];
      }
    });
  };

  return (
    <SubtitleContext.Provider value={{ subtitles, addOrUpdateSubtitle }}>
      {children}
    </SubtitleContext.Provider>
  );
};
