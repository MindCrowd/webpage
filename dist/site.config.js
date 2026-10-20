// EDIT THIS FILE to update the website. No build step is needed.
// Use an empty string "" for a link or detail that is not ready yet.
window.PROJECT_CONFIG = {
  project: {
    name: "Project Name",
    shortName: "Project Name",
    isPlaceholder: true,
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
    { name: "Ata Eren Kılıç", email: "erenkilic@ug.bilkent.edu.tr", role: "Project team", github: "", photo: "" },
    { name: "Başar Çubukçuoğlu", email: "basar.cubukcuoglu@ug.bilkent.edu.tr", role: "Project team", github: "", photo: "" },
    { name: "Emir Atlas", email: "emir.atlas@ug.bilkent.edu.tr", role: "Project team", github: "", photo: "" },
    { name: "Muhammed Emir Eren", email: "emir.eren@ug.bilkent.edu.tr", role: "Project team", github: "", photo: "" },
    { name: "Yunus Emre Erkan", email: "emre.erkan@ug.bilkent.edu.tr", role: "Project team", github: "", photo: "" }
  ],
  advisors: [
    { name: "Prof. Uğur Güdükbay", role: "Project supervisor", url: "" },
    { name: "Mert Bıçakçı", role: "Course instructor", url: "" },
    { name: "Hüseyin Açacak", role: "Course instructor", url: "" }
  ],
  documents: [
    {
      title: "Project proposal",
      category: "Reports",
      description: "Project idea, scope, planned functionality, and evaluation approach.",
      date: "", // The supplied proposal has no date
      format: "PDF · 2 pages",
      url: "documents/project-proposal.pdf",
      status: "Available"
    },
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
