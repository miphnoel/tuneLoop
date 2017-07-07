export const pitches = {
  major: {
    14: "C3",
    13: "D3",
    12: "E3",
    11: "F3",
    10: "G3",
    9: "A3",
    8: "B3",
    7: "C4",
    6: "D4",
    5: "E4",
    4: "F4",
    3: "G4",
    2: "A4",
    1: "B4",
    0: "C5"
  },
  minor: {
    14: "C3",
    13: "D3",
    12: "Eb3",
    11: "F3",
    10: "G3",
    9: "Ab3",
    8: "B3",
    7: "C4",
    6: "D4",
    5: "Eb4",
    4: "F4",
    3: "G4",
    2: "Ab4",
    1: "B4",
    0: "C5"
  }
};

export const defaultMap = {
  0: {},
  1: {},
  2: {},
  3: {},
  4: {},
  5: {},
  6: {},
  7: {},
  8: {},
  9: {},
  10: {},
  11: {},
  12: {},
  13: {},
  14: {},
  15: {}
};

export const intervals = {
  major: [
    pitches.major[2],
    pitches.major[5],
    pitches.major[9],
    pitches.major[12]
  ],
  minor: [
    pitches.minor[2],
    pitches.minor[5],
    pitches.minor[9],
    pitches.minor[12]
  ]
};
