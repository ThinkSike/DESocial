import type { Post } from "@/types/post";

export type BrowseCommunity = {
  id: string;
  name: string;
  description: string;
  members: string;
  icon: string;
  accent: string;
  isTrending?: boolean;
};

export const browseCommunities: BrowseCommunity[] = [
  {
    id: "firodiya-club",
    name: "Firodiya",
    description: "Culture, leadership, and student-led campus events.",
    members: "1.4K members",
    icon: "sparkles",
    accent: "#6B2B20",
    isTrending: true,
  },
  {
    id: "art-club",
    name: "Art Club",
    description: "Posters, sketches, murals, and creative workshops.",
    members: "980 members",
    icon: "color-palette",
    accent: "#9C27B0",
    isTrending: true,
  },
  {
    id: "ieee-members-club",
    name: "IEEE Members Club",
    description: "Tech talks, standards, projects, and student chapters.",
    members: "1.1K members",
    icon: "hardware-chip",
    accent: "#E38B2C",
    isTrending: true,
  },
  {
    id: "coding-club",
    name: "Coding Club",
    description: "Build projects, solve problems, and learn together.",
    members: "1.2K members",
    icon: "code-slash",
    accent: "#4CAF50",
    isTrending: true,
  },
  {
    id: "robotics-club",
    name: "Robotics Club",
    description: "Explore embedded systems, automation, and competition bots.",
    members: "840 members",
    icon: "hardware-chip",
    accent: "#FF5722",
    isTrending: true,
  },
  {
    id: "music-club",
    name: "Music Club",
    description: "Jam sessions, open mics, and campus performances.",
    members: "1.1K members",
    icon: "musical-notes",
    accent: "#4CAF50",
    isTrending: true,
  },
  {
    id: "acting-club",
    name: "Acting Club",
    description: "Stage plays, improv workshops, and performance coaching.",
    members: "560 members",
    icon: "person",
    accent: "#FF9800",
  },
  {
    id: "film-making-club",
    name: "Film Making Club",
    description: "Script, shoot, edit, and premiere student films.",
    members: "720 members",
    icon: "film",
    accent: "#2196F3",
  },
  {
    id: "rocketry-club",
    name: "Rocketry Club",
    description: "Design rockets, study propulsion, and launch experiments.",
    members: "430 members",
    icon: "rocket",
    accent: "#FF5722",
  },
];

const sampleUser = {
  id: "user-browse-1",
  username: "campus.lead",
  displayName: "Campus Lead",
  avatar: "https://i.pravatar.cc/150?img=12",
  verified: true,
};

const buildPost = (
  id: string,
  communityName: string,
  text: string,
  likes: number,
  comments: number,
  hoursAgo: number,
): Post => ({
  id,
  user: sampleUser,
  content: {
    text,
    hashtags: [communityName.toLowerCase().replace(/\s+/g, "")],
  },
  engagement: { likes, comments },
  community: {
    id: id,
    name: communityName,
    icon: "ellipse",
  },
  timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
  createdAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
  updatedAt: new Date(),
});

export const browseCommunityPosts: Record<string, Post[]> = {
  "firodiya-club": [
    buildPost("f-1", "Firodiya", "Firodiya night practice is set for Friday. Bring your scripts and stage props.", 48, 9, 3),
    buildPost("f-2", "Firodiya", "Photos from the leadership workshop are up. Great turnout today.", 32, 5, 8),
  ],
  "art-club": [
    buildPost("a-1", "Art Club", "New mural concept board is open for comments. Share your color palettes.", 41, 7, 2),
    buildPost("a-2", "Art Club", "Watercolor jam this weekend in Studio 2. Beginners welcome.", 26, 4, 6),
  ],
  "ieee-members-club": [
    buildPost("i-1", "IEEE Members Club", "This week's IEEE talk covers edge AI and low-power systems.", 55, 11, 4),
    buildPost("i-2", "IEEE Members Club", "Project demo review open now. Bring your hardware notes.", 38, 6, 10),
  ],
  "coding-club": [
    buildPost("c-1", "Coding Club", "Hack night starts at 6 PM. Pair up and ship something useful.", 64, 14, 1),
    buildPost("c-2", "Coding Club", "Posted a clean React state management checklist for beginners.", 47, 8, 5),
  ],
  "robotics-club": [
    buildPost("r-1", "Robotics Club", "Autonomous bot tuning session tonight. PID values are looking solid.", 51, 10, 2),
    buildPost("r-2", "Robotics Club", "Competition chassis prototype passed the vibration test.", 36, 5, 7),
  ],
  "music-club": [
    buildPost("m-1", "Music Club", "Open mic slots are live for next Thursday. Drop your set list below.", 59, 12, 3),
    buildPost("m-2", "Music Club", "Band rehearsal video uploaded from today's session.", 28, 6, 9),
  ],
  "acting-club": [
    buildPost("ac-1", "Acting Club", "Casting call for the winter play is open. Audition sheets are on the board.", 34, 4, 4),
  ],
  "film-making-club": [
    buildPost("fm-1", "Film Making Club", "Storyboarding for the short film festival begins tomorrow.", 29, 5, 6),
  ],
  "rocketry-club": [
    buildPost("ro-1", "Rocketry Club", "Static fire test completed successfully. Recovery systems look good.", 62, 13, 1),
    buildPost("ro-2", "Rocketry Club", "Payload bay mockup is ready for review.", 31, 3, 8),
  ],
};
