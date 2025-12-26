import "global-jsdom/register";

import { assertEquals } from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useThaiAddress } from "./use_thai_address.ts";

describe("useThaiAddress", () => {
  let result: {
    current: ReturnType<typeof useThaiAddress>;
  };

  beforeEach(async () => {
    const hook = renderHook(() => useThaiAddress());
    result = hook.result;

    await waitFor(() => assertEquals(result.current.isLoading, false));
  });

  it("initialize with null values", () => {
    assertEquals(result.current.selected.province, null);
    assertEquals(result.current.selected.district, null);
    assertEquals(result.current.selected.subdistrict, null);
    assertEquals(result.current.selected.zipCode, null);
  });

  it("initialize with provinces data", () => {
    assertEquals(result.current.provinces.length, 77);
  });

  it("initialize with empty districts, subdistricts, and zipCodes", () => {
    assertEquals(result.current.districts, []);
    assertEquals(result.current.subdistricts, []);
    assertEquals(result.current.zipCodes, []);
  });

  it("populate districts when a province is selected", () => {
    act(() => {
      result.current.selectProvince("กรุงเทพมหานคร");
    });

    assertEquals(result.current.selected.province?.value, "กรุงเทพมหานคร");
    assertEquals(result.current.districts.length > 0, true);
    assertEquals(result.current.subdistricts, []);
    assertEquals(result.current.zipCodes, []);
  });

  it("populate subdistricts when a district is selected", () => {
    act(() => {
      result.current.selectProvince("กรุงเทพมหานคร");
      result.current.selectDistrict("พระนคร");
    });

    assertEquals(result.current.selected.district?.value, "พระนคร");
    assertEquals(result.current.subdistricts.length > 0, true);
    assertEquals(result.current.zipCodes, []);
  });

  it("populate zipCodes when a subdistrict is selected", () => {
    act(() => {
      result.current.selectProvince("กรุงเทพมหานคร");
      result.current.selectDistrict("พระนคร");
      result.current.selectSubdistrict("พระบรมมหาราชวัง");
    });

    assertEquals(result.current.selected.subdistrict?.value, "พระบรมมหาราชวัง");
    assertEquals(result.current.zipCodes.length > 0, true);
  });

  it("auto-select zipCode when subdistrict has only one zipCode", () => {
    act(() => {
      result.current.selectProvince("กรุงเทพมหานคร");
      result.current.selectDistrict("พระนคร");
      result.current.selectSubdistrict("พระบรมมหาราชวัง");
    });

    assertEquals(result.current.selected.zipCode?.value, "10200");
  });

  it("set zipCode when a zipCode is selected", () => {
    act(() => {
      result.current.selectProvince("กรุงเทพมหานคร");
      result.current.selectDistrict("ดุสิต");
      result.current.selectSubdistrict("สวนจิตรลดา");
      result.current.selectZipCode("10300");
    });

    assertEquals(result.current.selected.zipCode?.value, "10300");
  });

  it("reset district, subdistrict, and zipCode selections when a province selection changes", () => {
    act(() => {
      result.current.selectProvince("กรุงเทพมหานคร");
      result.current.selectDistrict("พระนคร");
      result.current.selectSubdistrict("พระบรมมหาราชวัง");
      result.current.selectZipCode("10200");

      result.current.selectProvince("เชียงใหม่");
    });

    assertEquals(result.current.selected.province?.value, "เชียงใหม่");
    assertEquals(result.current.selected.district, null);
    assertEquals(result.current.selected.subdistrict, null);
    assertEquals(result.current.selected.zipCode, null);

    assertEquals(result.current.districts.length > 0, true);
    assertEquals(result.current.subdistricts, []);
    assertEquals(result.current.zipCodes, []);
  });

  it("reset subdistrict and zipCode selections when a district selection changes", () => {
    act(() => {
      result.current.selectProvince("กรุงเทพมหานคร");
      result.current.selectDistrict("พระนคร");
      result.current.selectSubdistrict("พระบรมมหาราชวัง");

      result.current.selectDistrict("ดุสิต");
    });

    assertEquals(result.current.selected.province?.value, "กรุงเทพมหานคร");
    assertEquals(result.current.selected.district?.value, "ดุสิต");
    assertEquals(result.current.selected.subdistrict, null);
    assertEquals(result.current.selected.zipCode, null);

    assertEquals(result.current.subdistricts.length > 0, true);
    assertEquals(result.current.zipCodes, []);
  });

  it("reset zipCode selection when a subdistrict selection changes", () => {
    act(() => {
      result.current.selectProvince("กรุงเทพมหานคร");
      result.current.selectDistrict("ดุสิต");
      result.current.selectSubdistrict("ดุสิต");

      result.current.selectSubdistrict("สวนจิตรลดา");
    });

    assertEquals(result.current.selected.province?.value, "กรุงเทพมหานคร");
    assertEquals(result.current.selected.district?.value, "ดุสิต");
    assertEquals(result.current.selected.subdistrict?.value, "สวนจิตรลดา");
    assertEquals(result.current.selected.zipCode, null);

    assertEquals(result.current.zipCodes.length > 0, true);
  });

  it("not set selected province when an invalid province is provided", () => {
    const { result } = renderHook(() => useThaiAddress());

    act(() => {
      result.current.selectProvince("InvalidProvince");
    });

    assertEquals(result.current.selected.province, null);
    assertEquals(result.current.districts, []);
    assertEquals(result.current.subdistricts, []);
    assertEquals(result.current.zipCodes, []);
  });

  it("not set selected district when an invalid district is provided", () => {
    act(() => {
      result.current.selectProvince("กรุงเทพมหานคร");
      result.current.selectDistrict("InvalidDistrict");
    });

    assertEquals(result.current.selected.province?.value, "กรุงเทพมหานคร");
    assertEquals(result.current.selected.district, null);
    assertEquals(result.current.subdistricts, []);
  });

  it("not set selected subdistrict when an invalid subdistrict is provided", () => {
    act(() => {
      result.current.selectProvince("กรุงเทพมหานคร");
      result.current.selectDistrict("ดุสิต");
      result.current.selectSubdistrict("InvalidSubdistrict");
    });

    assertEquals(result.current.selected.province?.value, "กรุงเทพมหานคร");
    assertEquals(result.current.selected.district?.value, "ดุสิต");
    assertEquals(result.current.selected.subdistrict, null);
    assertEquals(result.current.zipCodes, []);
  });

  it("not set selected zipCode when an invalid zipCode is provided", () => {
    act(() => {
      result.current.selectProvince("กรุงเทพมหานคร");
      result.current.selectDistrict("ดุสิต");
      result.current.selectSubdistrict("สวนจิตรลดา");
      result.current.selectZipCode("InvalidZipCode");
    });

    assertEquals(result.current.selected.province?.value, "กรุงเทพมหานคร");
    assertEquals(result.current.selected.district?.value, "ดุสิต");
    assertEquals(result.current.selected.subdistrict?.value, "สวนจิตรลดา");
    assertEquals(result.current.selected.zipCode, null);
  });
});
