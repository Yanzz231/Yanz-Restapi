const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const RestApi = require('./lib/classes');

const client = new RestApi();
const scheme = JSON.parse(fs.readFileSync('./lib/pages/api-scheme.json'));
let settings = JSON.parse(fs.readFileSync('./src/settings.json'));

cron.schedule(
  `${settings.Reset_Time.Minute} ${settings.Reset_Time.Hour} * * *`,
  () => {
    client.resetLimit();
    console.log('Success reset free limit');
  },
  {
    scheduled: true,
    timezone: 'Asia/Jakarta',
  }
);

const features_merge = scheme.map((feature) => feature.card);
const features = [].concat([], features_merge);
const active = features.filter((feature) => feature.status);
const error = features.filter((feature) => !feature.status);

settings.Features = features.length;
settings.Active = active.length;
settings.Error = error.length;

fs.writeFileSync('./src/settings.json', JSON.stringify(settings, null, 5));

client.start();
