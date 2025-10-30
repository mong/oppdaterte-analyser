export type Lang = "no" | "en";
export interface Text {
  no: string;
  en: string;
}

export interface View {
  name: string;
  type: string;
  aggregering: string;
  year_range: [number, number];
  title: Text;
  variables: (Text & { name: string })[];
}
