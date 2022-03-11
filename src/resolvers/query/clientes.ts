import { IResolvers } from 'graphql-tools';
import * as XLSX from 'xlsx';
import fs from 'fs';
import { regresaSql } from './reportes';
import util from 'util'; 

let foods: any[] = [
  {value: '', viewValue: 'Todos'},
  {value: 'I', viewValue: 'Ingreso'},
  {value: 'E', viewValue: 'Egreso'},
];

const queryTest: IResolvers = {
    Query : {
        testQuery(_, {fechaIn, fechaFi, tipoComprobante, emitidos, pagination, totales}, { connection }) {
            const users = new Array(0);

            //console.log(pagination);

            return new Promise(async (resolve, reject) => {
               
              
              try {
                let query = util.promisify(connection.query).bind(connection);
              
                for (const key in pagination) {
                  let sql = regresaSql(fechaIn, fechaFi, tipoComprobante, pagination[key].split('-')[0], pagination[key].split('-')[1], emitidos);
                  const resp = await  query(sql);
  
                    resp.forEach((element: any) => {
                      users.push({
                        "UUID": element.uuid,
                        "FECHA FACTURA": `${element.fechaTimbrado.split("T")[0]}-${element.fechaTimbrado.split("T")[1].substring(0,8)}`,
                        "FORMA DE PAGO": `${element.Metadata.split('|')[0] == undefined ? '' : element.Metadata.split('|')[0]}`,
                        "METODO DE PAGO": `${element.Metadata.split('|')[1] == undefined ? '' : element.Metadata.split('|')[1]}`,
                        "RFC RECEPTOR": `${element.Metadata.split('|')[3] == undefined ? '' : element.Metadata.split('|')[3]}`,
                        "NOMBRE RECEPTOR": `${element.Metadata.split('|')[4] == undefined ? '' : element.Metadata.split('|')[4]}`,
                        "RFC EMISOR": `${element.rfcEmisor}`,
                        "NOMBRE EMISOR": `${element.nombreEmisor}`,
                        "VERSION": `${element.Metadata.split('|')[5] == undefined ? '' : element.Metadata.split('|')[5]}`,
                        "TIPO DE RELACION": `${element.Metadata.split('|')[6] == undefined ? '' : element.Metadata.split('|')[6]}`,
                        "TIPO COMPROBANTE": `${element.tipoComprobante == "I" || element.tipoComprobante == "ingreso" ? "Ingreso" : "Egreso"}`,
                        "FOLIO": `${element.folio}`,
                        "SUBTOTAL":element.Metadata.split('|')[2] == undefined || element.Metadata.split('|')[2] == "" ? 0 : parseFloat(element.Metadata.split('|')[2]),
                        "DESCUENTO": element.descuento == undefined || element.descuento == ""  ? 0 : parseFloat(element.descuento),
                        "IVA TRASLADO":element.totalImpuestoTrasladado == undefined || element.totalImpuestoTrasladado == "" ? 0 : parseFloat(element.totalImpuestoTrasladado),
                        "RETENCION IVA": element.Metadata.split('|')[8] == undefined || element.Metadata.split('|')[8] == "" ? 0 : parseFloat(element.Metadata.split('|')[8]),
                        "RETENCION ISR": element.Metadata.split('|')[9] == undefined || element.Metadata.split('|')[9] == "" ? 0 : parseFloat(element.Metadata.split('|')[9]),
                        "TOTAL": element.total == undefined || element.total == "" ? 0 : parseFloat(element.total), 
                        "STATUS":  `${element.status == 1 ? 'Activa' : 'Cancelada'}`,
                        "FECHA DE CANCELACION":  `${element.fechaCancelacion == null ? '0000-00-00' : element.fechaCancelacion}`,
                      });
                      // console.log(element.Metadata)
                        //console.log(element)
                    });
                   // console.log(resp);
                 
                }
  
  
  
  
                let dat = new Date();
  
                const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(users);
                const worktotal: XLSX.WorkSheet = XLSX.utils.json_to_sheet(totales);
                const workbook: XLSX.WorkBook = {
                  Sheets: {
                      'data': worksheet, 'total': worktotal
                  },
                  SheetNames: ['data', 'total']
                };
            
              XLSX.writeFile(workbook, `files/${fechaIn}-${dat.getSeconds()}-${dat.getMilliseconds()}.xlsx`);
  
              resolve({url: `files/${fechaIn}-${dat.getSeconds()}-${dat.getMilliseconds()}.xlsx`})
                  //console.log(json)
             
                  // fs.readdir('files', function(ee, archi){
                  //   console.log(archi)
                  //   archi.forEach((value:any)=>{
                  //     fs.unlink(`files/${value}`, ()=>{});
                  //   })
                  // })
                 
  
              } catch (error) {
                resolve({url: ''})
              }
            });
          },
    }
}

export default queryTest;


