import { IResolvers } from 'graphql-tools';


const mutationTest: IResolvers = {
    Mutation : {
        async test(_: void, {bitacora}, {connection}): Promise<any>{
            return new Promise((resolve, reject) => {
                connection.query(
                  "INSERT INTO bitacora (id_bitacora, id_producto, b_cant, b_fecha, b_tipo, b_descripcion, id_empleado) VALUES (null, ?,?,?,?,?,?)",
                  [
                    bitacora.idproducto,
                    bitacora.cant,
                    bitacora.fecha,
                    bitacora.tipo,
                    bitacora.descripcion,
                    bitacora.idempleado
                    ],
                  function (error: any, results: any) {
                    if (error) {
                      reject(error);
                    }
                   // console.log(results);
                    //const userResponse = new Icategoria(results.insertId, categoria.nombre, categoria.img, categoria.status);
                    resolve(
                       {
                            status: true,
                            message: "bitacora agregada correctamente",
                            //categoria: userResponse
                       } 
                      
                    );
                  }
                );
            });
        },
        
    }
}

export default mutationTest;
