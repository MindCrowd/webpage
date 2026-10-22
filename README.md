# MINDCROWD project website

A responsive website for **MINDCROWD**, the behavior-aware NPC and crowd simulation project for Unity, deployed with **GitHub Pages**. All site files are in `dist/`; there are no dependencies, installation steps, or build steps.

**Live website:** https://mindcrowd.github.io/webpage/

**Source repository:** https://github.com/MindCrowd/webpage

The website repository is public and GitHub Pages is configured to deploy through GitHub Actions. Pushing site changes to `main` republishes the page automatically.

## Edit the website

Open **`dist/site.config.js`**. This is the main place to update:

- Project name and short name. **MINDCROWD** is configured as the final project name (`isPlaceholder: false`).
- Project-name pronunciation: set `project.pronunciation` to the written pronunciation. Optionally set `spokenName` and `pronunciationLanguage` for browser speech, or add a recording and set `pronunciationAudio` (for example, `assets/project-name.mp3`). The listening button appears only for a final project name with configured pronunciation and supported audio. Team member names have no pronunciation controls.
- Team ID, optional website URL override, contact email, and last updated date. The live URL is detected automatically on GitHub Pages.
- Main/plugin repository URL. The known `MindCrowd/CrowdSandbox-Unity` repository is already linked separately.
- Team names, student IDs, roles, emails, optional GitHub profiles, individual logbook links, and optional photographs.
- Academic advisors, CS491 deliverable links, meeting minutes, and demo links.

Leave an unknown URL as `""`. The page will show an unavailable status instead of a broken button. No changes made in a browser are saved; edit and commit the source file to update the published site.

Edit `dist/index.html` for the main project description and sections, and `dist/styles.css` for colors and layout.

### Add another document or meeting

1. Copy the file into `dist/documents/`, using a simple name with no spaces.
2. Add an entry to the `documents` array in `dist/site.config.js`:

```js
{
  title: "Meeting minutes 02",
  category: "Meeting minutes", // "CS491 deliverables" or "Meeting minutes"
  description: "A short summary of the meeting.",
  date: "2026-10-23", // Example date; replace with the actual date
  format: "PDF",
  url: "documents/meeting-minutes-02.pdf",
  status: "Available"
},
```

For future documents, leave `url` empty and use `status: "To be added"`. The five CS491 placeholders follow the [course deliverables guidelines](https://www.cs.bilkent.edu.tr/~cs4912/current/CS491_deliverables.html): Logbook, Project Information Form, Project Specification Document, Analysis and Requirements Report, and Presentation and Demo. Meeting minutes are kept in a separate category. The linked guidelines page is labeled Fall 2024; no current-term deadlines are inferred from it. External document and video URLs work too.

Each team member has an optional `logbook` URL in `team`. Set it to show a Logbook link on their team card; Google Docs access permissions remain controlled in Google Docs. Leave links empty until they are ready. The archive Logbook entry can link to a shared index of the individual journals when available.

## Preview locally

With Node.js installed, run these commands from this website folder:

```sh
npm start
```

Open **http://127.0.0.1:4173/project-preview/**. The prefix tests the same relative asset behavior as a GitHub project site. Stop the server with Ctrl+C.

Check local files, PDF signatures, script syntax, and anchors:

```sh
npm run check
```

You can also open `dist/index.html` directly in a browser. A local HTTP server is preferable for matching hosted behavior.

## Deploy on GitHub Pages

The website repository is **[MindCrowd/webpage](https://github.com/MindCrowd/webpage)**. The site is independent of the plugin and sandbox repositories. Keep `dist/`, `scripts/`, and `.github/` at this repository's root; local `qa/` files are ignored.

1. Commit and push the website to the repository's `main` or `master` branch.
2. Open **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**.
3. Open **Actions → Deploy project website to GitHub Pages → Run workflow**. Subsequent changes under `dist/` deploy automatically when pushed to `main` or `master`.
4. After the workflow succeeds, find the published URL in the deployment or **Settings → Pages**. The page displays its own URL automatically on a `github.io` hostname; leave `project.websiteUrl` empty unless you need an override.

The workflow validates the site and uploads only `dist/`. GitHub Pages must be available for your repository and account plan, Actions must be enabled, and the branch must be permitted by the `github-pages` environment. For other branch names, update the `branches` list in `.github/workflows/pages.yml`.

The expected project-site URL is **https://mindcrowd.github.io/webpage/**. A successful Pages deployment is required before the URL serves the website.

Official references: [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) and [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

### Organization and repository links

The organization is now **MindCrowd**. This checkout uses `https://github.com/MindCrowd/webpage.git`, and the live site is `https://mindcrowd.github.io/webpage/`. If the organization is renamed again:

1. Rename the organization on GitHub.
2. Open the repository under its new organization and rerun the Pages deployment. Check **Settings → Pages** for the new published address, normally `https://NEW-ORGANIZATION.github.io/webpage/`.
3. Update the local remote using `git remote set-url origin https://github.com/NEW-ORGANIZATION/webpage.git`.
4. Update `github.organization` in `dist/site.config.js` for local previews. On a hosted `github.io` site, the current organization is detected automatically, so the website-source and sandbox links follow the new owner without further page edits. This assumes the sandbox remains in the same organization; use its `url` override if it moves elsewhere.

All site files and PDFs use relative paths. Leave `project.websiteUrl` empty for automatic detection. If you use a custom domain, set the organization and optional website URL explicitly. Share the newly confirmed Pages URL after renaming. See [GitHub's organization renaming documentation](https://docs.github.com/en/organizations/managing-organization-settings/renaming-an-organization).

## Included material and content boundaries

- The supplied unofficial project description is used as background information for the page and is not published as a report.
- The supplied 9 October 2026 meeting minutes are copied unchanged to `dist/documents/meeting-minutes-01-2026-10-09.pdf`.
- The supplied Project Information Form dated 20 October 2026 is available unchanged as `dist/documents/project-information-form-2026-10-20.docx`.
- Team names and academic guidance come from the supplied meeting minutes. **MINDCROWD** is the project name selected by the team. The overview reflects the team's selected feature list: simulation environments, resource points and pathfinding, emotions, perception, debug tools, and group behavior. Individual technical roles, team ID, and unknown URLs have not been invented.
- The original meeting minutes PDF remains unchanged. The website uses an editable name independently.
- The website covers both individual NPC behavior and crowd simulation. The described features and evaluation are presented as planned work. The interactive hero previews cover resource visits and queues, alarm evacuation, and medieval squad formations. They are website concept models, independent of the Unity implementation; their counters describe only the preview state.
- The meeting template's submission/email instructions are source-document content, not actions performed by the website.

## Structure

```text
.github/workflows/pages.yml   GitHub Pages deployment
dist/
  index.html                 Main page and project description
  styles.css                 Responsive design
  app.js                     Archive, project identity, and team rendering
  simulation-model.js        Independent website scenario logic
  simulation.js              Isometric scenario rendering and controls
  site.config.js             Editable project data and links
  assets/favicon.svg         Local icon (add photos here)
  documents/                 Included and future project files
scripts/serve.mjs             Local static preview
scripts/validate.mjs          Local file and link validation
scripts/check-simulation.mjs  Scenario behavior checks
```
