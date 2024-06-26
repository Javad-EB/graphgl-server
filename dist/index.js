import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
type Author {
  firstName: String
  lastName: String
}
  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: ID
    title: String
    author: Author
    location: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
  input AuthorInput {
    firstName: String
    lastName: String
  }
  input NewBookInput {
    title: String!
    author: AuthorInput!
  }
  type Mutation {
    addBook(input: NewBookInput!): Book!
  }
`;
const books = [
    {
        id: 2763,
        title: 'The Awakening',
        author: {
            firstName: 'Kate',
            lastName: 'Chopin'
        },
    },
    {
        id: 3765,
        title: 'City of Glass',
        author: {
            firstName: 'Paul',
            lastName: 'Auster'
        },
    },
];
const resolvers = {
    Query: {
        books: (a, b, c) => {
            console.log("we are in books resolvers:", "a is", a, "b is", b, "c is", c);
            return books;
        },
    },
    Author: {
        firstName: (a) => {
            return "Mr." + a.firstName;
        }
    },
    Mutation: {
        addBook: (_, { input }) => {
            console.log("Inside mutation input is", input);
            const id = Math.floor(Math.random() * 1000);
            const newBook = { ...input, id };
            books.push(newBook);
            return newBook;
        }
    }
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
