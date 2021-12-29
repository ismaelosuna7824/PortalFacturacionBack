// import { IResolvers } from 'graphql-tools';

// const resolverTypesBitacora: IResolvers = {
//     Bitacora: {
//     productoDes(parent, __, { connection }) {
//       const users = new Array(0);
    
//       return new Promise((resolve, reject) => {
//         connection.query("SELECT p_descripcion FROM productos where id_producto = ?", [parent.idproducto], function (error: any, results: any) {
//           if (error) {
//             reject(users);
//           }
//           // Resultado correcto
//           results.forEach((element: any) => {
//             users.push({
//                 descripcion: element.p_descripcion
//             });
//           });
//             //console.log(users);
//               resolve(users);
         
//         });
//       });
//     },
    
//   },
// };
// export default resolverTypesBitacora;