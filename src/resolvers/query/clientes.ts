import { IResolvers } from 'graphql-tools';

const queryTest: IResolvers = {
    Query : {
        testQuery(_, __, { connection }) {
            const users = new Array(0);
            var sql = "SELECT * from clientes";
            return new Promise((resolve, reject) => {
              connection.query(sql, function (error: any, results: any) {
                if (error) {
                  reject('');
                }
                // Resultado correcto
                results.forEach((element: any) => {
                  users.push({
                    id: element.id_clientes,
                    nombre: element.c_nombre,
                    apellidoPaterno: element.c_apellidoPaterno,
                    apellidoMaterno: element.c_apellidoMaterno,
                    email: element.c_email,
                    telefono: element.c_telefono,
                    calle: element.c_calle,
                    noExt: element.c_noExt,
                    noInt: element.c_Int,
                    colonia: element.c_colonia,
                    ciudad: element.c_ciudad,
                    fechaAlta: element.c_fechaAlta,
                    comentario: element.c_comentario,
                    status: element.c_status,
                    estado: element.c_estado
                  });
                    //console.log(element)
                });
                resolve(users);
                //console.log(results)
              });
            });
          },
    }
}

export default queryTest;