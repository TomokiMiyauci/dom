import { toASCIILowerCase } from "../infra/string.ts";

export interface Encoding {
  name: string;
  labels: Set<string>;
}

/**
 * @see [Encoding Living Standard](https://encoding.spec.whatwg.org/#concept-encoding-get)
 */
export function getEncoding(label: string): Encoding | false {
  // Remove any leading and trailing ASCII whitespace from label.
  label = label.replace(/^[ \t\n\f\r]+|[ \t\n\f\r]+$/, "");
  label = toASCIILowerCase(label);

  // If label is an ASCII case-insensitive match for any of the labels listed in the table below, then return the corresponding encoding; otherwise return failure.
  for (const encoding of encodings) {
    if (encoding.labels.has(label)) return encoding;
  }

  return false;
}

export const utf8: Encoding = {
  name: "UTF-8",
  labels: new Set([
    "unicode-1-1-utf-8",
    "unicode11utf8",
    "unicode20utf8",
    "utf-8",
    "utf8",
    "x-unicode20utf8",
  ]),
};

export const ibm866: Encoding = {
  name: "IBM866",
  labels: new Set(["866", "cp866", "csibm866", "ibm866"]),
};

export const iso_8859_2: Encoding = {
  name: "ISO-8859-2",
  labels: new Set([
    "csisolatin2",
    "iso-8859-2",
    "iso-ir-101",
    "iso8859-2",
    "iso88592",
    "iso_8859-2",
    "iso_8859-2:1987",
    "l2",
    "latin2",
  ]),
};

export const iso_8859_3: Encoding = {
  name: "ISO-8859-3",
  labels: new Set([
    "csisolatin3",
    "iso-8859-3",
    "iso-ir-109",
    "iso8859-3",
    "iso88593",
    "iso_8859-3",
    "iso_8859-3:1988",
    "l3",
    "latin3",
  ]),
};

export const iso_8859_4: Encoding = {
  name: "ISO-8859-4",
  labels: new Set([
    "csisolatin4",
    "iso-8859-4",
    "iso-ir-110",
    "iso8859-4",
    "iso88594",
    "iso_8859-4",
    "iso_8859-4:1988",
    "l4",
    "latin4",
  ]),
};

export const iso_8859_5: Encoding = {
  name: "ISO-8859-5",
  labels: new Set([
    "csisolatincyrillic",
    "cyrillic",
    "iso-8859-5",
    "iso-ir-144",
    "iso8859-5",
    "iso88595",
    "iso_8859-5",
    "iso_8859-5:1988",
  ]),
};

export const iso_8859_6: Encoding = {
  name: "ISO-8859-6",
  labels: new Set([
    "arabic",
    "asmo-708",
    "csiso88596e",
    "csiso88596i",
    "csisolatinarabic",
    "ecma-114",
    "iso-8859-6",
    "iso-8859-6-e",
    "iso-8859-6-i",
    "iso-ir-127",
    "iso8859-6",
    "iso88596",
    "iso_8859-6",
    "iso_8859-6:1987",
  ]),
};

export const iso_8859_7: Encoding = {
  name: "ISO-8859-7",
  labels: new Set([
    "csisolatingreek",
    "ecma-118",
    "elot_928",
    "greek",
    "greek8",
    "iso-8859-7",
    "iso-ir-126",
    "iso8859-7",
    "iso88597",
    "iso_8859-7",
    "iso_8859-7:1987",
    "sun_eu_greek",
  ]),
};

export const iso_8859_8: Encoding = {
  name: "ISO-8859-8",
  labels: new Set([
    "csiso88598e",
    "csisolatinhebrew",
    "hebrew",
    "iso-8859-8",
    "iso-8859-8-e",
    "iso-ir-138",
    "iso8859-8",
    "iso88598",
    "iso_8859-8",
    "iso_8859-8:1988",
    "visual",
  ]),
};

export const iso_8859_8_i: Encoding = {
  name: "ISO-8859-8-I",
  labels: new Set(["csiso88598i", "iso-8859-8-i", "logical"]),
};

export const iso_8859_10: Encoding = {
  name: "ISO-8859-10",
  labels: new Set([
    "csisolatin6",
    "iso-8859-10",
    "iso-ir-157",
    "iso8859-10",
    "iso885910",
    "l6",
    "latin6",
  ]),
};

export const iso_8859_13: Encoding = {
  name: "ISO-8859-13",
  labels: new Set(["iso-8859-13", "iso8859-13", "iso885913"]),
};

export const iso_8859_14: Encoding = {
  name: "ISO-8859-14",
  labels: new Set(["iso-8859-14", "iso8859-14", "iso885914"]),
};

export const iso_8859_15: Encoding = {
  name: "ISO-8859-15",
  labels: new Set([
    "csisolatin9",
    "iso-8859-15",
    "iso8859-15",
    "iso885915",
    "iso_8859-15",
    "l9",
  ]),
};

export const iso_8859_16: Encoding = {
  name: "ISO-8859-16",
  labels: new Set(["iso-8859-16"]),
};

export const koi8_r: Encoding = {
  name: "KOI8-R",
  labels: new Set(["cskoi8r", "koi", "koi8", "koi8-r", "koi8_r"]),
};

export const koi8_u: Encoding = {
  name: "KOI8-U",
  labels: new Set(["koi8-ru", "koi8-u"]),
};

export const macintosh: Encoding = {
  name: "macintosh",
  labels: new Set(["csmacintosh", "mac", "macintosh", "x-mac-roman"]),
};

export const windows_874: Encoding = {
  name: "windows-874",
  labels: new Set([
    "dos-874",
    "iso-8859-11",
    "iso8859-11",
    "iso885911",
    "tis-620",
    "windows-874",
  ]),
};

export const windows_1250: Encoding = {
  name: "windows-1250",
  labels: new Set(["cp1250", "windows-1250", "x-cp1250"]),
};

export const windows_1251: Encoding = {
  name: "windows-1251",
  labels: new Set(["cp1251", "windows-1251", "x-cp1251"]),
};

export const windows_1252: Encoding = {
  name: "windows-1252",
  labels: new Set([
    "ansi_x3.4-1968",
    "ascii",
    "cp1252",
    "cp819",
    "csisolatin1",
    "ibm819",
    "iso-8859-1",
    "iso-ir-100",
    "iso8859-1",
    "iso88591",
    "iso_8859-1",
    "iso_8859-1:1987",
    "l1",
    "latin1",
    "us-ascii",
    "windows-1252",
    "x-cp1252",
  ]),
};

export const windows_1253: Encoding = {
  name: "windows-1253",
  labels: new Set(["cp1253", "windows-1253", "x-cp1253"]),
};

export const windows_1254: Encoding = {
  name: "windows-1254",
  labels: new Set([
    "cp1254",
    "csisolatin5",
    "iso-8859-9",
    "iso-ir-148",
    "iso8859-9",
    "iso88599",
    "iso_8859-9",
    "iso_8859-9:1989",
    "l5",
    "latin5",
    "windows-1254",
    "x-cp1254",
  ]),
};

export const windows_1255: Encoding = {
  name: "windows-1255",
  labels: new Set(["cp1255", "windows-1255", "x-cp1255"]),
};

export const windows_1256: Encoding = {
  name: "windows-1256",
  labels: new Set(["cp1256", "windows-1256", "x-cp1256"]),
};

export const windows_1257: Encoding = {
  name: "windows-1257",
  labels: new Set(["cp1257", "windows-1257", "x-cp1257"]),
};

export const windows_1258: Encoding = {
  name: "windows-1258",
  labels: new Set(["cp1258", "windows-1258", "x-cp1258"]),
};

export const x_mac_cyrillic: Encoding = {
  name: "x-mac-cyrillic",
  labels: new Set(["x-mac-cyrillic", "x-mac-ukrainian"]),
};

export const gbk: Encoding = {
  name: "GBK",
  labels: new Set([
    "chinese",
    "csgb2312",
    "csiso58gb231280",
    "gb2312",
    "gb_2312",
    "gb_2312-80",
    "gbk",
    "iso-ir-58",
    "x-gbk",
  ]),
};

export const gb18030: Encoding = {
  name: "gb18030",
  labels: new Set(["gb18030"]),
};

export const big_5: Encoding = {
  name: "Big5",
  labels: new Set(["big5", "big5-hkscs", "cn-big5", "csbig5", "x-x-big5"]),
};

export const euc_jp: Encoding = {
  name: "EUC-JP",
  labels: new Set(["cseucpkdfmtjapanese", "euc-jp", "x-euc-jp"]),
};

export const iso_2022_JP: Encoding = {
  name: "ISO-2022-JP",
  labels: new Set(["csiso2022jp", "iso-2022-jp"]),
};

export const shift_jis: Encoding = {
  name: "Shift_JIS",
  labels: new Set([
    "csshiftjis",
    "ms932",
    "ms_kanji",
    "shift-jis",
    "shift_jis",
    "sjis",
    "windows-31j",
    "x-sjis",
  ]),
};

export const euc_kr: Encoding = {
  name: "EUC-KR",
  labels: new Set([
    "cseuckr",
    "csksc56011987",
    "euc-kr",
    "iso-ir-149",
    "korean",
    "ks_c_5601-1987",
    "ks_c_5601-1989",
    "ksc5601",
    "ksc_5601",
    "windows-949",
  ]),
};

export const replacement: Encoding = {
  name: "replacement",
  labels: new Set([
    "csiso2022kr",
    "hz-gb-2312",
    "iso-2022-cn",
    "iso-2022-cn-ext",
    "iso-2022-kr",
    "replacement",
  ]),
};

const encodings = new Set<Encoding>([
  utf8,
  ibm866,
  iso_8859_2,
  iso_8859_3,
  iso_8859_4,
  iso_8859_5,
  iso_8859_6,
  iso_8859_7,
  iso_8859_8,
  iso_8859_8_i,
  iso_8859_10,
  iso_8859_13,
  iso_8859_14,
  iso_8859_15,
  iso_8859_16,
  koi8_r,
  koi8_u,
  macintosh,
  windows_874,
  windows_1250,
  windows_1251,
  windows_1252,
  windows_1253,
  windows_1254,
  windows_1255,
  windows_1256,
  windows_1257,
  windows_1258,
  x_mac_cyrillic,
  gbk,
  gb18030,
  big_5,
  euc_jp,
  iso_2022_JP,
  shift_jis,
  euc_kr,
  replacement,
]);
