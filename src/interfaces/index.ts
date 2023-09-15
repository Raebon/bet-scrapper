export interface SerializedDataI {
  home: TSubject;
  host: TSubject;
  site: TSites;
}

export type TSubject = {
  name: string;
  rate: number;
  site?: TSites;
};

export type TSites = "tipsport" | "fortuna";