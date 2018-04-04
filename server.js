const express = require('express');
const nodeSchedule = require('node-schedule');
const axios = require('axios');

const server = express();
server.use(express.json());


const description = 'software development javascript';  
const searchDesc = description.split(' ').map(el => el.split(' ').join('+'))
console.log(searchDesc)


axios.get(`https://jobs.github.com/positions.json?description=${searchDesc}&location=united+states`)
.then(res => console.log(res))