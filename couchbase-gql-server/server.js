// require packages
const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const couchbase = require('couchbase')

// create app, connect to server
const app = express()
app.use(cors())
const cluster = new couchbase.Cluster('couchbase://localhost', 
  { username: 'Administrator', password: 'password' }
)
const bucket = cluster.bucket('travel-sample')
const collection = bucket.defaultCollection();

// define graphql schema
const schema = buildSchema(`
  type Airline {
    id: Int,
    callsign: String,
    country: String,
    iata: String,
    icao: String,
    name: String
    type: String
  }
  input AirlineInput {
    callsign: String,
    country: String,
    iata: String,
    icao: String,
    name: String
  }
  type Query {
    airlinesUK: [Airline],
    airlineByKey(id: Int!): Airline
    airlinesByRegion(region: String!): [Airline]
  }
  type Mutation {
    updateAirline(id: Int!, input: AirlineInput): Airline
  }
`)

// Define Resolvers
const airlinesUkQuery = `
  SELECT airline.* 
  FROM \`travel-sample\` AS airline 
  WHERE airline.type = 'airline'
  AND airline.country = 'United Kingdom'
`
const airlinesByRegionQuery = `
  SELECT airline.* 
  FROM \`travel-sample\` AS airline 
  WHERE airline.type = 'airline'
    AND airline.country = $REGION
`

const root = {
  airlinesUK: async () => {
    const result = await cluster.query(airlinesUkQuery)
    return result.rows
  },
  airlinesByRegion: async ({region}) => {
    const options = { parameters: { REGION: region } }
    const result = await cluster.query(airlinesByRegionQuery, options)
    return result.rows
  },
  airlineByKey: async ({id}) => {
    const result = await collection.get(`airline_${id}`)
    return result.value
  },
  updateAirline: async ({id, input}) => {
    const result = await collection.get(`airline_${id}`)

    const newDocument = {
      id: result.value.id,
      callsign: input.callsign ? input.callsign : result.value.callsign,
      country: input.country ? input.country : result.value.country,
      iata: input.iata ? input.iata : result.value.iata,
      icao: input.icao ? input.icao : result.value.icao,
      name: input.name ? input.name : result.value.name,
      type: result.value.type
    }

    await collection.upsert(`airline_${id}`, newDocument)
    return newDocument
  }
}

// the graphqlHTTP function accepts a schema, rootValue and graphiql 
// among other options for configuring our GraphQL Server
const serverPort = 4000
const serverUrl = '/graphql'
app.use(serverUrl, graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(
  serverPort, 
  () => console.log(`GraphQL server running: http://localhost:${serverPort}${serverUrl}`)
)
