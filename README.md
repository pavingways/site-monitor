# What It Is

This is a puppeteer wrapper that can be scheduled to open a website every minute or less often.
It logs successes and errors when loading the page, also scripts and styles that are loaded.
A timeout can check if the requested page loads in total within this time.

# How To Use

```shell
   npm install
```

Run `monitor.js` directly, it uses 2 ENV vars: `URL` und `TIMEOUT`:

- `URL` (mandatory) is the URL to be opened
- `TIMEOUT` (optional, default 10000) is the max time to wait (in ms) for the whole page to load including scripts, styles etc.

```shell
  URL=https://www.pavingways.com TIMEOUT=10000 node monitor.js
```

Scheduled use runs every minute. You can set `INTERVAL` env var to execute less often

- `INTERVAL` (optional, default 1, max 59) time to wait between executions of `monitor.js` 

```shell
  URL=https://www.pavingways.com node schedule.js
```

This runs `monitor.js` every minute.

```shell
  URL=https://www.pavingways.com TIMEOUT=2000 INTERVAL=3 node schedule.js
```

This runs `monitor.js` every 3 minutes and only waits for 2000 ms for the page to load.
