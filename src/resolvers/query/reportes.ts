import { IResolvers } from 'graphql-tools';

const reportesQuery: IResolvers = {
    Query : {
        reporteFacturas(_, {fechaIn , fechaFi, tipoComprobante}, { connection }) {
            const users = new Array(0);
            let sql = regresaSql(fechaIn, fechaFi, tipoComprobante);

            
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
                        idcomprobante: element.idcomprobante,
                        uuid: element.uuid,
                        fechaTimbrado: element.fechaTimbrado,
                        versionCFDI: element.versionCFDI,
                        versionComplemento: element.versionComplemento,
                        folio: element.folio,
                        serie: element.serie,
                        fechaFactura: element.fechaFactura,
                        tipoComprobante: element.tipoComprobante,
                        formaPago: element.formaPago,
                        metodoPago: element.metodoPago,
                        condicionPago: element.condicionPago,
                        moneda: element.moneda,
                        subtotal: element.subtotal,
                        total: element.total,
                        descuento: element.descuento,
                        lugarExpedicion: element.lugarExpedicion,
                        tipoCambio: element.tipoCambio,
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
    if(fechaIn!= "" && fechaFin != "" && tipoC ==""){
        consulta = `SELECT * FROM comprobante WHERE fechaFactura BETWEEN '${fechaIn}' AND '${fechaFin}'`;
    }else if(fechaIn == "" && fechaFin == "" && tipoC !="" ){
        consulta = `SELECT * FROM comprobante WHERE tipoComprobante = "${tipoC}"`;
    }else if(fechaIn!= "" && fechaFin != "" && tipoC !=""){
        consulta = `SELECT * FROM comprobante WHERE tipoComprobante = "${tipoC}" AND fechaFactura BETWEEN '${fechaIn}' AND '${fechaFin}'`;
    }else{
        consulta = "";
    }

    return consulta;
}