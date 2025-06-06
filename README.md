# React Note App

This project is a simple note taking tool built with React, Vite and Tailwind CSS. Notes are stored in the browser using `localStorage` and can be imported or exported as CSV files.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Locally

Start the Vite development server:

```bash
npm run dev
```

### Build for Production

Create an optimized production build in the `dist` folder:

```bash
npm run build
```

### Deploy to GitHub Pages

Install the deployment helper:

```bash
npm install --save-dev gh-pages
```

Add the following scripts to your `package.json`:

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

Then run the deploy script:

```bash
npm run deploy
```

This will publish the contents of `dist` to the `gh-pages` branch of your repository.
