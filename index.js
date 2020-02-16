const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

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
    actor: [Actor]
  }

  type Query {
    movies: [Movie]
    movie(id: ID): Movie
  }
  input ActorInput {
    id: ID
  }

  input MovieInput {
    id: ID!
    title: String!
    releaseDate: Date
    rating: Int
    actor: [ActorInput]
  }

  type Mutation {
    addMovie(movie: MovieInput): [Movie]
  }
`;
const actors = [
  {
    id: 'johnny',
    name: 'Johnny Depp',
  },
  {
    id: 'jackie',
    name: 'Jackie Chan',
  },
  {
    id: 'jamie',
    name: 'James Gordon',
  },
];
const movies = [
  {
    id: '1',
    title: 'Mr. Pickles',
    releaseDate: '23-09-2013',
    rating: 5,
    actor: [
      {
        id: 'johnny',
      },
    ],
  },
  {
    id: '2',
    title: 'Avatar',
    releaseDate: '28-11-2009',
    rating: 4,
    actor: [
      {
        id: 'jackie',
      },
    ],
  },
  {
    id: '3',
    title: 'Unity',
    releaseDate: '12-09-2015',
    rating: 3,
    actor: [
      {
        id: 'jamie',
      },
    ],
  },
];

const resolvers = {
  Query: {
    movies: () => movies,
    movie: (obg, { id }, context, info) => {
      const foundMovie = movies.find(movie => movie.id === id);
      return foundMovie;
    },
  },
  Mutation: {
    addMovie: (obj, { movie }, context, info) => {
      const newMovieList = [...movies, movie];
      return newMovieList;
    },
  },
  Movie: {
    actor: (obj, arg, context) => {
      const actorIds = obj.actor.map(actor => actor.id);
      const filteredActors = actors.filter(actor =>
        actorIds.includes(actor.id)
      );
      return filteredActors;
    },
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: "It's a date",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

server
  .listen({
    port: process.env.PORT || 4000,
  })
  .then(({ url }) => {
    console.log(`Server started at ${url} port`);
  });
