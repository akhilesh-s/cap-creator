import SubtitleCreator from "@vb/components/subtitles/subtitles";
import { useSubtitle } from "@vb/context/subtitleProvider";
import { Utils } from "@vb/utils/utils";
import AddIcon from "@mui/icons-material/Add";
import { Grid, Button, Typography } from "@mui/material";
import { layoutStyle } from "./subtitleList.styles";
import SubtitlesIcon from "@mui/icons-material/Subtitles";

function SubtitleList() {
  const { subtitles, addOrUpdateSubtitle } = useSubtitle();

  const handleSubmit = () => {
    const totalSubtitles = subtitles.length;

    if (totalSubtitles == 0) {
      const newSubtitle = {
        index: subtitles.length + 1,
        start: "0/0/0",
        end: "0/0/5",
        text: "New Subtitle",
      };

      addOrUpdateSubtitle(newSubtitle);
    } else {
      const prevEndTime = subtitles[totalSubtitles - 1].end;
      const newStartTime = Utils.incrementTimeBySeconds(prevEndTime, 1);
      const newEndTime = Utils.incrementTimeBySeconds(prevEndTime, 5);

      const newSubtitle = {
        index: subtitles.length + 1,
        start: newStartTime,
        end: newEndTime,
        text: "New Subtitle",
      };

      addOrUpdateSubtitle(newSubtitle);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center text-center justify-center">
        <Typography sx={layoutStyle.heading}>
          <SubtitlesIcon sx={{ width: "20px", height: "20px" }} /> Subtitles
        </Typography>
      </div>
      <div className="flex flex-col">
        {subtitles.map((subtitle, index) => (
          <SubtitleCreator currentSubtitle={subtitle} key={index} />
        ))}
      </div>
      <Grid sx={layoutStyle.buttonContainer} onClick={handleSubmit}>
        <Button sx={layoutStyle.button} type="button">
          <AddIcon sx={{ fontSize: "20px" }} /> Add Subtitle
        </Button>
      </Grid>
    </div>
  );
}

export default SubtitleList;
