export interface Province {
  value: string;
  districts: District[];
}

export interface District {
  value: string;
  subdistricts: Subdistrict[];
}

export interface Subdistrict {
  value: string;
  zipCodes: ZipCode[];
}

export interface ZipCode {
  value: string;
}

export const provinces: Province[];
