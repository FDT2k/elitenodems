const dbSettings = {
  db: process.env.DB || 'elite', //catalog
  port: process.env.PORT || 8080,
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASS || '',
  servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(',') : [
    '192.168.99.100:27017'
  ]
}


const authSettings = {
  JWT_KEY:"SuperSecretKeyOMG", //CHANGE THIS

  JWT_CONFIG : {
    expiresIn: "20m"
  },
  secret:'wut',
  JWT_RENEW:true,
  JWT_RENEW_DELAY:5*60,
}

const serverSettings = {

}
module.exports = Object.assign({}, { dbSettings, authSettings, serverSettings });
