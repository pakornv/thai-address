import type {
  District,
  Province,
  Subdistrict,
  ZipCode,
} from "@thai-address/data";
import { useEffect, useMemo, useState } from "react";

interface SelectedAddress {
  province: Province | null;
  district: District | null;
  subdistrict: Subdistrict | null;
  zipCode: ZipCode | null;
}

interface UseThaiAddress {
  isLoading: boolean;
  provinces: Province[];
  districts: District[];
  subdistricts: Subdistrict[];
  zipCodes: ZipCode[];
  selected: SelectedAddress;
  selectProvince: (value: string) => void;
  selectDistrict: (value: string) => void;
  selectSubdistrict: (value: string) => void;
  selectZipCode: (value: string) => void;
}

export function useThaiAddress(): UseThaiAddress {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("@thai-address/data").then((mod) => {
      setProvinces(mod.provinces);
      setIsLoading(false);
    });
  }, []);

  const [provinceValue, setProvinceValue] = useState<string | null>(null);
  const [districtValue, setDistrictValue] = useState<string | null>(null);
  const [subdistrictValue, setSubdistrictValue] = useState<string | null>(null);
  const [zipCodeValue, setZipCodeValue] = useState<string | null>(null);

  const selected = useMemo(() => {
    const province = provinces.find((p) => p.value === provinceValue) ?? null;

    const district = province?.districts.find((d) =>
      d.value === districtValue
    ) ?? null;

    const subdistrict =
      district?.subdistricts.find((s) => s.value === subdistrictValue) ?? null;

    const zipCode = subdistrict?.zipCodes.length === 1
      ? subdistrict.zipCodes[0]
      : subdistrict?.zipCodes.find((z) => z.value === zipCodeValue) ?? null;

    return { province, district, subdistrict, zipCode };
  }, [provinceValue, districtValue, subdistrictValue, zipCodeValue]);

  const districts = useMemo(() => {
    return selected.province?.districts ?? [];
  }, [selected.province?.value]);

  const subdistricts = useMemo(() => {
    return selected.district?.subdistricts ?? [];
  }, [selected.district?.value]);

  const zipCodes = useMemo(() => {
    return selected.subdistrict?.zipCodes ?? [];
  }, [selected.subdistrict?.value]);

  const selectProvince = (value: string) => {
    setProvinceValue(value);
  };

  const selectDistrict = (value: string) => {
    setDistrictValue(value);
  };

  const selectSubdistrict = (value: string) => {
    setSubdistrictValue(value);
  };

  const selectZipCode = (value: string) => {
    setZipCodeValue(value);
  };

  return {
    isLoading,
    provinces,
    districts,
    subdistricts,
    zipCodes,
    selected,
    selectProvince,
    selectDistrict,
    selectSubdistrict,
    selectZipCode,
  };
}
