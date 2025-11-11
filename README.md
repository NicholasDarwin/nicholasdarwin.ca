# Nicholas Darwin – Personal Website

A clean, minimal portfolio website showcasing experience, projects, skills, and awards.

## Overview 

This is a static HTML/CSS/JavaScript website designed to be simple, fast, and easy to maintain. The site features:

- **Home** – Hero section with recent roles (University of Waterloo)
- **About** – Education and certifications
- **Experience** – Work history and leadership
- **Projects** – Featured projects (EV Race Car, Cells in Focus)
- **Skills** – Technical skills organized by category
- **Awards** – Awards and honors
- **Contact** – Email, LinkedIn, and Instagram links

## File Structure

```
Nich's Website/
├── index.html              # Home page
├── about.html              # About & education
├── experience.html         # Work experience
├── projects.html           # Featured projects
├── skills.html             # Technical skills
├── awards.html             # Awards & honors
├── contact.html            # Contact information
├── styles.css              # Minimal stylesheet
├── script.js               # Simple navigation script
├── assets/
│   └── waterloo-logo.svg   # University of Waterloo logo
└── README.md               # This file
```

## Features

- **Minimal Design** – Clean, readable layout with system fonts
- **Responsive** – Works on desktop, tablet, and mobile
- **No External Dependencies** – Pure HTML/CSS/JS (no frameworks)
- **Fast Load Times** – Optimized CSS and minimal JavaScript
- **Easy to Customize** – Well-organized code and clear class names

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/NicholasDarwin/Personal-Website.git
   cd "Nich's Website"
   ```

2. Open `index.html` in your browser:
   - **Windows**: Double-click `index.html`
   - **Mac/Linux**: Right-click → Open With → Browser

3. Make edits to HTML/CSS/JS files and refresh your browser to see changes.

### Deployment

This site is deployed on **GitHub Pages**. To deploy:

1. Make changes locally
2. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "Update: describe your changes"
   git push
   ```
3. GitHub automatically builds and deploys the site (usually within 1–2 minutes)

Your site is live at: `https://nicholasdarwin.github.io/Personal-Website/`

## Customization

### Updating Content

- **Home hero**: Edit `index.html` (`.hero` section)
- **Recent roles**: Edit `index.html` (`.recent-roles` section)
- **Contact info**: Edit `contact.html` (`.get-in-touch` section)
- **Experience cards**: Edit `experience.html`

### Styling

- **Colors & fonts**: Edit `:root` variables in `styles.css`
- **Layout adjustments**: Modify max-width, padding, or grid columns in `styles.css`
- **Responsive breakpoints**: Update media queries at the bottom of `styles.css`

### Adding Assets

Place images/logos in the `assets/` folder and reference them:
```html
<img src="assets/your-image.svg" alt="Description">
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contact

- **Email**: ndarwin@uwaterloo.ca
- **LinkedIn**: linkedin.com/in/nicholas-darwin
- **Instagram**: instagram.com/nicholas.darwin

## License

© 2025 Nicholas Darwin. All rights reserved.
