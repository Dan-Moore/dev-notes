
This is website is built with Next.js and MDX for content generation.

## Getting Started

Cloning the repo

```bash
git clone https://github.com/Dan-Moore/dev-notes.git
```

Open the directory /dev-notes and run npm install and run command.

```bash
npm install
npm run dev
```

If you see the following error, try running 'npm install --legacy-peer-deps' to bypass it. 
This error is for a dependency conflict in [package.json](package.json). 
You'll need to review the failing dependency and try updating with the latest hosted packages on [NPM](https://www.npmjs.com/).

```bash
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error
... [Failing dependencies will be listed out here.]
npm error Fix the upstream dependency conflict, or retry
npm error this command with --force or --legacy-peer-deps
npm error to accept an incorrect (and potentially broken) dependency resolution.
``` 

