# Hello World!

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

If you see the following error, try running 'npm install --force'

```bash
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error
npm error While resolving: react-day-picker@8.10.1
npm error Found: react@19.1.0
npm error node_modules/react
npm error   react@"^19.0.0" from the root project
npm error   peer react@">=16.8.0" from @floating-ui/react-dom@2.1.2
npm error   node_modules/@floating-ui/react-dom
npm error     @floating-ui/react-dom@"^2.0.0" from @radix-ui/react-popper@1.2.3
npm error     node_modules/@radix-ui/react-popper
npm error       @radix-ui/react-popper@"1.2.3" from @radix-ui/react-hover-card@1.1.7
npm error       node_modules/@radix-ui/react-hover-card
npm error         @radix-ui/react-hover-card@"^1.1.7" from the root project
npm error       3 more (@radix-ui/react-menu, @radix-ui/react-popover, @radix-ui/react-tooltip)
npm error   56 more (@radix-ui/react-accordion, @radix-ui/react-arrow, ...)
npm error
npm error Could not resolve dependency:
npm error peer react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-day-picker@8.10.1
npm error node_modules/react-day-picker
npm error   react-day-picker@"^8.10.1" from the root project
npm error
npm error Conflicting peer dependency: react@18.3.1
npm error node_modules/react
npm error   peer react@"^16.8.0 || ^17.0.0 || ^18.0.0" from react-day-picker@8.10.1
npm error   node_modules/react-day-picker
npm error     react-day-picker@"^8.10.1" from the root project
npm error
npm error Fix the upstream dependency conflict, or retry
npm error this command with --force or --legacy-peer-deps
npm error to accept an incorrect (and potentially broken) dependency resolution.
npm error
npm error
npm error For a full report see:
```
