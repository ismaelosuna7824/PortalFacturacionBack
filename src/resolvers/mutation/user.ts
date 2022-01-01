import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';


const mutationUser: IResolvers = {
    Mutation : {
        async createUser(_: void, {usuario, contrasena}, {connection}): Promise<any>{
            let newP = bcrypt.hashSync(contrasena, 10);
            return new Promise((resolve, reject) => {
                connection.query(
                  "INSERT INTO usuarios (id_usuario, usuario, contrasena) VALUES (null, ?,?)",
                  [
                    usuario,
                    newP
                    ],
                  function (error: any, results: any) {
                    if (error) {
                        resolve(
                            {
                                 status: false,
                                 message: "ha ocurrido un error",
                                 //categoria: userResponse
                            } 
                           
                         );
                    }
                   // console.log(results);
                    //const userResponse = new Icategoria(results.insertId, categoria.nombre, categoria.img, categoria.status);
                    resolve(
                       {
                            status: true,
                            message: "Agregado Correctamente",
                            //categoria: userResponse
                       } 
                      
                    );
                  }
                );
            });
        },
        
    }
}

export default mutationUser;
