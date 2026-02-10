"use client";

import { useState } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import styles from "./page.module.css";

interface ScheduleEntry {
  landmark: string;
  day: string;
  date: string;
  time: string;
  full?: boolean;
}

interface AreaGroup {
  area: string;
  dates: ScheduleEntry[];
}

interface CityData {
  id: string;
  groups: AreaGroup[];
}

const SCHEDULE_DATA: CityData[] = [
  {
    id: "bangalore",
    groups: [
      {
        area: "North Bangalore",
        dates: [
          { landmark: "Manyata Tech Park", day: "Monday", date: "Feb 10", time: "9 AM - 7 PM" },
          { landmark: "Manyata Tech Park", day: "Tuesday", date: "Feb 11", time: "9 AM - 7 PM" },
          { landmark: "Prestige Shantiniketan", day: "Saturday", date: "Feb 15", time: "8 AM - 2 PM" },
        ],
      },
      {
        area: "South Bangalore",
        dates: [
          { landmark: "Cult.fit HSR Layout", day: "Wednesday", date: "Feb 12", time: "6 AM - 8 PM" },
          { landmark: "Cult.fit HSR Layout", day: "Thursday", date: "Feb 13", time: "6 AM - 8 PM" },
          { landmark: "Cult.fit HSR Layout", day: "Friday", date: "Feb 14", time: "6 AM - 8 PM", full: true },
          { landmark: "Sobha City Apartments", day: "Sunday", date: "Feb 16", time: "9 AM - 3 PM" },
        ],
      },
      {
        area: "Central Bangalore",
        dates: [
          { landmark: "M Chinnaswamy Stadium", day: "Saturday", date: "Feb 22", time: "7 AM - 5 PM" },
          { landmark: "M Chinnaswamy Stadium", day: "Sunday", date: "Feb 23", time: "7 AM - 5 PM" },
        ],
      },
    ],
  },
  {
    id: "mumbai",
    groups: [
      {
        area: "South Mumbai",
        dates: [
          { landmark: "Wankhede Stadium", day: "Monday", date: "Feb 17", time: "8 AM - 6 PM" },
          { landmark: "Wankhede Stadium", day: "Tuesday", date: "Feb 18", time: "8 AM - 6 PM" },
        ],
      },
      {
        area: "Western Suburbs",
        dates: [
          { landmark: "Gold's Gym Andheri", day: "Thursday", date: "Feb 20", time: "6 AM - 10 PM" },
          { landmark: "Gold's Gym Andheri", day: "Friday", date: "Feb 21", time: "6 AM - 10 PM" },
          { landmark: "Lodha Bellissimo", day: "Saturday", date: "Feb 22", time: "9 AM - 4 PM" },
        ],
      },
      {
        area: "BKC",
        dates: [
          { landmark: "Jio World Drive", day: "Wednesday", date: "Feb 26", time: "10 AM - 8 PM" },
          { landmark: "Jio World Drive", day: "Thursday", date: "Feb 27", time: "10 AM - 8 PM", full: true },
        ],
      },
    ],
  },
  {
    id: "delhi",
    groups: [
      {
        area: "Gurgaon",
        dates: [
          { landmark: "DLF Cyber City", day: "Monday", date: "Feb 24", time: "9 AM - 7 PM" },
          { landmark: "DLF Cyber City", day: "Tuesday", date: "Feb 25", time: "9 AM - 7 PM" },
          { landmark: "Magnolias Apartments", day: "Saturday", date: "Mar 1", time: "8 AM - 2 PM" },
        ],
      },
      {
        area: "South Delhi",
        dates: [
          { landmark: "Select Citywalk Mall", day: "Thursday", date: "Feb 27", time: "10 AM - 8 PM" },
          { landmark: "Select Citywalk Mall", day: "Friday", date: "Feb 28", time: "10 AM - 8 PM", full: true },
        ],
      },
      {
        area: "Noida",
        dates: [
          { landmark: "Jaypee Sports Complex", day: "Sunday", date: "Mar 2", time: "7 AM - 5 PM" },
        ],
      },
    ],
  },
  {
    id: "bay-area",
    groups: [
      {
        area: "South Bay",
        dates: [
          { landmark: "Crunch Fitness Santana Row", day: "Wednesday", date: "Feb 12", time: "8 AM - 8 PM" },
          { landmark: "Crunch Fitness Santana Row", day: "Thursday", date: "Feb 13", time: "8 AM - 8 PM" },
          { landmark: "Crunch Fitness Santana Row", day: "Friday", date: "Feb 14", time: "8 AM - 8 PM", full: true },
          { landmark: "Santa Clara Convention Center", day: "Saturday", date: "Feb 15", time: "9 AM - 6 PM" },
          { landmark: "Santa Clara Convention Center", day: "Sunday", date: "Feb 16", time: "9 AM - 6 PM" },
        ],
      },
      {
        area: "East Bay",
        dates: [
          { landmark: "UC Berkeley RSF", day: "Monday", date: "Feb 17", time: "8 AM - 8 PM" },
          { landmark: "UC Berkeley RSF", day: "Tuesday", date: "Feb 18", time: "8 AM - 8 PM" },
          { landmark: "Oakland Arena", day: "Saturday", date: "Feb 22", time: "10 AM - 6 PM" },
        ],
      },
      {
        area: "Peninsula",
        dates: [
          { landmark: "Stanford Shopping Center", day: "Monday", date: "Feb 24", time: "8 AM - 8 PM" },
          { landmark: "Stanford Shopping Center", day: "Tuesday", date: "Feb 25", time: "8 AM - 8 PM", full: true },
          { landmark: "Google Campus", day: "Saturday", date: "Mar 1", time: "9 AM - 5 PM" },
        ],
      },
      {
        area: "San Francisco",
        dates: [
          { landmark: "Chase Center", day: "Saturday", date: "Mar 8", time: "10 AM - 6 PM" },
          { landmark: "Chase Center", day: "Sunday", date: "Mar 9", time: "10 AM - 6 PM" },
        ],
      },
    ],
  },
];

export default function SchedulePage() {
  const [selectedCity, setSelectedCity] = useState("all");

  const visibleCities =
    selectedCity === "all"
      ? SCHEDULE_DATA
      : SCHEDULE_DATA.filter((c) => c.id === selectedCity);

  return (
    <>
      <PageHero
        title="Book a scan"
        subtitle="For large groups, contact us at support@bodyinsight.in"
      >
        <div className={styles.citySelector}>
          <label htmlFor="city-select">City</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="all">All cities</option>
            <option value="bangalore">Bangalore</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi NCR</option>
            <option value="bay-area">Bay Area</option>
          </select>
        </div>
      </PageHero>

      <section className={styles.scheduleSection}>
        {visibleCities.map((city) =>
          city.groups.map((group) => (
            <div key={`${city.id}-${group.area}`} className={styles.areaGroup}>
              <h2 className={styles.areaHeader}>{group.area}</h2>
              <div className={styles.datesList}>
                {group.dates.map((entry, idx) => {
                  const params = new URLSearchParams({
                    landmark: entry.landmark,
                    day: entry.day,
                    date: entry.date,
                    time: entry.time,
                  });
                  return (
                    <div key={idx} className={styles.dateRow}>
                      <div className={styles.dateInfo}>
                        <div className={styles.dateLandmark}>
                          {entry.landmark}
                        </div>
                        <div className={styles.dateDay}>{entry.day}</div>
                        <div className={styles.dateDate}>{entry.date}</div>
                        <div className={styles.dateTime}>{entry.time}</div>
                      </div>
                      {entry.full ? (
                        <span className={styles.bookBtnFull}>Full</span>
                      ) : (
                        <Link
                          href={`/select-time?${params.toString()}`}
                          className={styles.bookBtn}
                        >
                          Book
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}
