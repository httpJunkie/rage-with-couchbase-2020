import { gql } from 'apollo-boost'

export const airlineGql = gql`
  {
    airlinesUK {
      callsign
      country
      iata
      icao
      id
      name
    }
  }
`