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
                      resolve([])
                    }                    // Resultado correcto
                    results.forEach((element: any) => {
                      users.push({
                        uuid: element.uuid,
                        fechaTimbrado: element.fechaTimbrado,
                        tipoComprobante: element.tipoComprobante,
                        folio: element.folio,
                        // serie: element.serie,
                        total: element.total,
                        descuento: element.descuento,
                        // totalImpuestoTrasladado: element.totalImpuestoTrasladado,
                        // totalImpuestoRetenido: element.totalImpuestoRetenido,
                        Metadata: element.Metadata,
                        rfcEmisor: element.rfcEmisor,
                        status: element.status,
                        fechaCancelacion: element.fechaCancelacion,
                        emitidos: element.emitidos
                        // nombreEmisor: element.nombreEmisor
                      });
                      // console.log(element.Metadata)
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
      new Date(fechaIn.replace('-', '/')).getFullYear() != new Date(fechaFin.replace('-', '/')).getFullYear() ?  "" : consulta = `SELECT uuid, fechaTimbrado, tipoComprobante, rfcEmisor, folio, Metadata, total, status, fechaCancelacion, emitidos, descuento FROM cfdi${new Date(fechaFin.replace('-', '/')).getFullYear()} WHERE fechaTimbrado BETWEEN '${fechaIn}' AND '${fechaFin}'`;
    }else if(fechaIn != " " && fechaFin == "" && tipoC !="" ){
      consulta = `SELECT uuid, fechaTimbrado, tipoComprobante, rfcEmisor, folio, Metadata, total, status, fechaCancelacion, emitidos, descuento FROM cfdi${new Date(fechaIn.replace('-', '/')).getFullYear()} WHERE tipoComprobante = "${tipoC}"`;
    }else if(fechaIn!= "" && fechaFin != "" && tipoC !=""){
         new Date(fechaIn.replace('-', '/')).getFullYear() != new Date(fechaFin.replace('-', '/')).getFullYear() ?  "" :  consulta = `SELECT uuid, fechaTimbrado, tipoComprobante, rfcEmisor, folio, Metadata, total, status, fechaCancelacion, emitidos, descuento FROM cfdi${new Date(fechaIn.replace('-', '/')).getFullYear()} WHERE tipoComprobante = "${tipoC}" AND fechaTimbrado BETWEEN '${fechaIn}' AND '${fechaFin}'`;
    }else{
        consulta = "";
    }

    return consulta;
}