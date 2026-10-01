export interface ArrivalInfo {
  time: string; // 'Arr' or minutes like '4', '8', '18'
  minutesLeft: number; // 0 for Arr
  status: 'Imminent' | 'Approaching' | 'Normal';
  deck: 'Single' | 'Double';
  isWAB: boolean;
  load: 'Seats Avail' | 'Standing Avail' | 'Limited Standing';
  loadType: 'seats' | 'standing' | 'limited';
  plate: string;
}

export interface RouteStopTrajectory {
  code: string;
  name: string;
  road: string;
  passed?: boolean;
  isCurrent?: boolean;
  isNext?: boolean;
  hasBus?: boolean;
  busDistance?: string;
}

export interface BusServiceDetail {
  serviceNo: string;
  operator: 'SBS Transit' | 'SMRT' | 'Tower Transit' | 'Go-Ahead';
  primaryStopCode: string;
  direction1: {
    destination: string;
    via: string;
    arrivals: [ArrivalInfo, ArrivalInfo, ArrivalInfo];
    trajectory: RouteStopTrajectory[];
  };
  direction2: {
    destination: string;
    via: string;
    arrivals: [ArrivalInfo, ArrivalInfo, ArrivalInfo];
    trajectory: RouteStopTrajectory[];
  };
}

export interface BusStop {
  code: string;
  name: string;
  road: string;
  distanceMeters: number;
  walkingTimeMin: number;
  coordinates: { lat: number; lng: number };
  services: {
    serviceNo: string;
    destination: string;
    nextArrival: string; // 'Arr', '4m', '7m'
    following: string; // '8m • 18m'
    loadType: 'seats' | 'standing' | 'limited';
    deck: 'Single' | 'Double';
    isWAB: boolean;
  }[];
}

export interface ServiceAdvisory {
  id: string;
  title: string;
  effectiveDate: string;
  area: string;
  severity: 'info' | 'warning' | 'alert';
  details: string;
  affectedServices: string[];
}

export const BUS_STOPS: Record<string, BusStop> = {
  '01112': {
    code: '01112',
    name: 'Opp Bugis Stn Exit C',
    road: 'Victoria Street',
    distanceMeters: 85,
    walkingTimeMin: 1,
    coordinates: { lat: 1.3005, lng: 103.8560 },
    services: [
      { serviceNo: '147', destination: 'Clementi', nextArrival: 'Arr', following: '8m • 18m', loadType: 'seats', deck: 'Double', isWAB: true },
      { serviceNo: '2', destination: 'Kg Bahru', nextArrival: '4m', following: '14m • 26m', loadType: 'seats', deck: 'Single', isWAB: true },
      { serviceNo: '12', destination: 'Changi Village', nextArrival: '7m', following: '19m • 29m', loadType: 'standing', deck: 'Double', isWAB: true },
      { serviceNo: '33', destination: 'Kent Ridge', nextArrival: '1m', following: '11m • 22m', loadType: 'seats', deck: 'Double', isWAB: true },
      { serviceNo: '130', destination: 'Shenton Way', nextArrival: '6m', following: '16m • 27m', loadType: 'seats', deck: 'Single', isWAB: true },
      { serviceNo: '197', destination: 'Jurong East', nextArrival: '12m', following: '24m • 38m', loadType: 'limited', deck: 'Double', isWAB: true },
    ]
  },
  '01139': {
    code: '01139',
    name: 'Bugis Stn / Parkview Sq',
    road: 'North Bridge Road',
    distanceMeters: 140,
    walkingTimeMin: 2,
    coordinates: { lat: 1.3012, lng: 103.8576 },
    services: [
      { serviceNo: '7', destination: 'Clementi', nextArrival: 'Arr', following: '9m • 19m', loadType: 'seats', deck: 'Double', isWAB: true },
      { serviceNo: '32', destination: 'Buona Vista', nextArrival: '5m', following: '14m • 25m', loadType: 'standing', deck: 'Single', isWAB: true },
      { serviceNo: '51', destination: 'Jurong East', nextArrival: '8m', following: '20m • 31m', loadType: 'seats', deck: 'Double', isWAB: true },
      { serviceNo: '61', destination: 'Bt Batok', nextArrival: '3m', following: '15m • 27m', loadType: 'limited', deck: 'Double', isWAB: true },
      { serviceNo: '63', destination: 'Rumah Tinggi', nextArrival: '2m', following: '12m • 22m', loadType: 'seats', deck: 'Double', isWAB: true },
      { serviceNo: '851', destination: 'Bt Merah', nextArrival: '10m', following: '22m • 35m', loadType: 'standing', deck: 'Single', isWAB: true },
    ]
  },
  '01059': {
    code: '01059',
    name: 'Bugis Stn Exit B',
    road: 'Victoria Street',
    distanceMeters: 210,
    walkingTimeMin: 3,
    coordinates: { lat: 1.3016, lng: 103.8552 },
    services: [
      { serviceNo: '2', destination: 'Changi Village', nextArrival: '6m', following: '18m • 28m', loadType: 'seats', deck: 'Double', isWAB: true },
      { serviceNo: '12', destination: 'Kg Bahru', nextArrival: 'Arr', following: '11m • 21m', loadType: 'seats', deck: 'Double', isWAB: true },
      { serviceNo: '147', destination: 'Hougang Ctrl', nextArrival: '5m', following: '13m • 25m', loadType: 'standing', deck: 'Double', isWAB: true },
      { serviceNo: '175', destination: 'Geylang Lor 1', nextArrival: '9m', following: '21m • 33m', loadType: 'seats', deck: 'Single', isWAB: true },
      { serviceNo: '190', destination: 'Cck Int', nextArrival: '1m', following: '10m • 20m', loadType: 'seats', deck: 'Double', isWAB: true },
      { serviceNo: '851e', destination: 'Yishun Int', nextArrival: '14m', following: '31m • 48m', loadType: 'seats', deck: 'Single', isWAB: true },
    ]
  },
  '01541': {
    code: '01541',
    name: 'Bugis Stn Exit D',
    road: 'Rochor Road',
    distanceMeters: 320,
    walkingTimeMin: 4,
    coordinates: { lat: 1.3023, lng: 103.8545 },
    services: [
      { serviceNo: '48', destination: 'Buona Vista', nextArrival: 'Arr', following: '12m • 24m', loadType: 'seats', deck: 'Single', isWAB: true },
      { serviceNo: '57', destination: 'Bt Merah', nextArrival: '6m', following: '17m • 28m', loadType: 'standing', deck: 'Double', isWAB: true },
      { serviceNo: '851', destination: 'Yishun Int', nextArrival: '7m', following: '19m • 32m', loadType: 'seats', deck: 'Single', isWAB: true },
      { serviceNo: '960', destination: 'Woodlands', nextArrival: '3m', following: '11m • 23m', loadType: 'seats', deck: 'Double', isWAB: true },
      { serviceNo: '980', destination: 'Sembawang', nextArrival: '11m', following: '23m • 36m', loadType: 'limited', deck: 'Double', isWAB: true },
      { serviceNo: 'NR7', destination: 'NightRider', nextArrival: 'Past 11pm', following: 'Weekend only', loadType: 'seats', deck: 'Single', isWAB: true },
    ]
  },
  '01113': {
    code: '01113',
    name: 'Bugis Stn Exit A',
    road: 'Victoria Street',
    distanceMeters: 390,
    walkingTimeMin: 5,
    coordinates: { lat: 1.3028, lng: 103.8569 },
    services: [
      { serviceNo: '7', destination: 'Bedok Int', nextArrival: '3m', following: '13m • 22m', loadType: 'seats', deck: 'Double', isWAB: true },
      { serviceNo: '12', destination: 'Pasir Ris', nextArrival: '8m', following: '17m • 29m', loadType: 'standing', deck: 'Double', isWAB: true },
      { serviceNo: '147', destination: 'Hougang Ctrl', nextArrival: '2m', following: '10m • 22m', loadType: 'seats', deck: 'Double', isWAB: true },
    ]
  },
  '01039': {
    code: '01039',
    name: 'Bugis Cube',
    road: 'North Bridge Road',
    distanceMeters: 420,
    walkingTimeMin: 6,
    coordinates: { lat: 1.2995, lng: 103.8550 },
    services: [
      { serviceNo: '851', destination: 'Bukit Merah', nextArrival: '5m', following: '15m • 28m', loadType: 'seats', deck: 'Double', isWAB: true },
      { serviceNo: '61', destination: 'Bt Batok', nextArrival: '9m', following: '21m • 34m', loadType: 'standing', deck: 'Double', isWAB: true },
    ]
  }
};

export const BUS_SERVICES: Record<string, BusServiceDetail> = {
  '147': {
    serviceNo: '147',
    operator: 'SBS Transit',
    primaryStopCode: '01112',
    direction1: {
      destination: 'To Clementi Int',
      via: 'via Chinatown & Commonwealth',
      arrivals: [
        { time: 'Arr', minutesLeft: 0, status: 'Imminent', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3190A' },
        { time: '8', minutesLeft: 8, status: 'Normal', deck: 'Single', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS3482D' },
        { time: '18', minutesLeft: 18, status: 'Normal', deck: 'Double', isWAB: true, load: 'Limited Standing', loadType: 'limited', plate: 'SBS6819S' }
      ],
      trajectory: [
        { code: '01211', name: 'Opp Blk 461', road: 'Victoria St', passed: true },
        { code: '01112', name: 'Opp Bugis Stn (Exit C)', road: 'Victoria St', isCurrent: true, hasBus: true, busDistance: 'Bus 147 (~250m)' },
        { code: '01012', name: 'Hotel Grand Pacific', road: 'Victoria St', isNext: true },
        { code: '01019', name: 'Bras Basah Cplx', road: 'Victoria St' },
        { code: '04151', name: 'Cath of Good Shepherd', road: 'Victoria St' }
      ]
    },
    direction2: {
      destination: 'To Hougang Ctrl Int',
      via: 'via Serangoon & Potong Pasir',
      arrivals: [
        { time: '5', minutesLeft: 5, status: 'Approaching', deck: 'Double', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS3201P' },
        { time: '13', minutesLeft: 13, status: 'Normal', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS7450K' },
        { time: '25', minutesLeft: 25, status: 'Normal', deck: 'Single', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS6210Y' }
      ],
      trajectory: [
        { code: '01059', name: 'Bugis Stn Exit B', road: 'Victoria St', isCurrent: true, hasBus: true, busDistance: 'Bus 147 (~600m)' },
        { code: '01113', name: 'Bugis Stn Exit A', road: 'Victoria St', isNext: true },
        { code: '01229', name: 'Bef Sultan Mque', road: 'Victoria St' },
        { code: '01311', name: 'Lavender Stn', road: 'Kallang Rd' }
      ]
    }
  },
  '7': {
    serviceNo: '7',
    operator: 'SBS Transit',
    primaryStopCode: '01139',
    direction1: {
      destination: 'To Clementi Int',
      via: 'via Orchard Rd & Holland Village',
      arrivals: [
        { time: 'Arr', minutesLeft: 0, status: 'Imminent', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3509J' },
        { time: '9', minutesLeft: 9, status: 'Normal', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3721H' },
        { time: '19', minutesLeft: 19, status: 'Normal', deck: 'Single', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS6502E' }
      ],
      trajectory: [
        { code: '01039', name: 'Bugis Cube', road: 'North Bridge Rd', passed: true },
        { code: '01139', name: 'Bugis Stn / Parkview Sq', road: 'North Bridge Rd', isCurrent: true, hasBus: true, busDistance: 'Bus 7 (~180m)' },
        { code: '01149', name: 'Parkview Sq', road: 'North Bridge Rd', isNext: true },
        { code: '01121', name: 'Raffles Hotel', road: 'Bras Basah Rd' }
      ]
    },
    direction2: {
      destination: 'To Bedok Int',
      via: 'via Geylang & Eunos',
      arrivals: [
        { time: '3', minutesLeft: 3, status: 'Approaching', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3800B' },
        { time: '13', minutesLeft: 13, status: 'Normal', deck: 'Single', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS6299M' },
        { time: '22', minutesLeft: 22, status: 'Normal', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3911G' }
      ],
      trajectory: [
        { code: '01113', name: 'Bugis Stn Exit A', road: 'Victoria St', isCurrent: true, hasBus: true, busDistance: 'Bus 7 (~300m)' },
        { code: '01229', name: 'Bef Sultan Mque', road: 'Victoria St', isNext: true }
      ]
    }
  },
  '2': {
    serviceNo: '2',
    operator: 'SBS Transit',
    primaryStopCode: '01112',
    direction1: {
      destination: 'To Kampong Bahru Ter',
      via: 'via Chinatown & New Bridge Rd',
      arrivals: [
        { time: '4', minutesLeft: 4, status: 'Approaching', deck: 'Single', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS6311A' },
        { time: '14', minutesLeft: 14, status: 'Normal', deck: 'Double', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS3612K' },
        { time: '26', minutesLeft: 26, status: 'Normal', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3901M' }
      ],
      trajectory: [
        { code: '01211', name: 'Opp Blk 461', road: 'Victoria St', passed: true },
        { code: '01112', name: 'Opp Bugis Stn (Exit C)', road: 'Victoria St', isCurrent: true, hasBus: true, busDistance: 'Bus 2 (~400m)' },
        { code: '01012', name: 'Hotel Grand Pacific', road: 'Victoria St', isNext: true }
      ]
    },
    direction2: {
      destination: 'To Changi Village Ter',
      via: 'via Bedok & Upper Changi',
      arrivals: [
        { time: '6', minutesLeft: 6, status: 'Approaching', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3521R' },
        { time: '18', minutesLeft: 18, status: 'Normal', deck: 'Double', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS3401S' },
        { time: '28', minutesLeft: 28, status: 'Normal', deck: 'Single', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS6004X' }
      ],
      trajectory: [
        { code: '01059', name: 'Bugis Stn Exit B', road: 'Victoria St', isCurrent: true, hasBus: true, busDistance: 'Bus 2 (~550m)' }
      ]
    }
  },
  '12': {
    serviceNo: '12',
    operator: 'SBS Transit',
    primaryStopCode: '01112',
    direction1: {
      destination: 'To Kampong Bahru Ter',
      via: 'via Bugis & Chinatown',
      arrivals: [
        { time: 'Arr', minutesLeft: 0, status: 'Imminent', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3822T' },
        { time: '11', minutesLeft: 11, status: 'Normal', deck: 'Double', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS3915C' },
        { time: '21', minutesLeft: 21, status: 'Normal', deck: 'Single', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS6192H' }
      ],
      trajectory: [
        { code: '01059', name: 'Bugis Stn Exit B', road: 'Victoria St', isCurrent: true, hasBus: true, busDistance: 'Bus 12 (~100m)' }
      ]
    },
    direction2: {
      destination: 'To Pasir Ris Int',
      via: 'via Kallang & Tampines',
      arrivals: [
        { time: '7', minutesLeft: 7, status: 'Normal', deck: 'Double', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS3388L' },
        { time: '19', minutesLeft: 19, status: 'Normal', deck: 'Double', isWAB: true, load: 'Limited Standing', loadType: 'limited', plate: 'SBS3502D' },
        { time: '29', minutesLeft: 29, status: 'Normal', deck: 'Single', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS6720D' }
      ],
      trajectory: [
        { code: '01112', name: 'Opp Bugis Stn (Exit C)', road: 'Victoria St', isCurrent: true, hasBus: true, busDistance: 'Bus 12 (~700m)' }
      ]
    }
  },
  '14': {
    serviceNo: '14',
    operator: 'SBS Transit',
    primaryStopCode: '01112',
    direction1: {
      destination: 'To Clementi Int',
      via: 'via Orchard, Dover & Clementi Rd',
      arrivals: [
        { time: '3', minutesLeft: 3, status: 'Approaching', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3100M' },
        { time: '11', minutesLeft: 11, status: 'Normal', deck: 'Double', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS3200R' },
        { time: '22', minutesLeft: 22, status: 'Normal', deck: 'Single', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS6020A' }
      ],
      trajectory: [
        { code: '01211', name: 'Opp Blk 461', road: 'Victoria St', passed: true },
        { code: '01112', name: 'Opp Bugis Stn (Exit C)', road: 'Victoria St', isCurrent: true, hasBus: true, busDistance: 'Bus 14 (~350m)' }
      ]
    },
    direction2: {
      destination: 'To Bedok Int',
      via: 'via Mountbatten & Marine Parade',
      arrivals: [
        { time: '8', minutesLeft: 8, status: 'Normal', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3788A' },
        { time: '18', minutesLeft: 18, status: 'Normal', deck: 'Single', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS6412D' },
        { time: '29', minutesLeft: 29, status: 'Normal', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3982H' }
      ],
      trajectory: [
        { code: '01059', name: 'Bugis Stn Exit B', road: 'Victoria St', isCurrent: true }
      ]
    }
  },
  '65': {
    serviceNo: '65',
    operator: 'SBS Transit',
    primaryStopCode: '01139',
    direction1: {
      destination: 'To HarbourFront Int',
      via: 'via Orchard & Lower Delta',
      arrivals: [
        { time: '5', minutesLeft: 5, status: 'Approaching', deck: 'Double', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS3322E' },
        { time: '15', minutesLeft: 15, status: 'Normal', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3445X' },
        { time: '25', minutesLeft: 25, status: 'Normal', deck: 'Single', isWAB: true, load: 'Limited Standing', loadType: 'limited', plate: 'SBS6830U' }
      ],
      trajectory: [
        { code: '01139', name: 'Bugis Stn / Parkview Sq', road: 'North Bridge Rd', isCurrent: true, hasBus: true, busDistance: 'Bus 65 (~450m)' }
      ]
    },
    direction2: {
      destination: 'To Tampines Int',
      via: 'via MacPherson & Bedok Reservoir',
      arrivals: [
        { time: '4', minutesLeft: 4, status: 'Approaching', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3500K' },
        { time: '14', minutesLeft: 14, status: 'Normal', deck: 'Double', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS3600L' },
        { time: '24', minutesLeft: 24, status: 'Normal', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3700M' }
      ],
      trajectory: [
        { code: '01039', name: 'Bugis Cube', road: 'North Bridge Rd', isCurrent: true }
      ]
    }
  },
  '174': {
    serviceNo: '174',
    operator: 'SBS Transit',
    primaryStopCode: '01112',
    direction1: {
      destination: 'To Boon Lay Int',
      via: 'via Orchard, Bukit Timah & Jurong',
      arrivals: [
        { time: '6', minutesLeft: 6, status: 'Approaching', deck: 'Single', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS6901A' },
        { time: '16', minutesLeft: 16, status: 'Normal', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3955W' },
        { time: '28', minutesLeft: 28, status: 'Normal', deck: 'Double', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS3812Q' }
      ],
      trajectory: [
        { code: '01112', name: 'Opp Bugis Stn (Exit C)', road: 'Victoria St', isCurrent: true, hasBus: true, busDistance: 'Bus 174 (~500m)' }
      ]
    },
    direction2: {
      destination: 'To New Bridge Rd Ter',
      via: 'via River Valley & Clarke Quay',
      arrivals: [
        { time: '9', minutesLeft: 9, status: 'Normal', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3702T' },
        { time: '19', minutesLeft: 19, status: 'Normal', deck: 'Single', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS6444K' },
        { time: '30', minutesLeft: 30, status: 'Normal', deck: 'Double', isWAB: true, load: 'Limited Standing', loadType: 'limited', plate: 'SBS3890H' }
      ],
      trajectory: [
        { code: '01059', name: 'Bugis Stn Exit B', road: 'Victoria St', isCurrent: true }
      ]
    }
  },
  '190': {
    serviceNo: '190',
    operator: 'SBS Transit',
    primaryStopCode: '01059',
    direction1: {
      destination: 'To Choa Chu Kang Int',
      via: 'via Dhoby Ghaut, Orchard & BKE',
      arrivals: [
        { time: '1', minutesLeft: 1, status: 'Imminent', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SMB5011M' },
        { time: '10', minutesLeft: 10, status: 'Normal', deck: 'Double', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SMB5022K' },
        { time: '20', minutesLeft: 20, status: 'Normal', deck: 'Double', isWAB: true, load: 'Limited Standing', loadType: 'limited', plate: 'SMB5033H' }
      ],
      trajectory: [
        { code: '01059', name: 'Bugis Stn Exit B', road: 'Victoria St', isCurrent: true, hasBus: true, busDistance: 'Bus 190 (~120m)' }
      ]
    },
    direction2: {
      destination: 'To Kampong Bahru Ter',
      via: 'via Clarke Quay & Chinatown',
      arrivals: [
        { time: '7', minutesLeft: 7, status: 'Normal', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SMB5044G' },
        { time: '16', minutesLeft: 16, status: 'Normal', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SMB5055D' },
        { time: '27', minutesLeft: 27, status: 'Normal', deck: 'Single', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SMB3011B' }
      ],
      trajectory: [
        { code: '01112', name: 'Opp Bugis Stn (Exit C)', road: 'Victoria St', isCurrent: true }
      ]
    }
  },
  '851': {
    serviceNo: '851',
    operator: 'SBS Transit',
    primaryStopCode: '01541',
    direction1: {
      destination: 'To Yishun Int',
      via: 'via Novena, Ang Mo Kio & Khatib',
      arrivals: [
        { time: '7', minutesLeft: 7, status: 'Normal', deck: 'Single', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS6800X' },
        { time: '19', minutesLeft: 19, status: 'Normal', deck: 'Double', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS3544Z' },
        { time: '32', minutesLeft: 32, status: 'Normal', deck: 'Single', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS6711T' }
      ],
      trajectory: [
        { code: '01541', name: 'Bugis Stn Exit D', road: 'Rochor Rd', isCurrent: true, hasBus: true, busDistance: 'Bus 851 (~650m)' }
      ]
    },
    direction2: {
      destination: 'To Bukit Merah Int',
      via: 'via Clarke Quay & Tiong Bahru',
      arrivals: [
        { time: '10', minutesLeft: 10, status: 'Normal', deck: 'Double', isWAB: true, load: 'Standing Avail', loadType: 'standing', plate: 'SBS3620L' },
        { time: '22', minutesLeft: 22, status: 'Normal', deck: 'Double', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS3710Y' },
        { time: '35', minutesLeft: 35, status: 'Normal', deck: 'Single', isWAB: true, load: 'Seats Avail', loadType: 'seats', plate: 'SBS6200A' }
      ],
      trajectory: [
        { code: '01139', name: 'Bugis Stn / Parkview Sq', road: 'North Bridge Rd', isCurrent: true }
      ]
    }
  }
};

export const SERVICE_ADVISORIES: ServiceAdvisory[] = [
  {
    id: 'adv-1',
    title: 'Service 16/16M Affected by Road Closure for Joo Chiat Car-Free Day',
    effectiveDate: '01 Oct 2026',
    area: 'Marine Parade / Joo Chiat Area',
    severity: 'warning',
    details: 'Services 16 and 16M will skip 4 bus stops along Joo Chiat Road between Dunman Road and East Coast Road due to the community street festival from 08:00 to 22:00. Commuters are advised to board at alternative stops along Still Road.',
    affectedServices: ['16', '16M']
  },
  {
    id: 'adv-2',
    title: 'Updated Bus Stop Distances & Commuter Fare Stage Recomputations',
    effectiveDate: '30 Sep 2026',
    area: 'Island-wide Fare Stages',
    severity: 'info',
    details: 'In accordance with the Public Transport Council (PTC) annual distance verification exercise, revised travel fare stage increments have taken effect across 14 trunk routes. Card fares will automatically calibrate to the certified geodesic distances.',
    affectedServices: ['2', '7', '12', '14', '65', '147', '190']
  },
  {
    id: 'adv-3',
    title: 'Downtown Line Peak Frequency Boost & Dynamic Fleet Headway',
    effectiveDate: 'Active Daily',
    area: 'Downtown Line (DTL) & Connecting Feeder Corridors',
    severity: 'info',
    details: 'DTL train frequency enhanced to 2.2-minute headways during morning (07:30 - 09:15) and evening (17:45 - 19:30) peak periods. Corresponding connection buffers on bus services 147, 65, and 12 at Bugis, Chinatown, and Little India MRT stations have been synchronized.',
    affectedServices: ['DTL', '147', '65', '12']
  }
];

export const POPULAR_BUGIS_SERVICES = ['2', '7', '12', '14', '65', '147', '174', '190', '851'];
