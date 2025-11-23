import { GraphQLObjectType, GraphQLBoolean, GraphQLInt } from 'graphql';
import { UUIDType } from './uuid.js';
import { getMemberTypeByParentId } from '../resolvers/member-type.js';

export const profileType = new GraphQLObjectType({
  name: 'profile',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: getMemberTypeByParentId,
    memberTypeId: { type: UUIDType },
  },
});
