const path = require('path')
const akaneko = require('akaneko');
const { onSpam, addSpam, settings } = require('../function/anti_spam')
const { api } = require('../function/index.js')
const { chord, lirik } = require('../function/lagu.js')
const textpro = require('../function/textpro')
const axios = require('axios')
const RA = require('ra-api')
const cheerio = require('cheerio')


const endPoint = (app, init) => {
     app.get('/api/lirik', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Lirik'
               })
               const parameter = req.query
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         const parameter = req.query
                         RA.Musikmatch(parameter.q).then(result => {
                              res.send(JSON.stringify({
                                   status: true,
                                   remaining: apikey.remaining,
                                   result
                              }, null, 5))
                         })
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/chord', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Chord'
               })
               const parameter = req.query
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         const parameter = req.query
                         chord(parameter.q).then(result => {
                              if (result === false) {
                                   return res.send(JSON.stringify({
                                        status: false,
                                        remaining: apikey.remaining
                                   }, null, 2))
                              } else {
                                   res.send(JSON.stringify({
                                        status: true,
                                        remaining: apikey.remaining,
                                        result
                                   }, null, 5))
                              }
                         })
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/caklontong', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Cak Lontong'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_caklontong.length - 1)
               let result = init.db_caklontong[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/dare', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Dare'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_dare.length - 1)
               let result = init.db_dare[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/cerpen', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Cerpen'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_cerpen.length - 1)
               let result = init.db_cerpen[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/cersex', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Cersex'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_cersex.length - 1)
               let result = init.db_cersex[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/bijak', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Bijak'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_bijak.length - 1)
               let result = init.db_bijak[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nickff', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Nick FF'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_epep.length - 1)
               let result = init.db_epep[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/fakta', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Fakta'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_fakta.length - 1)
               let result = init.db_fakta[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/quotes', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Quotes'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_quotes.length - 1)
               let result = init.db_quotes[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/quotesen', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Quotes En'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_quotesen.length - 1)
               let result = init.db_quotesen[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/quotesislam', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Quotes Islam'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_quotesislam.length - 1)
               let result = init.db_quotesislam[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/cersex', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Cersex'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_cersex.length - 1)
               let result = init.db_cersex[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/entruth', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'En Truth'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_entruth.length - 1)
               let result = init.db_entruth[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/endare', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'En Dare'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_endare.length - 1)
               let result = init.db_endare[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/kimia', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Tebak Unsur Kimia'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_kimia.length - 1)
               let result = init.db_kimia[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/pantun', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Pantun'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_pantun.length - 1)
               let result = init.db_pantun[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/horor', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Cerita Horor'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_horor.length - 1)
               let result = init.db_horor[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/fuckmylife', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Fuck My Life'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_fuckmylife.length - 1)
               let result = init.db_fuckmylife[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/bucin', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Bucin'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_bucin.length - 1)
               let result = init.db_bucin[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/quotesdilan', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Quotes Dilan'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_quotesdilan.length - 1)
               let result = init.db_quotesdilan[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/quotesanime', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Quotes Anime'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_quotesanime.length - 1)
               let result = init.db_quotesanime[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/fakedata', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Fake Data'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_fakedata.length - 1)
               let result = init.db_fakedata[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/motivasi', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Motivasi'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_motivasi.length - 1)
               let result = init.db_motivasi[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/randomnama', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Nama'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_nama.length - 1)
               let result = init.db_nama[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/katasenja', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Kata Senja'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_katasenja.length - 1)
               let result = init.db_katasenja[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/truth', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Truth'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_truth.length - 1)
               let result = init.db_truth[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/asahotak', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Asah Otak'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_asahotak.length - 1)
               let result = init.db_asahotak[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/family100', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Family 100'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_family100.length - 1)
               let result = init.db_family100[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/sambungkata', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Sambung Kata'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_sambungkata.length - 1)
               let result = init.db_sambungkata[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/tebakjenaka', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Tebak Jenaka'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_tebakjenaka.length - 1)
               let result = init.db_tebakjenaka[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/tebakbendera', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Family 100'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_tebakbendera.length - 1)
               let result = init.db_tebakbendera[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/siapakahaku', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Family 100'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_siapakahaku.length - 1)
               let result = init.db_siapakahaku[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/susunkata', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Susun Kata'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_susunkata.length - 1)
               let result = init.db_susunkata[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })

     app.get('/api/tebaklagu', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Tebak Lagu'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_tebakgambar.length - 1)
               let result = init.db_tebakgambar[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })

     app.get('/api/matheasy', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Math Easy'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_matheasy.length - 1)
               let result = init.db_matheasy[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })

     app.get('/api/mathmedium', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Math Medium'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_mathmedium.length - 1)
               let result = init.db_mathmedium[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })

     app.get('/api/mathpro', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Math Pro'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_mathpro.length - 1)
               let result = init.db_mathpro[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })

     app.get('/api/mathextreme', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Math Extreme'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_mathextreme.length - 1)
               let result = init.db_mathextreme[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })

     app.get('/api/mathimpossible', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Math Impossible'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_mathimpossible.length - 1)
               let result = init.db_mathimpossible[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })

     app.get('/api/mathimpossible2', (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Math Impossible 2'
               })
               const parameter = req.query
               let randomCak = Math.floor(Math.random() * init.db_mathimpossible2.length - 1)
               let result = init.db_mathimpossible2[randomCak]
               if (data?.data?.status == 'true') {
                    res.setHeader('content-type', 'application/json')
                    if (apikey.status) {
                         res.send(JSON.stringify({
                              status: true,
                              remaining: apikey.remaining,
                              result
                         }, null, 5))
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })


     app.get('/api/glitchtext', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Glitch Text'
               })
               const parameter = req.query
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await textpro("https://textpro.me/create-a-glitch-text-effect-online-free-1026.html", [parameter.t1, parameter.t2])
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/pinterest', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'Pinterest'
               })
               const parameter = req.query
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await api.pinterest(parameter.q)
                              .then((data) => {
                                   n = JSON.parse(JSON.stringify(data.result));
                                   nimek = n[Math.floor(Math.random() * n.length)];
                                   axios({
                                        method: 'get',
                                        url: nimek,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwhentai', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Hentai'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.hentai()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwschool', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW School'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.school()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwpussy', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Hentai'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.pussy()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwuniform', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Uniform'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.uniform()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwfoxgirl', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Fox Girl'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.foxgirl()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwmasturbation', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Masturbation'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.masturbation()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwneko', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Neko'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.lewdNeko()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwwallpaperpc', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Wallpaper-PC'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.wallpapers()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwwallpapermobile', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Wallpaper-Mobile'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.mobileWallpapers()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwpanties', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Panties'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.panties()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfworgy', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Orgy'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.orgy()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwglasses', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Glasses'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.glasses()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwfemdom', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Femdom'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.femdom()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwthighs', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Thighs'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.thighs()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwcum', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Cum'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.cum()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwmaid', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Maid'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.maid()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwblowjob', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW BlowJob'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.blowjob()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwnetorare', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Netorare'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.netorare()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwfeet', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW Feet'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.feet()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwass', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW ASS'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.ass()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })
     app.get('/api/nsfwbdsm', async (req, res) => {
          let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ip = ip.replace(/\:|f|\:\:1/g, '')
          const noSpam = addSpam({ ip })
          if (!noSpam.status) {
               res.setHeader('content-type', 'application/json')
               res.send(JSON.stringify({
                    status: false,
                    message: `Max ${settings.spam} request / second`
               }, null, 2))
               return
          }
          init.addRequest(ip)
          if (!req.query.apikey) {
               res.send(JSON.stringify({
                    status: false,
                    message: 'Please provide apikey ?apikey='
               }, null, 2))
          } else {
               const apikey = init.reduceApikey(req.query.apikey)
               const data = init.getDataFromApikey(req.query.apikey)
               init.sendLogs('request', {
                    username: data.data ? data.data?.username : '-',
                    ip,
                    apiname: 'NSFW BDSM'
               })
               if (data?.data?.status == 'true') {
                    res.setHeader('Content-Type', 'image/jpg')
                    if (apikey.status) {
                         await akaneko.nsfw.bdsm()
                              .then((data) => {
                                   axios({
                                        method: 'get',
                                        url: data,
                                        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 9; RMX1941) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36' },
                                        responseType: 'arraybuffer'
                                   })
                                        .then(function (response) {
                                             var headers = { 'Content-Type': 'image/jpg' };
                                             res.writeHead(200, headers);
                                             res.end(response.data, 'utf-8');
                                        }).catch(function (error) {
                                             res.send(JSON.stringify({
                                                  status: false,
                                                  remaining: apikey.remaining
                                             }, null, 2))
                                             // res.json(error)
                                        });
                              }).catch(
                                   (e) =>
                                        res.send(JSON.stringify({
                                             status: false,
                                             remaining: apikey.remaining
                                        }, null, 5))
                              );
                    } else if (apikey?.message?.include('exceeded')) {
                         res.sendFile(path.join(__dirname, 'pages/exceeded.html'))
                    } else {
                         res.send(JSON.stringify(apikey, null, 5))
                    }
               } else {
                    res.setHeader('content-type', 'text/html; charset=UTF-8')
                    res.sendFile(path.join(__dirname, '/403.html'))
               }
          }
     })


}

module.exports = endPoint