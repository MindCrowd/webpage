(() => {
  "use strict";
  const config = window.PROJECT_CONFIG;
  if (!config) return;
  // GitHub project sites change host when the organization is renamed.
  // Keep local PDFs/assets relative; resolve sibling repositories from that host.
  const pagesOrganization = window.location.hostname.match(/^([a-z\d-]+)\.github\.io$/i)?.[1];
  const githubOrganization = pagesOrganization || config.github?.organization || "";
  const repositoryUrl = (repository) => repository.url || (repository.repository && githubOrganization ? `https://github.com/${githubOrganization}/${repository.repository}` : "");
  const websiteUrl = config.project.websiteUrl || (pagesOrganization ? new URL(".", window.location.href).href : "");
  const $ = (selector) => document.querySelector(selector);
  const create = (tag, className, content) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  };
  const icon = (name) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#i-${name}`);
    svg.append(use);
    return svg;
  };
  // Local assets stay relative so the site also works at /repository-name/.
  const safeUrl = (value, allowMail = false) => {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const resolved = new URL(value, window.location.href);
      if (["https:", "http:", "file:"].includes(resolved.protocol) || (allowMail && resolved.protocol === "mailto:")) return value;
    } catch (_) { /* Leave malformed links unavailable. */ }
    return "";
  };
  const link = (url, label, className = "text-link") => {
    const anchor = create("a", className, label);
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.append(icon("external"));
    return anchor;
  };
  const dateLabel = (value) => {
    if (!value) return "";
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
  };

  document.querySelectorAll("[data-config]").forEach((element) => {
    const value = config.project[element.dataset.config];
    if (value) element.textContent = value;
  });
  document.title = `${config.project.name} — NPC and Crowd Simulation for Unity`;
  $("#name-status").textContent = config.project.isPlaceholder ? "Final project name to be added." : config.project.fullTitle;
  $("#team-id").textContent = config.project.teamId || "To be assigned";
  if (config.project.lastUpdated) $("#updated-date").textContent = `Last updated ${dateLabel(config.project.lastUpdated)}`;
  if (safeUrl(websiteUrl)) {
    $("#website-link").textContent = websiteUrl;
    $("#website-link").href = websiteUrl;
    $("#website-link").hidden = false;
    $("#website-pending").hidden = true;
  }
  if (githubOrganization && config.github?.websiteRepository) {
    const source = $("#website-source");
    source.href = `https://github.com/${githubOrganization}/${config.github.websiteRepository}`;
    source.hidden = false;
  }
  if (config.project.contactEmail) {
    const contact = $("#contact-link");
    contact.href = `mailto:${config.project.contactEmail}`;
    contact.hidden = false;
  }

  // Pronunciation belongs to the project identity, never to team members.
  const pronunciationText = $("#project-pronunciation-text");
  const pronunciationButton = $("#project-pronunciation-button");
  const pronunciationStatus = $("#project-pronunciation-status");
  const projectAudioUrl = safeUrl(config.project.pronunciationAudio);
  const projectNameIsFinal = !config.project.isPlaceholder && Boolean(config.project.name?.trim());
  if (projectNameIsFinal && config.project.pronunciation) pronunciationText.textContent = config.project.pronunciation;
  else if (projectNameIsFinal && config.project.spokenName) pronunciationText.textContent = config.project.spokenName;
  else if (projectNameIsFinal && projectAudioUrl) pronunciationText.textContent = "Listen to the project name below.";
  else if (projectNameIsFinal) pronunciationText.textContent = "Project name pronunciation to be added.";
  const hasProjectPronunciation = config.project.pronunciation || config.project.spokenName || projectAudioUrl;
  if (projectNameIsFinal && hasProjectPronunciation && (projectAudioUrl || "speechSynthesis" in window)) {
    pronunciationButton.hidden = false;
    pronunciationButton.setAttribute("aria-label", `Hear pronunciation of ${config.project.name}`);
    let projectAudio;
    const pronunciationFailed = () => {
      pronunciationStatus.classList.remove("sr-only");
      pronunciationStatus.textContent = "Audio is unavailable. Please use the written pronunciation above.";
    };
    pronunciationButton.addEventListener("click", async () => {
      pronunciationStatus.classList.add("sr-only");
      pronunciationStatus.textContent = `Playing the pronunciation of ${config.project.name}.`;
      try {
        if (projectAudioUrl) {
          if (!projectAudio) {
            projectAudio = new Audio(projectAudioUrl);
            projectAudio.addEventListener("error", pronunciationFailed);
          }
          projectAudio.currentTime = 0;
          await projectAudio.play();
        } else {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(config.project.spokenName || config.project.name);
          utterance.lang = config.project.pronunciationLanguage || "en-US";
          utterance.rate = 0.85;
          utterance.onerror = (event) => {
            if (!["canceled", "interrupted"].includes(event.error)) pronunciationFailed();
          };
          window.speechSynthesis.speak(utterance);
        }
      } catch (_) { pronunciationFailed(); }
    });
  }

  config.team.forEach((member, index) => {
    const article = create("article", "team-member");
    const portrait = create("div", "member-portrait");
    const names = member.name.trim().split(/\s+/);
    const initials = names[0][0] + (names.length > 1 ? names[names.length - 1][0] : "");
    portrait.append(create("span", "member-initials", initials), create("span", "member-index", `TEAM / ${String(index + 1).padStart(2, "0")}`));
    portrait.setAttribute("aria-hidden", "true");
    if (safeUrl(member.photo)) {
      const photo = create("img", "member-photo");
      photo.src = member.photo;
      photo.alt = "";
      photo.loading = "lazy";
      photo.addEventListener("error", () => photo.remove(), { once: true });
      portrait.append(photo);
    }
    article.append(portrait, create("h3", "", member.name), create("p", "member-role", member.role || "Project team"));
    if (member.studentId) article.append(create("p", "member-student-id", `Student ID: ${member.studentId}`));
    if (member.email) {
      const email = create("a", "member-email", "Email ↗");
      email.href = `mailto:${member.email}`;
      email.setAttribute("aria-label", `Email ${member.name}`);
      article.append(email);
    }
    if (safeUrl(member.github)) {
      const github = link(member.github, "GitHub", "member-github");
      github.setAttribute("aria-label", `${member.name} on GitHub (opens in a new tab)`);
      article.append(github);
    }
    if (safeUrl(member.logbook)) {
      const logbook = link(member.logbook, "Logbook", "member-logbook");
      logbook.setAttribute("aria-label", `${member.name}'s project logbook (opens in a new tab)`);
      article.append(logbook);
    }
    $("#team-grid").append(article);
  });
  config.advisors.forEach((advisor) => {
    const item = create("div", "advisor");
    item.append(safeUrl(advisor.url) ? link(advisor.url, advisor.name, "advisor-name") : create("p", "advisor-name", advisor.name), create("p", "advisor-role", advisor.role));
    $("#advisor-list").append(item);
  });

  let activeFilter = "All";
  const renderDocuments = () => {
    const search = $("#document-search").value.trim().toLocaleLowerCase();
    const documents = config.documents.filter((doc) => (activeFilter === "All" || doc.category === activeFilter) && `${doc.title} ${doc.category} ${doc.description} ${doc.date} ${doc.status}`.toLocaleLowerCase().includes(search));
    const fragment = document.createDocumentFragment();
    documents.forEach((doc) => {
      const url = safeUrl(doc.url);
      const row = create("article", `document-row${url ? "" : " pending"}`);
      const fileIcon = create("div", "document-file-icon");
      fileIcon.append(icon("file"));
      const details = create("div", "document-details");
      const title = create(url ? "a" : "h3", "document-title", doc.title);
      if (url) {
        title.href = url;
        title.target = "_blank";
        title.rel = "noopener noreferrer";
        title.setAttribute("aria-label", `${doc.title} (opens in a new tab)`);
      }
      const meta = create("div", "document-meta");
      meta.append(create("span", "category", doc.category), create("span", "", "/"), create("span", "", doc.format));
      if (doc.date) {
        const time = create("time", "", dateLabel(doc.date));
        time.dateTime = doc.date;
        meta.append(create("span", "", "/"), time);
      }
      details.append(title, create("p", "document-description", doc.description), meta);
      const date = create("div", "document-date", dateLabel(doc.date) || "Undated");
      if (!url) date.textContent = "Upcoming";
      const action = create("div", "document-action");
      if (url) {
        const open = link(url, doc.format.startsWith("PDF") ? "Open PDF" : "Open resource");
        open.setAttribute("aria-label", `Open ${doc.title} (opens in a new tab)`);
        action.append(open);
      } else action.append(create("span", "pending-badge", doc.status || "To be added"));
      row.append(fileIcon, details, date, action);
      fragment.append(row);
    });
    $("#document-list").replaceChildren(fragment);
    $("#empty-documents").hidden = documents.length > 0;
    $("#document-count").textContent = `${documents.length} document${documents.length === 1 ? "" : "s"} shown.`;
  };
  document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderDocuments();
  }));
  $("#document-search").addEventListener("input", renderDocuments);
  renderDocuments();

  config.repositories.forEach((repository) => {
    const article = create("article", "repo-card");
    const header = create("div", "repo-card-header");
    header.append(icon("github"), create("span", "", repository.tag));
    article.append(header, create("h3", "", repository.name), create("p", "", repository.description));
    if (safeUrl(repositoryUrl(repository))) article.append(link(repositoryUrl(repository), repository.label || "View on GitHub"));
    else article.append(create("span", "pending-badge", "Repository link to be added"));
    $("#repo-grid").append(article);
  });
  if (safeUrl(config.demo.url)) $("#demo-action").replaceChildren(link(config.demo.url, config.demo.label, "button"));

  const menu = $(".menu-toggle");
  const navigation = $("#navigation");
  const closeMenu = () => {
    menu.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
  };
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("open", open);
  });
  navigation.querySelectorAll("a").forEach((anchor) => anchor.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("open")) { closeMenu(); menu.focus(); }
  });

})();
