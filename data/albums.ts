// The Memories albums. Each album is backed by one Cloudinary folder: upload
// files into that folder and they appear in the album within a couple of
// minutes. Albums with no files yet are hidden from the site.
//
// To add an album, add an entry here (order = display order) and create the
// matching folder in Cloudinary.

export interface Album {
  /** URL segment: /memories/<slug> */
  slug: string;
  title: string;
  description: string;
  /** Cloudinary folder (exact name, case-sensitive). */
  folder: string;
  /** "stickers" shows transparent images uncropped on a checkerboard. */
  layout: "photos" | "stickers";
  /** Adds a Download button (original file) in the viewer and on each tile. */
  downloadable?: boolean;
}

export const albums: Album[] = [
  {
    slug: "stickers",
    title: "Stickers",
    description: "Class stickers. Open one to download it.",
    folder: "stickers",
    layout: "stickers",
    downloadable: true,
  },
  {
    slug: "thanksgiving",
    title: "Thanksgiving",
    description: "Photos and clips from the thanksgiving service.",
    folder: "thanksgiving",
    layout: "photos",
  },
  {
    slug: "excursion",
    title: "Excursion",
    description: "Photos and clips from the class excursion.",
    folder: "excursion",
    layout: "photos",
  },
  {
    slug: "portrait",
    title: "Portrait Day",
    description: "Photos and clips from portrait day.",
    folder: "portrait",
    layout: "photos",
  },
  {
    slug: "defense",
    title: "Defense",
    description: "Photos and clips from project defense.",
    folder: "defense",
    layout: "photos",
  },
  {
    slug: "sports",
    title: "Sports",
    description: "Photos and clips from sports events.",
    folder: "sports",
    layout: "photos",
  },
  {
    slug: "graduation",
    title: "Graduation",
    description: "Photos and clips from graduation.",
    folder: "graduation",
    layout: "photos",
  },
  {
    slug: "others",
    title: "Others",
    description: "Everything else from around the department.",
    // The original Memories folder.
    folder: "memories",
    layout: "photos",
  },
];

export const getAlbumBySlug = (slug: string) => albums.find((album) => album.slug === slug);
