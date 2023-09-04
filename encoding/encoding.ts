export interface Encoding {
  name: string;
  labels: string[];
}

export const utf8: Encoding = {
  name: "UTF-8",
  labels: [
    "unicode-1-1-utf-8",
    "unicode11utf8",
    "unicode20utf8",
    "utf-8",
    "utf8",
    "x-unicode20utf8",
  ],
};
