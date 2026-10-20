// EDIT THIS FILE to update the website. No build step is needed.
// Use an empty string "" for a link or detail that is not ready yet.
window.PROJECT_CONFIG = {
  project: {
    name: "MINDCROWD",
    shortName: "MINDCROWD",
    isPlaceholder: false,
    pronunciation: "MIND crowd", // Written pronunciation of the PROJECT name only
    spokenName: "Mind Crowd", // Optional spelling for browser speech of the project name
    pronunciationLanguage: "en-US", // Change if your project name uses another language
    pronunciationAudio: "", // Optional recording, e.g. "assets/project-name.mp3"
    fullTitle: "Behavior-Aware NPC and Crowd Simulation Plugin for Unity",
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
    organization: "MindCrowd", // Local preview fallback; hosted GitHub Pages detects the current owner
    websiteRepository: "webpage"
  },
  repositories: [
    {
      name: "MINDCROWD plugin",
      tag: "MAIN REPOSITORY",
      description: "The reusable Unity package: individual NPC behavior, crowd simulation, navigation, resource management, and developer tools.",
      url: "", // Add your main/plugin GitHub repository URL here
      label: "View on GitHub"
    },
    {
      name: "CrowdSandbox-Unity",
      tag: "SIMULATION ENVIRONMENT",
      description: "Our shared Unity testing ground for NPC behavior, repeatable crowd scenarios, navigation experiments, and environment models.",
      repository: "CrowdSandbox-Unity", // Uses the current GitHub Pages organization automatically
      url: "", // Optional full URL override, e.g. if this repository has a different owner
      label: "View on GitHub"
    }
  ],
  team: [
    // Optional logbook URLs retain the access permissions set in Google Docs.
    { name: "Ata Eren Kılıç", studentId: "22202801", email: "erenkilic@ug.bilkent.edu.tr", role: "Project team", github: "", logbook: "", photo: "" },
    { name: "Başar Çubukçuoğlu", studentId: "22203359", email: "basar.cubukcuoglu@ug.bilkent.edu.tr", role: "Project team", github: "", logbook: "", photo: "" },
    { name: "Emir Atlas", studentId: "22203455", email: "emir.atlas@ug.bilkent.edu.tr", role: "Project team", github: "", logbook: "", photo: "" },
    { name: "Muhammed Emir Eren", studentId: "22202664", email: "emir.eren@ug.bilkent.edu.tr", role: "Project team", github: "", logbook: "", photo: "" },
    { name: "Yunus Emre Erkan", studentId: "22203670", email: "emre.erkan@ug.bilkent.edu.tr", role: "Project team", github: "", logbook: "", photo: "" }
  ],
  advisors: [
    { name: "Prof. Uğur Güdükbay", role: "Project supervisor", url: "" },
    { name: "Mert Bıçakçı", role: "Course instructor", url: "" },
    { name: "Hüseyin Açacak", role: "Course instructor", url: "" }
  ],
  documents: [
    // CS491 deliverables: https://www.cs.bilkent.edu.tr/~cs4912/current/CS491_deliverables.html
    { title: "Logbook", category: "CS491 deliverables", description: "Personal CS491/492 progress journals for each team member.", date: "", format: "Online journals", url: "", status: "To be added" },
    { title: "Project Information Form", category: "CS491 deliverables", description: "Project identity, summary, academic guidance, and website address.", date: "", format: "Document", url: "", status: "To be added" },
    { title: "Project Specification Document", category: "CS491 deliverables", description: "Project scope, requirements, constraints, standards, and professional responsibilities.", date: "", format: "PDF", url: "", status: "To be added" },
    { title: "Analysis and Requirements Report", category: "CS491 deliverables", description: "System analysis and requirements, project plan, risks, teamwork, and learning strategy.", date: "", format: "PDF", url: "", status: "To be added" },
    { title: "Presentation and Demo", category: "CS491 deliverables", description: "First-semester progress presentation and demonstration of the project.", date: "", format: "Slides / demo", url: "", status: "To be added" },
    {
      title: "Meeting minutes 01",
      category: "Meeting minutes",
      description: "Initial project discussion, supervisor, scope, and potential use cases.",
      date: "2026-10-09",
      format: "PDF · 3 pages",
      url: "documents/meeting-minutes-01-2026-10-09.pdf",
      status: "Available"
    }
    // Add another meeting by copying the Meeting minutes 01 object above.
  ],
  demo: {
    url: "", // Optional video, hosted demo, or release URL
    label: "Watch the project demo"
  }
};
