import GMR from "graphql-merge-resolvers";
import mutationTest from "./test";

const mutationResolvers = GMR.merge(
    [ 
        mutationTest, 
    ]
);

export default mutationResolvers;