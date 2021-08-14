# TTV Emote Stats

View emote usage statistics for a [Twitch.tv](https://www.twitch.tv/) channel's chat.

To see planned features and current tasks, refer to the [Development Notes](https://github.com/bundumpling/ttv-emote-stats/blob/master/DEVNOTES.md).

## Project setup

From root folder:
```
yarn install
```
From api_relay_server folder:
```
npm install
```

### Compiles and hot-reloads for development

From root folder:
```
yarn serve
```
From api_relay_server folder:
```
node index.js
```
**Note**: The API Relay Server uses a `.env` file with the `dotenv` package to provide the necessary ClientID and OAuth tokens to the Twitch API. *Do not expose these keys to the front-end application!*

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
