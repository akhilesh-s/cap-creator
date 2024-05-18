export interface IVideo {
  id: number;
  thumb: string;
  duration: string;
  title: string;
  source: string;
  description: string;
  subtitle: string;
  playOnClick?: (id: number) => void;
  progress?: number;
}

export interface ISubtitle {
  index: number;
  start: string;
  end: string;
  text: string;
}
