# duelmanager

## Set firebase information

`.env.local`を作成してください
```
$ touch .env.local
```

`.env.local`に対してFirebaseの設定を行ってください。

```
VUE_APP_FIREBASE_CONFIG={"apiKey": "<YOUR_API_KEY>","authDomain": "<YOUR_DOMAIN>", "databaseURL": "<YOUR_DATABASE_URL>", "projectId": "<YOUR...>", "storageBucket": "<YOUR_BUCKET_NAME>", "messagingSenderId": "<YOUR...>", "appId": "<YOUR...>", "measurementId": "<YOUR...>" }   }
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
