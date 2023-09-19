export interface SerializedDataI {
  matchKey?: string;
  home: TSubject;
  host: TSubject;
  site: TSites;
}

export type TSubject = {
  name: string;
  rate: number;
  type?: string;
  site: TSites;
};

export type TSites = "tipsport" | "fortuna";

export enum SitesEnum {
  tipsport = "tipsport",
  fortuna = "fortuna",
}

export interface GroupedBySites {
  tipsport: SerializedDataI[];
  fortuna: SerializedDataI[];
}

export interface CombinedMatches {
  tipsport: SerializedDataI;
  fortuna: SerializedDataI;
}

export interface ChoosenBetterMatch {
  home: TSubject | undefined;
  host: TSubject | undefined;
  margin?: number;
}

export interface DivideAmountI {
  site: string;
  name: string;
  amount: number;
  profit: number;
  rate: number;
}
