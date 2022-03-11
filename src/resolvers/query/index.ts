import GMR from "graphql-merge-resolvers";
import queryTest from "./clientes";
import reportesQuery from "./reportes";
import queryUser from "./user";

const queryResolvers = GMR.merge(
    [ 
        reportesQuery,
        queryUser,
        queryTest
    ]
);

export default queryResolvers;