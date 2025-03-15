export const SITE = {
  website: "https://blog.tcea.top/",
  author: "白鼠Cysnies",
  profile: "https://tcea.top/",
  desc: "白鼠的小站",
  title: "白鼠的小站",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    url: "https://github.com/cysnies/blog-astro/edit/main/src/content/blog",
    text: "Suggest Changes",
    appendFilePath: true,
  },
  dynamicOgImage: true,
} as const;
