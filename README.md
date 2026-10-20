# Crowd simulation project website

A responsive project website prepared for **GitHub Pages**. The editable placeholder **Project Name** is intentional. All site files are in `dist/`; there are no dependencies, installation steps, or build steps.

## Edit the website

Open **`dist/site.config.js`**. This is the main place to update:

- Project name and short name; set `isPlaceholder` to `false` when the name is final.
- Pronunciation text, optional spoken spelling, or a recording such as `assets/project-name.mp3`. The listening button appears once a final name and pronunciation are configured and browser audio is supported.
- Team ID, optional website URL override, contact email, and last updated date. The live URL is detected automatically on GitHub Pages.
- Main/plugin repository URL. The known `bilkentsenior/CrowdSandbox-Unity` repository is already linked separately.
- Team names, roles, emails, optional GitHub profiles, and optional photographs.
- Academic advisors, report links, meeting minutes, slides, and demo links.

Leave an unknown URL as `""`. The page will show an unavailable status instead of a broken button. No changes made in a browser are saved; edit and commit the source file to update the published site.

Edit `dist/index.html` for the main project description and sections, and `dist/styles.css` for colors and layout. The pronunciation placeholder is deliberately unspoken until the name is chosen.

### Add another document or meeting

1. Copy the file into `dist/documents/`, using a simple name with no spaces.
2. Add an entry to the `documents` array in `dist/site.config.js`:

```js
{
  title: "Meeting minutes 02",
  category: "Meeting minutes", // "Reports", "Meeting minutes", or "Media"
  description: "A short summary of the meeting.",
  date: "2026-10-23", // Example date; replace with the actual date
  format: "PDF",
  url: "documents/meeting-minutes-02.pdf",
  status: "Available"
},
```

For future documents, leave `url` empty and use `status: "To be added"`. The future report and media entries are editable suggestions, not a verified course deliverable list. Add anything else your course requires. External document and video URLs work too.

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

You can also open `dist/index.html` directly in a browser. A local HTTP server is preferable for previewing audio and matching hosted behavior.

## Deploy on GitHub Pages

The website repository is **[bilkentsenior/webpage](https://github.com/bilkentsenior/webpage)**. The site is independent of the plugin and sandbox repositories. Keep `dist/`, `scripts/`, and `.github/` at this repository's root; local `qa/` files are ignored.

1. Commit and push the website to the repository's `main` or `master` branch.
2. Open **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**.
3. Open **Actions → Deploy project website to GitHub Pages → Run workflow**. Subsequent changes under `dist/` deploy automatically when pushed to `main` or `master`.
4. After the workflow succeeds, find the published URL in the deployment or **Settings → Pages**. The page displays its own URL automatically on a `github.io` hostname; leave `project.websiteUrl` empty unless you need an override.

The workflow validates the site and uploads only `dist/`. GitHub Pages must be available for your repository and account plan, Actions must be enabled, and the branch must be permitted by the `github-pages` environment. For other branch names, update the `branches` list in `.github/workflows/pages.yml`.

The expected project-site URL is **https://bilkentsenior.github.io/webpage/**. A successful Pages deployment is required before the URL serves the website.

Official references: [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) and [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

### When the organization name changes

1. Rename the organization on GitHub when you are ready; no name change is needed now.
2. Open the repository under its new organization and rerun the Pages deployment. Check **Settings → Pages** for the new published address, normally `https://NEW-ORGANIZATION.github.io/webpage/`.
3. Update the local remote using `git remote set-url origin https://github.com/NEW-ORGANIZATION/webpage.git`.
4. Update `github.organization` in `dist/site.config.js` for local previews. On a hosted `github.io` site, the current organization is detected automatically, so the website-source and sandbox links follow the new owner without further page edits. This assumes the sandbox remains in the same organization; use its `url` override if it moves elsewhere.

All site files and PDFs use relative paths. Leave `project.websiteUrl` empty for automatic detection. If you use a custom domain, set the organization and optional website URL explicitly. Share the newly confirmed Pages URL after renaming. See [GitHub's organization renaming documentation](https://docs.github.com/en/organizations/managing-organization-settings/renaming-an-organization).

## Included material and content boundaries

- The supplied project proposal is copied unchanged to `dist/documents/project-proposal.pdf`.
- The supplied 9 October 2026 meeting minutes are copied unchanged to `dist/documents/meeting-minutes-01-2026-10-09.pdf`.
- Team names, academic guidance, and project scope come from those supplied documents. Individual technical roles, final project name, team ID, and unknown URLs have not been invented.
- Existing proposal/minutes titles remain unchanged inside their PDFs. The website uses an editable name independently.
- The proposal's features and evaluation are presented as planned work. The moving diagram is clearly labeled as an illustration, not a running Unity implementation or a measured result.
- The meeting template's submission/email instructions are source-document content, not actions performed by the website.

## Structure

```text
.github/workflows/pages.yml   GitHub Pages deployment
dist/
  index.html                 Main page and project description
  styles.css                 Responsive design
  app.js                     Archive, team rendering, and illustration
  site.config.js             Editable project data and links
  assets/favicon.svg         Local icon (add photos/audio here)
  documents/                 Included and future project files
scripts/serve.mjs             Local static preview
scripts/validate.mjs          Local file and link validation
```
