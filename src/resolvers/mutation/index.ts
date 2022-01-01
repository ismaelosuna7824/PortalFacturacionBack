import GMR from "graphql-merge-resolvers";
import mutationTest from "./test";
import mutationUser from "./user";

const mutationResolvers = GMR.merge(
    [ 
        mutationUser, 
    ]
);

export default mutationResolvers;