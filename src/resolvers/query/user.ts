import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';
import JWT from '../../lib/jwt';
const queryUser: IResolvers = {
    Query : {
        login(_, {usuario, contrasena}, { connection }) {
            //console.log(usuario)
            const users = new Array(0);
            var sql = `SELECT * from usuarios WHERE usuarios.usuario = '${usuario}' `;
            return new Promise((resolve, reject) => {
              connection.query(sql, function (error: any, results: any) {
                if (error) {
                  resolve({status: false, token: ""})
                }
                if(results.length == 0){
                    resolve({
                      token: "",
                      status: false
                    });
                  }else{
                    if(bcrypt.compareSync(contrasena, results[0].contrasena)){
                      resolve({
                        status: true,
                        token: new JWT().sign({ usuario })
                      });
                    }else{
                      resolve({
                        status: false,
                        token: ""
                      });
                    }
                  }
                resolve(users);
                //console.log(results)
              });
            });
          },
          me(_: void, __: any, { token }) {
              console.log(token)
            let info: any = new JWT().verify(token);
            if (info === 'La autenticación del token es inválida. Por favor, inicia sesión para obtener un nuevo token') {
                return {
                    status: false,
                }
            }
            return {
                status: true,
            }
        }
    }
}

export default queryUser;