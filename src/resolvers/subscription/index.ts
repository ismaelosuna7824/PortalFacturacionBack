import GMR from "graphql-merge-resolvers";
// import new_order from "./newOrderSubscription";
// import new_exis from './newExistencia';
const subscriptionResolvers = GMR.merge(
    [
        //  new_order,
        //  new_exis
    ]
);

export default subscriptionResolvers;