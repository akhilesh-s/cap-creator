import React, { useState, useEffect } from "react";
import { subtitleStyles } from "./subtitles.styles";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs, { Dayjs } from "dayjs";
import { TextField } from "@mui/material";
import { useSubtitle } from "@vb/context/subtitleProvider";
import { ISubtitle } from "@vb/types/video";
import { Utils } from "@vb/utils/utils";

import CancelIcon from "@mui/icons-material/Cancel";

interface IProps {
  currentSubtitle: ISubtitle;
  onDeleteSubtitle: (index: number) => void;
}

function SubtitleCreator(props: IProps) {
  const { currentSubtitle, onDeleteSubtitle } = props;
  const [index, setIndex] = useState<number | undefined>(
    currentSubtitle?.index
  );
  const [startTime, setStartTime] = useState(currentSubtitle?.start ?? "0/0/0");
  const [endTime, setEndTime] = useState(currentSubtitle?.end ?? "0/0/0");
  const [subtitleText, setSubtitleText] = useState(currentSubtitle?.text ?? "");
  const { addOrUpdateSubtitle } = useSubtitle();

  debugger;

  useEffect(() => {
    if (currentSubtitle) {
      setIndex(currentSubtitle.index);
      setStartTime(currentSubtitle.start);
      setEndTime(currentSubtitle.end);
      setSubtitleText(currentSubtitle.text);
    }
  }, [currentSubtitle]);

  const handleStartTimeChange = (time: Dayjs | null) => {
    const min = time?.get("minute");
    const sec = time?.get("second");
    const hour = time?.get("hour");
    const newStartTime = `${hour}/${min}/${sec}`;
    setStartTime(newStartTime);
    addOrUpdateSubtitle({
      index: currentSubtitle?.index,
      start: newStartTime,
      end: endTime,
      text: subtitleText,
    });
  };

  const handleEndTimeChange = (time: Dayjs | null) => {
    const min = time?.get("minute");
    const sec = time?.get("second");
    const hour = time?.get("hour");
    const newEndTime = `${hour}/${min}/${sec}`;
    setEndTime(newEndTime);
    addOrUpdateSubtitle({
      index: currentSubtitle.index,
      start: startTime,
      end: newEndTime,
      text: subtitleText,
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setSubtitleText(newText);
    addOrUpdateSubtitle({
      index: currentSubtitle.index,
      start: startTime,
      end: endTime,
      text: newText,
    });
  };

  const handleDeleteSubtitle = () => {
    onDeleteSubtitle(currentSubtitle.index);
  };

  return (
    <div className="container">
      <div className="flex bg-gray-900">
        <div className="flex flex-col p-2">
          <TimeField
            value={Utils.convertToDayjs(startTime)}
            onChange={handleStartTimeChange}
            format="HH:mm:ss"
            sx={subtitleStyles.input}
          />
          <TimeField
            value={Utils.convertToDayjs(endTime)}
            onChange={handleEndTimeChange}
            format="HH:mm:ss"
            sx={subtitleStyles.input}
          />
        </div>
        <div className="flex flex-col p-2 w-full">
          <TextField
            onChange={handleTextChange}
            placeholder="Enter Subtitle"
            value={subtitleText}
            sx={subtitleStyles.textField}
          />
        </div>
        <button className="mr-2" onClick={handleDeleteSubtitle}>
          <CancelIcon />
        </button>
      </div>
    </div>
  );
}

export default SubtitleCreator;
