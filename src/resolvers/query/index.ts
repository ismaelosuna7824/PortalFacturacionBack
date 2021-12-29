import GMR from "graphql-merge-resolvers";
import queryTest from "./clientes";

const queryResolvers = GMR.merge(
    [ 
        queryTest
    ]
);

export default queryResolvers;