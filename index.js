const {ApolloServer, gql} = require('apollo-server');
const {GraphQLScalarType} = require('graphql')
const {Kind} = require('graphql/language')

const typeDefs = gql`
	scalar Date

	type Actor {
		id: ID!
		name: String!
	}

	type Movie {
		id: ID!
		title: String!
		releaseDate: Date
		rating: Int 
		actors: [Actor!]!
	}

	type Query {
		movies: [Movie]
		movie(id:ID): Movie
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
		id: "2",
		title: "Avatar",
		releaseDate: "28-11-2009",
		rating: 4
	},
	{
		id: "3",
		title: "Unity",
		releaseDate: "12-09-2015",
		rating: 3
	}
]

const resolvers = {
	Query: {
		movies: () => {
		  	return movies
		},
		movie: (obg, {id}, context, info) => {
			const foundMovie = movies.find((movie) => movie.id === id)
			return foundMovie
		}
	},
	Date: new GraphQLScalarType({
		name: "Date",
		description: "It's a date",
		parseValue(value) {
			return new Date(value);
		},
		serialize(value) {
			return value.getTime();
		},
		parseLiteral(ast) {
			if(ast.kind === Kind.INT) {
				return new Date(ast.value)
			}
			return null;
		}
	})
}

const server = new ApolloServer({typeDefs, resolvers, introspection: true, playground: true})

 server.listen({
	 port: process.env.PORT || 4000
 }).then(({url}) => {
	 console.log(`Server started at ${url} port`)
 })