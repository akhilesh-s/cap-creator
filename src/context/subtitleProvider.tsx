import React, { createContext, useContext, useState } from "react";
import { ISubtitle } from "@vb/types/video";

interface SubtitleContextType {
  subtitles: ISubtitle[];
  addOrUpdateSubtitle: (subtitle: ISubtitle) => void;
  deleteSubtitle: (subtitle: ISubtitle) => void;
}

interface ISubtitleProviderProps {
  children: React.ReactNode;
}

const SubtitleContext = createContext<SubtitleContextType>({
  subtitles: [],
  addOrUpdateSubtitle: () => {},
  deleteSubtitle: () => {},
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

  const deleteSubtitle = (subtitleToDelete: ISubtitle) => {
    setSubtitles((prevSubtitles) =>
      prevSubtitles.filter((sub) => sub !== subtitleToDelete)
    );
  };

  return (
    <SubtitleContext.Provider
      value={{ subtitles, addOrUpdateSubtitle, deleteSubtitle }}
    >
      {children}
    </SubtitleContext.Provider>
  );
};
