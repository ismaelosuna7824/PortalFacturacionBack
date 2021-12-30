import { IResolvers } from 'graphql-tools';

const reportesQuery: IResolvers = {
    Query : {
        reporteFacturas(_, {fechaIn , fechaFi, tipoComprobante}, { connection }) {
            const users = new Array(0);
            let sql = regresaSql(fechaIn, fechaFi, tipoComprobante);

            //console.log(sql)
            
            return new Promise((resolve, reject) => {
              if(sql == ""){
                resolve([])
              }else{
                connection.query(sql, function (error: any, results: any) {
                    if (error) {
                      reject('');
                    }
                    // Resultado correcto
                    results.forEach((element: any) => {
                      users.push({
                        uuid: element.uuid,
                        fechaTimbrado: element.fechaTimbrado,
                        tipoComprobante: element.tipoComprobante,
                        folio: element.folio,
                        serie: element.serie,
                        total: element.total,
                        descuento: element.descuento,
                        totalImpuestoTrasladado: element.totalImpuestoTrasladado,
                        totalImpuestoRetenido: element.totalImpuestoRetenido,
                        Metadata: element.Metadata,
                        rfcEmisor: element.rfcEmisor,
                        nombreEmisor: element.nombreEmisor
                      });
                        //console.log(element)
                    });
                    resolve(users);
                    //console.log(results)
                  });
              }
            });
          
          },
    }
}

export default reportesQuery;

export const regresaSql = (fechaIn:string, fechaFin: string, tipoC:string) =>{
    let consulta = "";
    if(fechaIn != "" && fechaFin != "" && tipoC ==""){
      new Date(fechaIn.replace('-', '/')).getFullYear() != new Date(fechaFin.replace('-', '/')).getFullYear() ?  "" : consulta = `SELECT * FROM cfdi2021 WHERE fechaTimbrado BETWEEN '${fechaIn}' AND '${fechaFin}'`;
    }else if(fechaIn != " " && fechaFin == "" && tipoC !="" ){
      consulta = `SELECT * FROM cfdi2021 WHERE tipoComprobante = "${tipoC}"`;
    }else if(fechaIn!= "" && fechaFin != "" && tipoC !=""){
         new Date(fechaIn.replace('-', '/')).getFullYear() != new Date(fechaFin.replace('-', '/')).getFullYear() ?  "" : console.log(),  consulta = `SELECT * FROM cfdi2021 WHERE tipoComprobante = "${tipoC}" AND fechaFactura BETWEEN '${fechaIn}' AND '${fechaFin}'`;
    }else{
        consulta = "";
    }

    return consulta;
}