const Promise = require("bluebird");
const Stats = require("simple-statistics");
const http = require('http');
const lighthouse = require('lighthouse');
const chromeLauncher = require('lighthouse/chrome-launcher/chrome-launcher');

console.log("Beginning Speed Index Test... ");
let stockScores = [];
let fotoliaScores = [];
let shutterScores = [];
let istockScores = [];

let promises = [];
/* Run i*4 tests */
for (let i =0; i<3;i++){

  /* Launch Chrome */
  promises.push(chromeLauncher.launch().then((chrome) => {
    /* Configure flags */
    const flags = {
      output: 'json',
      port: chrome.port
    };
    const config = null;

    /* Begin lighthouse test for Stock */
    return lighthouse('http://stock.adobe.com', flags, config)
    .then((results) => {
      /* Push output and repeat for Fotolia */
      stockScores.push(results.audits["speed-index-metric"].rawValue);
      if (results.audits["speed-index-metric"].rawValue == null){
        console.log(results)
      }
      console.log(results.audits["speed-index-metric"].rawValue);
      return lighthouse("https://us.fotolia.com/", flags, config);
    })
    .then((results) => {
      /* Print output and repeat for ShutterStock */
      fotoliaScores.push(results.audits["speed-index-metric"].rawValue);
      return lighthouse("https://www.shutterstock.com/", flags, config);
    })
    .then((results) => {
      /* Print output and repeat for iStock */
      shutterScores.push(results.audits["speed-index-metric"].rawValue);
      return lighthouse("http://www.istockphoto.com/", flags, config);
    })
    .then((results) => {
      /* Print output and repeat for iStock */
      istockScores.push(results.audits["speed-index-metric"].rawValue);

      /* Kill Chrome */
      chrome.kill();
    });
  })
);

}

Promise.all(promises).then(function(){
  console.log("Results:");

  console.log("Adobe Stock:");
  console.log("Data:");
  console.log(stockScores);
  console.log("Mean:");
  console.log(Stats.mean(stockScores));
  console.log("Median:");
  console.log(Stats.median(stockScores));
  console.log("Std Deviation:");
  console.log(Stats.standardDeviation(stockScores));

  console.log("Fotolia:");
  console.log("Data:");
  console.log(fotoliaScores);
  console.log("Mean:");
  console.log(Stats.mean(fotoliaScores));
  console.log("Median:");
  console.log(Stats.median(fotoliaScores));
  console.log("Std Deviation:");
  console.log(Stats.standardDeviation(fotoliaScores));

  console.log("ShutterStock:");
  console.log("Data:");
  console.log(shutterScores);
  console.log("Mean:");
  console.log(Stats.mean(shutterScores));
  console.log("Median:");
  console.log(Stats.median(shutterScores));
  console.log("Std Deviation:");
  console.log(Stats.standardDeviation(shutterScores));


  console.log("iStock:");
  console.log("Data:");
  console.log(istockScores);
  console.log("Mean:");
  console.log(Stats.mean(istockScores));
  console.log("Median:");
  console.log(Stats.median(istockScores));
  console.log("Std Deviation:");
  console.log(Stats.standardDeviation(istockScores));

});
