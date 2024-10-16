const untranslated: any = {
  sykehus: {
    1: "Finnmark",
    2: "UNN",
    3: "Nordland",
    4: "Helgeland",
    6: "Nord-Trøndelag",
    7: "St. Olav",
    8: "Møre og Romsdal",
    10: "Førde",
    11: "Bergen",
    12: "Fonna",
    13: "Stavanger",
    14: "Østfold",
    15: "Akershus",
    16: "OUS",
    17: "Lovisenberg",
    18: "Diakonhjemmet",
    19: "Innlandet",
    20: "Vestre Viken",
    21: "Vestfold",
    22: "Telemark",
    23: "Sørlandet",
    8888: "Norge",
  },
  region: {
    1: "Helse Nord",
    2: "Helse Midt-Norge",
    3: "Helse Vest",
    4: "Helse Sør-Øst",
    8888: "Norge",
  },
};

export const hospitalStructure: { [region: number]: number[] } = {
  4: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  3: [10, 11, 12, 13],
  2: [6, 7, 8],
  1: [1, 2, 3, 4],
};
export class Selection {
  region: number[];
  sykehus: number[];

  constructor(init: { region: number[]; sykehus: number[] }) {
    this.region = init.region;
    this.sykehus = init.sykehus;
  }

  toggleRegion(region: number): Selection {
    if (this.region.includes(region)) {
      return new Selection({
        region: this.region.filter((elem) => elem !== region),
        sykehus: this.sykehus.filter(
          (elem) => !hospitalStructure[region].includes(elem),
        ),
      });
    } else {
      return new Selection({
        region: [...this.region, region],
        sykehus: Array.from(
          new Set([...this.sykehus, ...hospitalStructure[region]]),
        ),
      });
    }
  }
  toggleSykehus(sykehus: number): Selection {
    const newSykehus = this.sykehus.includes(sykehus)
      ? this.sykehus.filter((elem) => elem !== sykehus)
      : [...this.sykehus, sykehus];

    return new Selection({
      region: Object.keys(hospitalStructure)
        .map(Number)
        .filter((region) =>
          hospitalStructure[region].every((sykehus) =>
            newSykehus.includes(sykehus),
          ),
        ),
      sykehus: newSykehus,
    });
  }
}

export const regions_dict = {
  no: {
    sykehus: untranslated.sykehus,
    region: untranslated.region,
  },
  en: {
    sykehus: {
      ...untranslated.sykehus,
      8888: "Norway",
    },
    region: {
      ...untranslated.region,
      8888: "Norway",
    },
  },
};
