// import { LIST_VENTA } from "../database/ventas";

// export async function getnewOrdes(conecction: any) {
//     try {
//         //const orderList : Array<any> = [];
//         var sql = LIST_VENTA;
//             const users = new Array(0);
//            // const ret = new Array(0);
//             return new Promise((resolve, reject) => {
//               conecction.query(sql, function (error: any, results: any) {
//                 if (error) {
//                   reject('');
//                 }
//                 const fecha = new Date();
//                 const mes =  String(fecha.getMonth() + 1).padStart(2, '0');
//                 const dia = String(fecha.getDate()).padStart(2, '0');
//                 const fechaHoy = `${fecha.getUTCFullYear()}-${mes}-${dia}`;
//                 //console.log(fechaHoy);
//                 // Resultado correcto
//                 for (const prod of results) {
//                     if( (new Date(`${prod.v_fechaProduccion}`).getTime() >= new Date(`${fechaHoy}`).getTime()))
//                     {
//                         users.push({
//                             idventa: prod.id_venta,
//                             fechaProduccion: new Date(prod.v_fechaProduccion).toLocaleDateString('en-CA'),
//                             horaEntrega: prod.v_horaEntrega
//                         });
//                     }else{
//                         //console.log("no");
//                     }
//                 }
//                 resolve(users);
//               });
//             //   setTimeout(() => {
//             //     resolve(users);
//             //   }, 3000);
            
//             }).then((res:any)=>{
//                 return res;
//             });
//     } catch (error) {
//         return {
//             mensaje: "error"
//         }
//     }
// }


// export async function getnewExist() {
//     try {
//         //const orderList : Array<any> = [];
//         return "cambio existencia";
//     } catch (error) {
//         return {
//             mensaje: "error"
//         }
//     }
// }