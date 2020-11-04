const express = require('express')
const handlebars = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default
const { Headers } = require('node-fetch')



var myHeaders = new Headers();
myHeaders.append("AccountKey", "ypUM86fdSh2EMSl6T5rcOg==");
myHeaders.append("accept", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=54201&ServiceNo=268", requestOptions)
  .then(response => response.json())
  .then(result => {
    const busArray = result.Services[0].NextBus
    
    console.log(busArray)
  })
  .catch(error => console.log('error', error));
