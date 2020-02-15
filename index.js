const {ApolloServer, gql} = require('apollo-server');

const typeDefs = gql`

	type Actor {
		id: ID!
		name: String!
	}

	type Movie {
		id: ID!
		title: String!
		releaseDate: String
		rating: Int 
		actors: [Actor!]!
	}

	type Query {
		movies: [Movie]
	}

`

const movies = [
	{
		id: "1",
		title: "Mr. Pickles",
		releaseDate: "23-09-2013",
		rating: 5
	},
	{
		id: "1",
		title: "Avatar",
		releaseDate: "28-11-2009",
		rating: 4
	},
	{
		id: "1",
		title: "Unity",
		releaseDate: "12-09-2015",
		rating: 3
	}
]

const resolvers = {
	Query: {
		movies: () => {
		  	return movies
		}
	}
}

const server = new ApolloServer({typeDefs, resolvers})

 server.listen().then(({url}) => {
	 console.log(`Server started at ${url} port`)
 })