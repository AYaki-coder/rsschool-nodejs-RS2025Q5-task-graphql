import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  DocumentNode,
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  parse,
  validate,
} from 'graphql';
import {
  changePost,
  createPost,
  deletePost,
  getAllPosts,
  getPost,
} from './resolvers/post.js';
import { getAllMemberTypes, getMemberType } from './resolvers/member-type.js';
import {
  changeProfile,
  createProfile,
  deleteProfile,
  getALLProfiles,
  getProfile,
} from './resolvers/profile.js';
import {
  changeUser,
  createUser,
  deleteUser,
  getALLUsers,
  getUser,
} from './resolvers/user.js';
import { subscribeTo, unsubscribeFrom } from './resolvers/subscribe.js';
import depthLimit from 'graphql-depth-limit';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user: getUser,
      users: getALLUsers,
      posts: getAllPosts,
      post: getPost,
      memberTypes: getAllMemberTypes,
      memberType: getMemberType,
      profile: getProfile,
      profiles: getALLProfiles,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: createUser,
      createProfile: createProfile,
      createPost: createPost,
      changePost: changePost,
      changeProfile: changeProfile,
      changeUser: changeUser,
      deleteUser: deleteUser,
      deletePost: deletePost,
      deleteProfile: deleteProfile,
      subscribeTo: subscribeTo,
      unsubscribeFrom: unsubscribeFrom,
    },
  }),
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req, reply) {
      const { query, variables } = req.body as {
        query: string;
        variables?: Record<string, unknown>;
      };

      const documentAST: DocumentNode = parse(query);

      const validationErrors = validate(schema, documentAST, [depthLimit(5)]);

      if (validationErrors.length > 0) {
        await reply.status(400).send({
          errors: validationErrors,
        });
        return;
      }

      return graphql({
        schema,
        source: query,
        contextValue: { prisma },
        variableValues: variables,
      });
    },
  });
};

export default plugin;
