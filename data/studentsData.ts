// lib/studentsData.ts

export interface StudentData {
  name: string;
  nickname: string;
  profilePic: string;
  orbitImages: string[];
  audioUrl: string;
  spotifyTrackId: string;
  phoneDisplay: string;
  phoneLink: string;
  igHandle: string;
  igPosts: string[];
  xHandle: string;
  xTweetId: string;
  favFoodImg: string;
  quote: string;
  slang: string;
  slangImg: string;
  bestEraArray: string[]; // For the slot machine effect
  leastFavCourse: string;
  favLecturerName: string;
  favLecturerImg: string;
  dreamPath: string;
  dreamPathIcon: string;
  passionGif: string;
    finalquote: string;
}

export const students: Record<string, StudentData> = {
  "Alexis Osell": {
    name: "Alexis Osell",
    nickname: "The Architect",
    profilePic: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&q=80",
    orbitImages: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80"
    ],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    spotifyTrackId: "4cOdK2wGLETKBW3PvgPWqT",
    phoneDisplay: "0801 234 5678",
    phoneLink: "+2348012345678",
    igHandle: "alexis_builds",
    igPosts: ["https://www.instagram.com/p/DT7lBlnDeLw/embed"],
    xHandle: "alexisosell",
    xTweetId: "2096718115371454498",
    favFoodImg: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80",
    quote: "Building the future, one elegant line of code at a time. Aesthetics and logic combined.",
    slang: "WAGWAN",
    slangImg: "https://images.unsplash.com/photo-1527269534026-c86f4009eace?w=150&q=80",
    bestEraArray: ["100 Lvl", "200 Lvl", "300 Lvl", "400 Lvl"], 
    leastFavCourse: "EIE 311",
    favLecturerName: "Dr. Samuel Okafor",
    favLecturerImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80",
    dreamPath: "Senior Network Engineer",
    dreamPathIcon: "https://cdn-icons-png.flaticon.com/512/2888/2888998.png",
    passionGif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjN1ajkxYjk5MjlucG82YmtoMndvZ3VxZTMwM3h6bGJpNW1jcjRhbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/JpG2A9P3dPHXaTYrwu/giphy.gif",
    finalquote: "STAY GOLDEN."
},
    "Princewill Daniel": {
      name: "Princewill Daniel",
      nickname: "The Mafia Boss ",
      profilePic: "/prince_yearbook.png",
      orbitImages: [
        "/prince_1.jpg",
        "/prince_2.jpg",
        "/prince_3.jpg",
        "/prince_4.png",
        "/prince_group_1.png",
        "/prince_6.png",
      ],
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      spotifyTrackId: "6HidGH3rmgyk47386l4p37",
      phoneDisplay: "091 598 226 19",
      phoneLink: "+2349159822619",
      igHandle: "im_princedaniel",
      igPosts: ["https://www.instagram.com/p/DGCi76oNbPA/embed","https://www.instagram.com/p/DdMWx3agPHh/embed"],
      xHandle: "The_Ideal_guy",
      xTweetId: "1979535539914367292",
      favFoodImg: "/prince_fav_food.jpg",
      quote: "Push your self beyond the limits",
      slang: "LET'S GET THAT BREAD",
      slangImg: "/prince_fav_food.jpg",
      bestEraArray: ["1００ Lvl", "２００ Lvl", "３００ Lvl", "４００ Lvl"], 
      leastFavCourse: "EIE 323",
      favLecturerName: "Dr. Kennedy",
      favLecturerImg: "https://images.unsplash.com/photo-156025<PASSWORD>-<PASSWORD>?w=１５０&q=８０",
      dreamPath: "CEO/ Entrepreneur",
      dreamPathIcon: "/prince_job.jpg",
      passionGif: "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3M2RpN28xaHFsaTBscDk4ZXY4dHd6bjNjZmE1Y20ybHMxamVudm8yeiZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/fMA7Fauj1uWhrTqzTU/giphy.gif",
      finalquote: "6 7 "
    }
  // Add more students here following the exact same structure...
};