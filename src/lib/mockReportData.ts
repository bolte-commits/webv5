export const mockReport = {
  id: "BI-20260210-AM",
  patient: {
    name: "Arjun Mehta",
    firstName: "Arjun",
    age: 28,
    sex: "Male" as const,
    height: 175,
    weight: 73.4,
  },
  scanDate: "10 February 2026",
  scanNumber: 4,

  summary: {
    bodyFatPercent: 9.0,
    bodyFatRating: "Ultra Lean",
    bodyFatStatus: "green" as const,
    totalMass: 73.4,
    leanMass: 63.9,
    leanPercent: 87.1,
    fatMass: 6.6,
    fatPercent: 9.0,
    boneMass: 2.9,
    bonePercent: 3.9,
    overallNote:
      "Excellent body composition. Your lean mass is well above average and body fat is very low. Maintain your current training while ensuring adequate caloric intake — 9% is close to the essential fat floor.",
  },

  composition: {
    lean: {
      mass: 63.9,
      desc: "Muscles, organs, water & connective tissue. More lean mass means a higher metabolism.",
      verdict: "Above average",
      status: "green" as const,
      dotPosition: 75,
    },
    fat: {
      mass: 6.6,
      desc: "Essential fat for hormones & insulation plus stored energy. Too low affects recovery.",
      verdict: "Near essential minimum",
      status: "yellow" as const,
      dotPosition: 12,
    },
    bone: {
      mass: 2.9,
      desc: "Calcium & mineral content of your skeleton. Indicates bone strength and fracture risk.",
      verdict: "Normal range",
      status: "neutral" as const,
      dotPosition: 50,
    },
  },

  trends: {
    dates: ["Jan '23", "Nov '23", "Jan '25", "Feb '26"],
    bodyFat: [11.6, 10.8, 10.0, 9.0],
    leanMass: [61.6, 62.3, 63.1, 63.9],
    fatMass: [8.4, 7.8, 7.2, 6.6],
  },

  regions: [
    {
      name: "Trunk",
      fatPercent: 10.1,
      lean: 26.4,
      fat: 2.96,
      total: 30.0,
      prevFat: 12.8,
      prevDate: "Jan '23",
      fatTrend: [12.8, 11.9, 11.0, 10.1],
      leanTrend: [24.8, 25.3, 25.9, 26.4],
    },
    {
      name: "Arms",
      fatPercent: 8.0,
      lean: 8.4,
      fat: 0.73,
      total: 9.5,
      prevFat: 10.5,
      prevDate: "Jan '23",
      fatTrend: [10.5, 9.6, 8.8, 8.0],
      leanTrend: [7.6, 7.9, 8.1, 8.4],
    },
    {
      name: "Legs",
      fatPercent: 9.2,
      lean: 20.7,
      fat: 2.11,
      total: 23.5,
      prevFat: 11.5,
      prevDate: "Jan '23",
      fatTrend: [11.5, 10.7, 9.9, 9.2],
      leanTrend: [19.2, 19.7, 20.2, 20.7],
    },
    {
      name: "Android (Belly)",
      fatPercent: 12.3,
      lean: 3.2,
      fat: 0.45,
      total: 3.7,
      prevFat: 15.2,
      prevDate: "Jan '23",
      fatTrend: [15.2, 14.1, 13.2, 12.3],
      leanTrend: [2.8, 2.9, 3.1, 3.2],
    },
    {
      name: "Gynoid (Hip)",
      fatPercent: 9.5,
      lean: 7.8,
      fat: 0.82,
      total: 8.8,
      prevFat: 11.8,
      prevDate: "Jan '23",
      fatTrend: [11.8, 10.9, 10.2, 9.5],
      leanTrend: [7.0, 7.3, 7.5, 7.8],
    },
  ],

  symmetry: [
    {
      name: "Arms",
      left: { fatPercent: 8.2, total: 4.7, lean: 4.1, fat: 0.37, bone: 0.23 },
      right: { fatPercent: 7.8, total: 4.8, lean: 4.3, fat: 0.36, bone: 0.14 },
      verdict: "Good balance — right arm slightly stronger (dominant hand)",
      status: "green" as const,
      balancePercent: 72,
    },
    {
      name: "Legs",
      left: { fatPercent: 9.4, total: 11.5, lean: 10.2, fat: 1.06, bone: 0.24 },
      right: { fatPercent: 9.1, total: 11.8, lean: 10.5, fat: 1.05, bone: 0.25 },
      verdict: "Good balance — symmetric development",
      status: "green" as const,
      balancePercent: 80,
    },
    {
      name: "Trunk",
      left: { fatPercent: 10.3, total: 15.1, lean: 13.2, fat: 1.53, bone: 0.37 },
      right: { fatPercent: 9.9, total: 14.9, lean: 13.2, fat: 1.43, bone: 0.27 },
      verdict: "Good balance — even distribution",
      status: "green" as const,
      balancePercent: 68,
    },
  ],

  subcutaneousFat: {
    mass: 6.4,
    percent: 8.7,
    rating: "Low",
    status: "green" as const,
    note: "Subcutaneous fat is the fat stored under your skin. At 6.4 kg, yours is low — consistent with your lean physique.",
  },

  visceralFat: {
    mass: 185,
    volume: 202,
    area: 38.2,
    rating: "Safe",
    status: "green" as const,
    trend: [220, 205, 195, 185],
    note: "Your visceral fat is safe and trending down. At 185g (below 250g threshold), your organ fat levels are healthy.",
  },

  boneHealth: {
    tScore: 1.2,
    tScoreRating: "Normal",
    zScore: 1.4,
    zScoreRating: "Above avg",
    totalBMD: 1.25,
    regions: [
      { name: "Head", bmd: 2.31 },
      { name: "Arms", bmd: 0.85 },
      { name: "Legs", bmd: 1.42 },
      { name: "Trunk", bmd: 0.98 },
      { name: "Ribs", bmd: 0.76 },
      { name: "Spine", bmd: 1.22 },
      { name: "Pelvis", bmd: 1.19 },
    ],
    tScoreTrend: [0.4, 0.7, 1.0, 1.2],
    bmdTrend: [1.12, 1.16, 1.21, 1.25],
    note: "Excellent bone health. T-Score 1.2 and Z-Score 1.4 indicate strong, healthy bones.",
  },

  agRatio: {
    value: 1.29,
    status: "yellow" as const,
    verdict: "Above ideal — more belly fat than hip fat",
    note: "Bring your A/G ratio below 1.0. Focus on core training and reduce refined carbohydrates to shift fat distribution from belly toward hips over time.",
  },

  sarcopenia: {
    almi: 9.5,
    status: "green" as const,
    verdict: "Well above sarcopenia threshold (7.0)",
    formula: "(8.4 + 20.7) / 1.75² = 9.50 kg/m²",
    note: "No sarcopenia risk. Your ALMI of 9.50 kg/m² is well above the 7.0 threshold.",
  },

  metabolism: {
    rmr: 1742,
    aboveAvg: 5.2,
    tdee: 2395,
    breakdown: [
      { label: "Your RMR", value: 1742 },
      { label: "Lifestyle factor (light)", value: 348 },
      { label: "Workout calories", value: 305 },
    ],
    trend: [1680, 1700, 1720, 1742],
    activities: [
      { name: "Walking (4 km/h)", cal: 197 },
      { name: "Running (8 km/h)", cal: 570 },
      { name: "Cycling (20 km/h)", cal: 554 },
      { name: "Swimming", cal: 387 },
      { name: "Weight Lifting", cal: 190 },
      { name: "Boxing", cal: 744 },
      { name: "Yoga", cal: 121 },
    ],
  },

  nutrition: {
    tdee: 2395,
    proteinPerKg: 2,
    plans: [
      {
        goal: "Lose Fat",
        calories: 1895,
        note: "-500 deficit · ~0.5 kg/wk loss",
        protein: 147,
        carbs: 201,
        fat: 56,
      },
      {
        goal: "Maintain",
        calories: 2395,
        note: "Your TDEE · maintain weight",
        protein: 147,
        carbs: 301,
        fat: 67,
      },
      {
        goal: "Gain Muscle",
        calories: 2895,
        note: "+500 surplus · ~0.5 kg/wk gain",
        protein: 147,
        carbs: 397,
        fat: 80,
      },
    ],
    recommendation:
      "Recommended: Maintain or slight surplus. At 9% body fat, a deficit would push you below healthy levels. Eat 2395–2895 kcal to support training and recovery.",
  },

  actionPlan: [
    {
      title: "Don't cut calories further",
      desc: "At 9% body fat, you're near essential fat minimum. Eat at maintenance (2395 kcal) or above to support hormone function and recovery.",
    },
    {
      title: "Maintain your training routine",
      desc: "87% lean mass is outstanding. Continue your current resistance training — consistency matters more than intensity at this stage.",
    },
    {
      title: "Address your A/G ratio",
      desc: "At 1.29, you carry slightly more belly fat. Add core work and reduce refined carbs to bring this below 1.0.",
    },
    {
      title: "Hit your protein target daily",
      desc: "147g protein (2g/kg) daily. Focus on post-workout protein + carbs within 2 hours of training.",
    },
    {
      title: "Keep bone health strong",
      desc: "T-Score of 1.2 is great. Ensure 1000mg calcium and 2000 IU Vitamin D daily alongside weight-bearing exercise.",
    },
    {
      title: "Schedule your next scan",
      desc: "Book a follow-up DEXA in 2–3 months. Consistent tracking helps you make data-driven decisions.",
    },
  ],
};
