// EDIT THIS FILE to update the website. No build step is needed.
// Use an empty string "" for a link or detail that is not ready yet.
window.PROJECT_CONFIG = {
  project: {
    name: "Project Name",
    shortName: "Project Name",
    isPlaceholder: true,
    pronunciation: "", // Written pronunciation of the PROJECT name only
    spokenName: "", // Optional spelling for browser speech of the project name
    pronunciationLanguage: "en-US", // Change if your project name uses another language
    pronunciationAudio: "", // Optional recording, e.g. "assets/project-name.mp3"
    fullTitle: "Behavior-Aware Crowd Simulation and Management Plugin for Unity",
    university: "Bilkent University",
    department: "Computer Engineering",
    course: "CS491/492 · Senior Design Project",
    teamId: "", // e.g. "T26xx"
    year: "2026",
    websiteUrl: "", // Detected automatically on GitHub Pages; optional custom URL override
    contactEmail: "", // Optional team contact address
    lastUpdated: "2026-10-20"
  },
  github: {
    organization: "bilkentsenior", // Local preview fallback; hosted GitHub Pages detects the current owner
    websiteRepository: "webpage"
  },
  repositories: [
    {
      name: "Crowd simulation plugin",
      tag: "MAIN REPOSITORY",
      description: "The reusable Unity package: agent behavior, navigation, resource management, and developer tools.",
      url: "", // Add your main/plugin GitHub repository URL here
      label: "View on GitHub"
    },
    {
      name: "CrowdSandbox-Unity",
      tag: "SIMULATION ENVIRONMENT",
      description: "Our shared Unity testing ground for repeatable crowd scenarios, navigation experiments, and environment models.",
      repository: "CrowdSandbox-Unity", // Uses the current GitHub Pages organization automatically
      url: "", // Optional full URL override, e.g. if this repository has a different owner
      label: "View on GitHub"
    }
  ],
  team: [
    { name: "Ata Eren Kılıç", studentId: "22202801", email: "erenkilic@ug.bilkent.edu.tr", role: "Project team", github: "", photo: "" },
    { name: "Başar Çubukçuoğlu", studentId: "22203359", email: "basar.cubukcuoglu@ug.bilkent.edu.tr", role: "Project team", github: "", photo: "" },
    { name: "Emir Atlas", studentId: "22203455", email: "emir.atlas@ug.bilkent.edu.tr", role: "Project team", github: "", photo: "" },
    { name: "Muhammed Emir Eren", studentId: "22202664", email: "emir.eren@ug.bilkent.edu.tr", role: "Project team", github: "", photo: "" },
    { name: "Yunus Emre Erkan", studentId: "22203670", email: "emre.erkan@ug.bilkent.edu.tr", role: "Project team", github: "", photo: "" }
  ],
  advisors: [
    { name: "Prof. Uğur Güdükbay", role: "Project supervisor", url: "" },
    { name: "Mert Bıçakçı", role: "Course instructor", url: "" },
    { name: "Hüseyin Açacak", role: "Course instructor", url: "" }
  ],
  documents: [
    {
      title: "Meeting minutes 01",
      category: "Meeting minutes",
      description: "Initial project discussion, supervisor, scope, and potential use cases.",
      date: "2026-10-09",
      format: "PDF · 3 pages",
      url: "documents/meeting-minutes-01-2026-10-09.pdf",
      status: "Available"
    },
    { title: "Requirements analysis report", category: "Reports", description: "Requirements, use cases, and acceptance criteria.", date: "", format: "PDF", url: "", status: "To be added" },
    { title: "Design report", category: "Reports", description: "System architecture, module interfaces, and implementation design.", date: "", format: "PDF", url: "", status: "To be added" },
    { title: "Final report", category: "Reports", description: "Implementation, evaluation results, and conclusions.", date: "", format: "PDF", url: "", status: "To be added" },
    { title: "Project presentation", category: "Media", description: "Presentation slides and project walkthrough.", date: "", format: "Slides", url: "", status: "To be added" },
    { title: "Demo video", category: "Media", description: "A demonstration of the plugin and comparison scenarios.", date: "", format: "Video", url: "", status: "To be added" }
    // Add another meeting by copying the Meeting minutes 01 object above.
  ],
  demo: {
    url: "", // Optional video, hosted demo, or release URL
    label: "Watch the project demo"
  }
};
