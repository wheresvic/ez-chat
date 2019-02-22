# ez-chat

EzChat is a standalone web-socket based chat application. As of version 1.0.0, it features:

- file-based persistence
- a single chat-room
- username storage

## Libraries and frameworks

- Bulma.css
- React.js bootstrapped with `create-react-app` as UI framework
- Node.js backend runtime
  - Express.js
  - Socket.io

## Development

Require Node.js `>= v10.x`. Run `npm install` to install all dependencies.

- Start css compilation: `npm run sass:watch`
- Start ui: `npm run start:ui`
- Test ui: `npm run test:ui`
- Start server: `npm start`
- Test server: `npm run test:server`

## Production

- Build ui: `npm run build:ui`
- Build ui with prod socket url: `build:ui:prod`

## LICENSE

The EzChat code is MIT licensed and is proudly built open-source software and their respective licenses apply where provided.
