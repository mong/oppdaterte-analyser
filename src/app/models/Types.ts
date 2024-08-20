export interface LocalizedString {
  no: string;
  en: string;
}

export interface NamedVector {
  name: string;
  vector: [number];
}

export interface NamedVectors {
  name: string;
  vectors: [NamedVector];
}

export interface NamedVectorsList {
  name: string;
  list: [NamedVectors];
}
