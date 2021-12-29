import { IResolvers } from "graphql-tools";
import { NEW_EXSIT } from "../../config/constants";

const new_exis: IResolvers = {
    Subscription: {
        muestraProductos: {
            subscribe: (_: void, __: any, { pubsub }) => {
                return pubsub.asyncIterator(NEW_EXSIT);
            }
        },


    }
}

export default new_exis;