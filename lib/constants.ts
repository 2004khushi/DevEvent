import { StaticImageData } from "next/image";

export type EventItem = {
  title: string,
  image: string,
  location: string,
  date: string,
  time: string,
  slug: string,
}

export const events:EventItem[] = [
  {
    title: "DevCon 2024",
    image: "/images/event1.png",
    location: "San Francisco, CA",
    date: "June 15-17, 2024",
    time: "9:00 AM - 6:00 PM",
    slug: "devcon-2024"
  },
  {
    title: "React Summit",
    image: "/images/event2.png",
    location: "Amsterdam, Netherlands",
    date: "May 23-24, 2024",
    time: "10:00 AM - 5:00 PM",
    slug: "react-summit-2024"
  },
  {
    title: "AI & Machine Learning Expo",
    image: "/images/event3.png",
    location: "London, UK",
    date: "July 8-10, 2024",
    time: "9:30 AM - 4:30 PM",
    slug: "ai-ml-expo-2024"
  },
  {
    title: "Global Hackathon 2024",
    image: "/images/event4.png",
    location: "Online (Virtual Event)",
    date: "August 5-7, 2024",
    time: "24 hours",
    slug: "global-hackathon-2024"
  },
  {
    title: "Web3 Conference",
    image: "/images/event5.png",
    location: "Berlin, Germany",
    date: "September 12-14, 2024",
    time: "10:00 AM - 6:00 PM",
    slug: "web3-conference-2024"
  },
  {
    title: "Developer Week",
    image: "/images/event6.png",
    location: "Tokyo, Japan",
    date: "October 20-23, 2024",
    time: "9:00 AM - 5:00 PM",
    slug: "developer-week-2024"
  }
];