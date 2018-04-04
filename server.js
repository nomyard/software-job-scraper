const express = require('express');
// const nodeSchedule = require('node-schedule');
// const axios = require('axios');
const rp = require('request-promise');
const cheerio = require('cheerio');
const Table = require('cli-table');

const server = express();
server.use(express.json());

let users = [];
let table = new Table({
  head: ['username', '<3', 'challenges'],
  colWidths: [15, 5, 10]
})

const options = {
  url: `https://forum.freecodecamp.org/directory_items?period=weekly&order=likes_received&_=1522813274830`,
  json: true
}

rp(options)
  .then((data) => {
    let userData = [];
    for (let user of data.directory_items) {
      userData.push({name: user.user.username, likes_received: user.likes_received});
    }
    process.stdout.write('loading');
    getChallengesCompletedAndPushToUserArray(userData);
  })
  .catch((err) => {
    console.log(err);
  });

function getChallengesCompletedAndPushToUserArray(userData) {
  var i = 0;
  function next() {
    if (i < userData.length) {
      var options = {
        url: `https://www.freecodecamp.org/` + userData[i].name,
        transform: body => cheerio.load(body)
      }
      rp(options)
        .then(function($) {
          process.stdout.write('.');
          const fccAccount = $('h1.landing-heading').length == 0;
          const challengesPassed = fccAccount ? $('tbody tr').length : 'unknown';
          table.push([userData[i].name, userData[i].likes_received, challengesPassed]);
          ++i;
          return next();
        })
    } else {
      printData();
    }
  }
  return next();
};

function printData() {
  console.log("^");
  console.log(table.toString());
}

// const description = 'software development javascript';  
// const searchDesc = description.split(' ').map(el => el.split(' ').join('+'))
// console.log(searchDesc)


// axios.get(`https://jobs.github.com/positions.json?description=${searchDesc}&location=united+states`)
// .then(res => console.log(res))

