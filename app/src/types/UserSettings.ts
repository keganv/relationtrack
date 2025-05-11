export enum EmailFrequency {
  Never = "n",
  Daily = "d",
  Weekly = "w",
  Monthly = "m",
}

export type UserSettings = {
  email_frequency: EmailFrequency;
  notifications: boolean | string;
}
