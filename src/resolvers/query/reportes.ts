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
                      console.log(error)
                      resolve([])
                    }         
                    //console.log(results.length)           // Resultado correcto
                    results.forEach((element: any) => {
                      users.push({
                        uuid: element.uuid,
                        fechaTimbrado: element.fechaTimbrado,
                        tipoComprobante: element.tipoComprobante,
                        folio: element.folio,
                        // serie: element.serie,
                        total: element.total,
                        descuento: element.descuento,
                        totalImpuestoTrasladado: element.totalImpuestoTrasladado,
                        // totalImpuestoRetenido: element.totalImpuestoRetenido,
                        Metadata: element.Metadata,
                        rfcEmisor: element.rfcEmisor,
                        status: element.status,
                        fechaCancelacion: element.fechaCancelacion,
                        emitidos: element.emitidos,
                        nombreEmisor: element.nombreEmisor
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

          reporteMes(_, {year, status, emitidos, tipoComprobante}, { connection }) {  
            let comprobante = tipoComprobante == "I" ? "ingreso,I" : "egreso,E";
            //console.log(year)
            const users:any = new Array(0);
            return new Promise((resolve, reject) => {
             
                connection.query(`
                    SELECT MONTHNAME(fechaTimbrado) AS mes,
                        IFNULL(SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(metadata,'|',3), '|', -1)),0) AS Subtotal,
                          IFNULL(SUM(Descuento),0) AS Descuento,
                          IFNULL(SUM(totalImpuestoTrasladado),0) AS IVA_TRASLADADO,
                          IFNULL(SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(metadata,'|',9), '|', -1)),0) AS RIVA,
                          IFNULL(SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(metadata,'|',10), '|', -1)),0) AS RISR,
                          IFNULL(SUM(total),0) AS Total
                    FROM cfdi${year} 
                    WHERE 
                        STATUS = ${status} AND 
                        emitidos = ${emitidos} AND 
                        tipoComprobante IN ('${comprobante.split(',')[0]}','${comprobante.split(',')[1]}')
                    GROUP BY MONTHNAME(fechaTimbrado);
                `, function (error: any, results: any) {
                  
                    if (error) {
                      console.log(error)
                      resolve([])
                    }         
                    //console.log(results)           // Resultado correcto
                    results.forEach((element: any) => {
                      users.push({
                        mes: element.mes.toUpperCase(),
                        subtotal: element.Subtotal,
                        descuento: element.Descuento,
                        ivatraslado: element.IVA_TRASLADADO,
                        retencioniva: element.RIVA,
                        retencionisr: element.RISR,
                        total: element.Total
                      });
                      // console.log(element.Metadata)
                        //console.log(element)
                    });
                    let months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
                    
                   const temp = users.sort((a:any, b:any) => (a.mes - b.mes) || (months.indexOf(a.mes) - months.indexOf(b.mes)));
                   resolve(temp);
                    //  console.log()
                  });
             
            });


          }
    }
}

export default reportesQuery;

export const regresaSql = (fechaIn:string, fechaFin: string, tipoC:string) =>{
    let consulta = "";
    if(fechaIn != "" && fechaFin != "" && tipoC ==""){
      new Date(fechaIn.replace('-', '/')).getFullYear() != new Date(fechaFin.replace('-', '/')).getFullYear() ?  "" : consulta = `SELECT uuid, fechaTimbrado, tipoComprobante, rfcEmisor, folio, Metadata, total, status, fechaCancelacion, emitidos, descuento, nombreEmisor, totalImpuestoTrasladado FROM cfdi${new Date(fechaFin.replace('-', '/')).getFullYear()} WHERE fechaTimbrado BETWEEN '${fechaIn}T00:00:00' AND '${fechaFin}T23:59:59'`;
    }else if(fechaIn != " " && fechaFin == "" && tipoC !="" ){
      consulta = `SELECT uuid, fechaTimbrado, tipoComprobante, rfcEmisor, folio, Metadata, total, status, fechaCancelacion, emitidos, descuento, nombreEmisor, totalImpuestoTrasladado FROM cfdi${new Date(fechaIn.replace('-', '/')).getFullYear()} WHERE tipoComprobante = "${tipoC}"`;
    }else if(fechaIn!= "" && fechaFin != "" && tipoC !=""){
         new Date(fechaIn.replace('-', '/')).getFullYear() != new Date(fechaFin.replace('-', '/')).getFullYear() ?  "" :  consulta = `SELECT uuid, fechaTimbrado, tipoComprobante, rfcEmisor, folio, Metadata, total, status, fechaCancelacion, emitidos, descuento, nombreEmisor, totalImpuestoTrasladado FROM cfdi${new Date(fechaIn.replace('-', '/')).getFullYear()} WHERE tipoComprobante = "${tipoC}" AND fechaTimbrado BETWEEN '${fechaIn}T00:00:00' AND '${fechaFin}T23:59:59'`;
    }else{
        consulta = "";
    }

    return consulta;
}