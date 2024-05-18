import dayjs, { Dayjs } from "dayjs";

export class Utils {
  static isBrowser() {
    return typeof window !== "undefined";
  }

  static getAssetPath(path: string) {
    return `http://commondatastorage.googleapis.com/gtv-videos-bucket/${path}`;
  }

  static parseSubtitleTimeline(time: string) {
    const splittedTime = time.split("/");
    return (
      parseInt(splittedTime[0]) * 3600 +
      parseInt(splittedTime[1]) * 60 +
      parseInt(splittedTime[2])
    );
  }

  static convertToDayjs = (time: string): Dayjs => {
    const [hour, minute, second] = time.split("/").map(Number);
    return dayjs().hour(hour).minute(minute).second(second);
  };

  static incrementTimeBySeconds = (
    timeString: string,
    secondsToAdd: number
  ) => {
    const [hours, minutes, seconds] = timeString.split("/").map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds + secondsToAdd;
    const newHours = Math.floor(totalSeconds / 3600);
    const newMinutes = Math.floor((totalSeconds % 3600) / 60);
    const newSeconds = totalSeconds % 60;

    return `${newHours}/${newMinutes}/${newSeconds}`;
  };
}
