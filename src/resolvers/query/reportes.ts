import { IResolvers } from 'graphql-tools';
import util from 'util'; 


const reportesQuery: IResolvers = {
    Query : {
        reporteFacturas(_, {fechaIn , fechaFi, tipoComprobante, limitA, limitB, emitidos}, { connection }) {
            const users = new Array(0);
            let sql = regresaSql(fechaIn, fechaFi, tipoComprobante, limitA, limitB, emitidos);

            //console.log(sql)
            
            return new Promise((resolve, reject) => {
              if(sql == ""){
                resolve([])
              }else{

                

                //console.log(paginate);
                connection.query(sql, function (error: any, results: any) {
                    if (error) {
                      console.log(error)
                      resolve([])
                    }         
                    // console.log(results.length)
                   //console.log(results.length)           // Resultado correcto
                    // results.forEach((element: any) => {
                    //   users.push({
                    //     uuid: element.uuid,
                    //     fechaTimbrado: element.fechaTimbrado,
                    //     tipoComprobante: element.tipoComprobante,
                    //     folio: element.folio,
                    //     // serie: element.serie,
                    //     total: element.total,
                    //     descuento: element.descuento,
                    //     totalImpuestoTrasladado: element.totalImpuestoTrasladado,
                    //     // totalImpuestoRetenido: element.totalImpuestoRetenido,
                    //     Metadata: element.Metadata,
                    //     rfcEmisor: element.rfcEmisor,
                    //     status: element.status,
                    //     fechaCancelacion: element.fechaCancelacion,
                    //     emitidos: element.emitidos,
                    //     nombreEmisor: element.nombreEmisor
                    //   });
                    //   // console.log(element.Metadata)
                    //     //console.log(element)
                    // });
                   resolve(results);
                    //console.log(results)
                  });
              }
            });
          
          },

         async conteoFactura(_, {fechaIn , fechaFi, tipoComprobante, emitidos}, { connection }) {
            const users = new Array(0);
            let sql = regresaSql2(fechaIn, fechaFi, tipoComprobante, emitidos);

            // console.log(sql)
            
            return new Promise((resolve, reject) => {
              if(sql == ""){
                resolve([])
              }else{

                

                //console.log(paginate);
                connection.query(sql, function (error: any, results: any) {
                    if (error) {
                      console.log(error)
                      resolve([])
                    }         
                    resolve({total: results[0]['COUNT(uuid)']});
                    //console.log(results)
                  });
              }
            });
          
          },

        async  reporteMes(_, {year, status, emitidos, tipoComprobante}, { connection }) {  
            let comprobante = tipoComprobante == "I" ? "ingreso,I" : "egreso,E";
            //console.log(year)
            const users:any = new Array(0);
            return new Promise(async (resolve, reject) => {
             
                
             for (let index = 1; index < 13; index++) {
               
              //let firstDay = new Date(year, index, 1);
              let query = util.promisify(connection.query).bind(connection);
              let  endDay = new Date(year, index, 0);
             
               const resp = await  query(`
                SELECT MONTHNAME(fechaTimbrado) AS mes, IFNULL(SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(metadata,'|',3), '|', -1)),0) AS Subtotal,
                IFNULL(SUM(Descuento),0) AS Descuento,
                IFNULL(SUM(totalImpuestoTrasladado),0) AS IVA_TRASLADADO,
                IFNULL(SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(metadata,'|',9), '|', -1)),0) AS RIVA,
                IFNULL(SUM(SUBSTRING_INDEX(SUBSTRING_INDEX(metadata,'|',10), '|', -1)),0) AS RISR,
                IFNULL(SUM(total),0) AS Total
                FROM cfdi${year}
                WHERE fechaTimbrado BETWEEN '${year}-${index.toString().length == 1 ? index.toString().padStart(2, '0') : index}-01T00:00:00' AND '${year}-${index.toString().length == 1 ? index.toString().padStart(2, '0') : index}-${endDay.getDate()}T23:59:59' AND STATUS = ${status} AND emitidos = ${emitidos} AND tipoComprobante IN ('${comprobante.split(',')[0]}','${comprobante.split(',')[1]}')
                GROUP BY MONTHNAME(fechaTimbrado);`);

                  resp.forEach((element: any) => {
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


            


             }
          
             resolve(users);
            });
          },
          async reporteTotal(_, {fechaIn , fechaFi, tipoComprobante, emitidos, egreso, ingreso}, { connection }) {
            const users = new Array(0);

            let sql = regresaSql3(fechaIn , fechaFi, tipoComprobante, emitidos, egreso, ingreso);

            //console.log(query)
            // let sql = regresaSql2(fechaIn, fechaFi, tipoComprobante, emitidos);

             //console.log(sql)
              
            return new Promise((resolve, reject) => {
              if(sql == ""){
                resolve([])
              }else{

                

                //console.log(paginate);
                connection.query(sql, function (error: any, results: any) {
                    if (error) {
                      console.log(error)
                      resolve([])
                    } 
                    //console.log(results)        
                    resolve(results);
                    //console.log(results)
                  });
              }
            });
          
          },
    }
}

export default reportesQuery;

export const regresaSql = (fechaIn:string, fechaFin: string, tipoC:string, limitA:number, limitB:number, emitidos:number) =>{
    let consulta = "";
    if(fechaIn != "" && fechaFin != "" && tipoC ==""){
      new Date(fechaIn.replace('-', '/')).getFullYear() != new Date(fechaFin.replace('-', '/')).getFullYear() ?  "" : consulta = `SELECT uuid, fechaTimbrado, tipoComprobante, rfcEmisor, folio, Metadata, total, status, fechaCancelacion, emitidos, descuento, nombreEmisor, totalImpuestoTrasladado FROM cfdi${new Date(fechaFin.replace('-', '/')).getFullYear()} WHERE fechaTimbrado BETWEEN '${fechaIn}T00:00:00' AND '${fechaFin}T23:59:59' and emitidos = ${emitidos}  LIMIT ${limitA} OFFSET ${limitB}`;
    }else if(fechaIn != " " && fechaFin == "" && tipoC !="" ){
      consulta = `SELECT uuid, fechaTimbrado, tipoComprobante, rfcEmisor, folio, Metadata, total, status, fechaCancelacion, emitidos, descuento, nombreEmisor, totalImpuestoTrasladado FROM cfdi${new Date(fechaIn.replace('-', '/')).getFullYear()} WHERE tipoComprobante = "${tipoC}"`;
    }else if(fechaIn!= "" && fechaFin != "" && tipoC !=""){
         new Date(fechaIn.replace('-', '/')).getFullYear() != new Date(fechaFin.replace('-', '/')).getFullYear() ?  "" :  consulta = `SELECT uuid, fechaTimbrado, tipoComprobante, rfcEmisor, folio, Metadata, total, status, fechaCancelacion, emitidos, descuento, nombreEmisor, totalImpuestoTrasladado FROM cfdi${new Date(fechaIn.replace('-', '/')).getFullYear()} WHERE tipoComprobante = "${tipoC}" AND fechaTimbrado BETWEEN '${fechaIn}T00:00:00' AND '${fechaFin}T23:59:59' and emitidos = ${emitidos} LIMIT ${limitA} OFFSET ${limitB}`;
    }else{
        consulta = "";
    }

    return consulta;
}


export const regresaSql2 = (fechaIn:string, fechaFin: string, tipoC:string, emitidos: number) =>{
  let consulta = "";
  if(fechaIn != "" && fechaFin != "" && tipoC ==""){
    new Date(fechaIn.replace('-', '/')).getFullYear() != new Date(fechaFin.replace('-', '/')).getFullYear() ?  "" : consulta = `SELECT COUNT(uuid) FROM cfdi${new Date(fechaFin.replace('-', '/')).getFullYear()} WHERE fechaTimbrado BETWEEN '${fechaIn}T00:00:00' AND '${fechaFin}T23:59:59' and emitidos = ${emitidos} `;
  }else if(fechaIn != " " && fechaFin == "" && tipoC !="" ){
    consulta = `SELECT uuid, fechaTimbrado, tipoComprobante, rfcEmisor, folio, Metadata, total, status, fechaCancelacion, emitidos, descuento, nombreEmisor, totalImpuestoTrasladado FROM cfdi${new Date(fechaIn.replace('-', '/')).getFullYear()} WHERE tipoComprobante = "${tipoC}"`;
  }else if(fechaIn!= "" && fechaFin != "" && tipoC !=""){
       new Date(fechaIn.replace('-', '/')).getFullYear() != new Date(fechaFin.replace('-', '/')).getFullYear() ?  "" :  consulta = `SELECT COUNT(uuid) FROM cfdi${new Date(fechaIn.replace('-', '/')).getFullYear()} WHERE tipoComprobante = "${tipoC}" AND fechaTimbrado BETWEEN '${fechaIn}T00:00:00' AND '${fechaFin}T23:59:59' and emitidos = ${emitidos} `;
  }else{
      consulta = "";
  }

  return consulta;
}


export const regresaSql3 = (fechaIn:string , fechaFin:string, tipoComprobante:string, emitidos:number, egreso:string, ingreso: string)=>{
  let consulta = ""

    new Date(fechaIn.replace('-', '/')).getFullYear() != new Date(fechaFin.replace('-', '/')).getFullYear() ?  "" : consulta = ` SELECT 
   COUNT(UUID) AS totalRegistros, 
   SUM(IF(tipoComprobante = '${egreso}',total,0))AS totalEgresos,
   SUM(IF(tipoComprobante = '${ingreso}',total,0))AS totalIngresos,
   SUM(total) AS totalGeneral,
   IFNULL(SUM(IF(STATUS = 1, SUBSTRING_INDEX(SUBSTRING_INDEX(metadata,'|',3), '|', -1), 0)), 0) AS subtotal,
   SUM(IF(STATUS = 1,descuento,0))AS descuento,
   SUM(IF(STATUS = 1,totalImpuestoTrasladado,0))AS ivatraslado,
   IFNULL(SUM(IF(STATUS = 1, SUBSTRING_INDEX(SUBSTRING_INDEX(metadata,'|',9), '|', -1), 0)), 0) AS retencioniva,
   IFNULL(SUM(IF(STATUS = 1, SUBSTRING_INDEX(SUBSTRING_INDEX(metadata,'|',10), '|', -1), 0)), 0) AS retencionisr,
   SUM(IF(STATUS = 1,total,0))AS total,
   IFNULL(SUM(IF(STATUS = 0, SUBSTRING_INDEX(SUBSTRING_INDEX(metadata,'|',3), '|', -1), 0)), 0) AS subtotalC,
   SUM(IF(STATUS = 0,descuento,0))AS descuentoC,
   SUM(IF(STATUS = 0,totalImpuestoTrasladado,0))AS ivatrasladoC,
   IFNULL(SUM(IF(STATUS = 0, SUBSTRING_INDEX(SUBSTRING_INDEX(metadata,'|',9), '|', -1), 0)), 0) AS retencionivaC,
   IFNULL(SUM(IF(STATUS = 0, SUBSTRING_INDEX(SUBSTRING_INDEX(metadata,'|',10), '|', -1), 0)), 0) AS retencionisrC,
   SUM(IF(STATUS = 0,total,0))AS totalC
   FROM cfdi${new Date(fechaIn.replace('-', '/')).getFullYear()} WHERE  fechaTimbrado BETWEEN '${fechaIn}T00:00:00' AND '${fechaFin}T23:59:59' AND emitidos = ${emitidos} ${ tipoComprobante != "" ? `AND tipoComprobante = '${tipoComprobante}' ` : ''  }`
  return consulta
}