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

export const demoSpaces = () => [
    $w('.col-0 > .row-14'),
    $w('.col-0 > .row-12'),
    $w('.col-1 > .row-5'),
    $w('.col-1 > .row-1'),
    $w('.col-2 > .row-10'),
    $w('.col-2 > .row-6'),
    $w('.col-2 > .row-3'),
    $w('.col-3 > .row-14'),
    $w('.col-3 > .row-12'),
    $w('.col-3 > .row-5'),
    $w('.col-4 > .row-3'),
    $w('.col-4 > .row-1'),
    $w('.col-5 > .row-10'),
    $w('.col-5 > .row-6'),
    $w('.col-6 > .row-14'),
    $w('.col-6 > .row-12'),
    $w('.col-6 > .row-5'),
    $w('.col-6 > .row-3'),
    $w('.col-7 > .row-10'),
    $w('.col-7 > .row-1'),
    $w('.col-8 > .row-13'),
    $w('.col-8 > .row-8'),
    $w('.col-8 > .row-2'),
    $w('.col-8 > .row-0'),
    $w('.col-9 > .row-3'),
    $w('.col-9 > .row-1'),
    $w('.col-10 > .row-10'),
    $w('.col-10 > .row-5'),
    $w('.col-10 > .row-2'),
    $w('.col-11 > .row-13'),
    $w('.col-11 > .row-8'),
    $w('.col-11 > .row-3'),
    $w('.col-12 > .row-9'),
    $w('.col-12 > .row-3'),
    $w('.col-13 > .row-10'),
    $w('.col-13 > .row-7'),
    $w('.col-13 > .row-5'),
    $w('.col-13 > .row-2'),
    $w('.col-14 > .row-13'),
    $w('.col-14 > .row-9'),
    $w('.col-14 > .row-6'),
    $w('.col-14 > .row-1'),
    $w('.col-15 > .row-10'),
    $w('.col-15 > .row-8'),
    $w('.col-15 > .row-6')
];
