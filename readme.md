# RAGE with Couchbase Talk Steps

## Ensure Couchbase Server is running with `travel-sample`

Visit [localhost:8091](https://localhost:8091)

Review the dataset, airline documents, and indexes

This repo was created with:

-     mkdir rage-with-couchbase && cd $_
-     touch .gitignore && echo "/node_modules/*" >> .gitignore
-     mkdir couchbase-gql-server && cd $_ && npm init -y
-     touch .gitignore && echo "/node_modules" >> .gitignore
-     npm install graphql express express-graphql couchbase cors && code .
-     touch server.js

## Build the GraphQL Server

Add code snippets 1-8 and describe each section of code

Explore GraphiQL interface and how Postman can help organize your API's and individual GraphQL POSTS.

## Talk about Other endpoints used (getByKey and Update)

Even though we are not going to be using them in the project getAirlineByKey and updateAirline

## Clone React project into the project

    git clone https://github.com/httpJunkie/react-apollo-client.git && cd react-apollo-client && rm -rf .git

### Review the following files:

- hoc/withApolloProvider.js
- partial/airline-list.jsx
- partial/airline-details.jsx
- utility/pagination.jsx
- utility/pagination.scss
- routes/airline-gql.js

### Review how the master-detail page will work in React using React Router

- http://localhost:3000/airlines/
- http://localhost:3000/airlines/1355

### Install packages

    npm install @apollo/react-hooks apollo-boost graphql

### Airlines.jsx

The airlines.jsx file is where we will be doing most of our work. Let’s start by adding some imports:

    import { useQuery } from '@apollo/react-hooks'
    import { airlineGql } from './airline-gql'

Underneath the `import { airlineGql }` line, we need to import `withApolloProvider()`, a higher order component.

    import withApolloProvider from '../hoc/withApolloProvider'

This will wrap our component with the Apollo Provider in a way that makes the code in this demo simpler.

Change:

    export default Airlines

to:

    const WrappedComponent = withApolloProvider(Airlines, 'http://localhost:4000/graphql')
    export default WrappedComponent

Add the imports:

    import AirlineList from '../partial/airline-list'
    import AirlineDetails from '../partial/airline-details'

Now we can update the JSX to use these two components:

    <Row horizontal="spaced">
      <Column flexGrow={1} style={{ minWidth: '280px', width: '65%' }}>
        <AirlineList airlines={airlines} />
      </Column>
      <Column flexGrow={1} style={{ width: '45%' }}>
        <AirlineDetails airline={airline} />
      </Column>
    </Row>

Let’s bring React Router’s `match` in by destructuring the props to the Airlines Component:

    const Airlines = ({ match }) => {

Next we will add the following to the top level of our Airlines Component:

    const airlineId = Number(match.params.id)
    const { loading, error, data } = useQuery(airlineGql)

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error :( <span style={{color: 'red'}}>{error.message}</span> )</p>

    const airlines = data.airlinesUK
    const airline = match.params.id ? airlines.find(a => a.id === airlineId) : null

### What have we just done:

- Set airlineId if `match.params.id` returns number vs undefined.
   (`/airlines/1355` vs `/airlines/`)
- Using GraphQL query string exported in our `airlineGql` file. It returns data we can destructure as well.
- Return “loading” until the data has finished loading
- Return “Error” in the case our GraphQL generates an error
- Capture the data for all of the airlines returned from our query into a local variable named airlines
- If `match.params.id` contains a number it means our route contains an ID, here we capture the data for that specific airline into a local variable named airline otherwise we store a null value in that variable.

The match will work because of the way we set up our route in the App.js page:

    <Route exact path={["/airlines/:id", "/airlines/"]}
        render={(props) => <Airlines {...props} />}
    />

## Using Postinstall and Concurrently

Initialize NPM and add concurrently:

    npm init -y && npm install concurrently --save-dev

Add scripts:

    "scripts": {
       "client": "cd react-apollo-client && npm start",
       "server": "cd couchbase-gql-server && node server",
       "start": "concurrently --kill-others \"npm run server\" \"npm run client\"",
       "postinstall": "(cd couchbase-gql-server && npm install); (cd react-apollo-client && npm install);"
    },

