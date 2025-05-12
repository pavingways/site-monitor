const cron = require('node-cron');
const { spawn } = require('child_process');
const INTERVAL = process.env.INTERVAL || 1;

if (INTERVAL < 1 || INTERVAL > 59) {
    console.error('INTERVAL not in range (1 - 59)');
    process.exit(1);
}

const spawnMonitor = () => {
    spawn('node', ['./monitor.js'], {
        env: { ...process.env, URL: process.env.URL, TIMEOUT: process.env.TIMEOUT }
    });
}

// initial run
spawnMonitor();

// schedule runs
cron.schedule(`*/${INTERVAL} * * * *`, () => {
    spawnMonitor();
});
