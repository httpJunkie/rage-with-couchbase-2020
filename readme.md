# RAGE with Couchbase Talk Steps

## Ensure Couchbase Server is running with `travel-sample`

Visit [localhost:8091](https://localhost:8091)

Review the dataset, airline documents, and indexes

This repo was created with:

- `mkdir rage-with-couchbase && cd $_`
- `touch .gitignore && echo "/node_modules/*" >> .gitignore`
- `mkdir couchbase-gql-server && cd $_ && npm init -y`
- `touch .gitignore && echo "/node_modules" >> .gitignore`
- `npm install graphql express express-graphql couchbase cors && code .`
- `touch server.js`

## Build the GraphQL Server

Add code snippets 1-8 and describe each section of code

Explore GraphiQL interface and how Postman can help organize your API's and individual GraphQL POSTS.

## Talk about Other endpoints used (getByKey and Update)

Even though we are not going to be using them in the project getAirlineByKey and updateAirline

## Clone Ract project into project