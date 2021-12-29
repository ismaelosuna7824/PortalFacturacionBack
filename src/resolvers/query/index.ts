import GMR from "graphql-merge-resolvers";
import queryTest from "./clientes";
import reportesQuery from "./reportes";

const queryResolvers = GMR.merge(
    [ 
        reportesQuery
    ]
);

export default queryResolvers;