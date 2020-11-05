// load the 4 libs
const express = require('express')
const handlebars = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default
const { Headers } = require('node-fetch')

// configure the PORT
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const API_KEY = process.env.API_KEY || "ypUM86fdSh2EMSl6T5rcOg==";
const BUSAPI_URL = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2'

// create an instance of express
const app = express()

// configure handlebars
app.engine('hbs', handlebars({ defaultLayout: 'default.hbs' }))
app.set('view engine', 'hbs')

// configure app
app.get('/', (req, resp) => {
    resp.status(200)
    //resp.type('text/html')
    resp.render('index')
})

app.get('/search', 
    async (req, resp) => {
        const BusStopCode = req.query['stopnum']
        const ServiceNo = req.query['busnum']

        // construct the url with the query parameters
        const url = withQuery(BUSAPI_URL, {
           // AccountKey: API_KEY,
            BusStopCode : BusStopCode,
            ServiceNo : ServiceNo ,
            accept: 'application/json'                     
        })

        var myHeaders = new Headers();
myHeaders.append("AccountKey", API_KEY);
myHeaders.append("accept", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch(url, requestOptions)
  .then(result => result.json())
  .then(bus => {
    const busArray = bus.Services
                    .map( d => {

                            return { ServiceNo: d.ServiceNo,
                            next1 : d.NextBus.EstimatedArrival,
                            next2 : d.NextBus2.EstimatedArrival,
                            next3 : d.NextBus3.EstimatedArrival
                                                                     
                    }
                }
            )

     resp.status(200)
        resp.type('text/html')
        
        resp.render('bus', {
            busArray, ServiceNo, BusStopCode            
        })
	})
	.catch(err => {
		console.error('err: ', err)
    })
    
        
    }
)


app.use(express.static(__dirname + '/static'))

//run port
app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`)  
    console.info('API Key = ' + API_KEY)
    
})

