import mysql from 'mysql';
const connection = mysql.createPool({
  host     : 'arafacturacion.webaccess.mx',
  user     : 'arafactu_ismael',
  password : 'Reposteria2021',
  database : 'arafactu_misspeper'
  // host     : 'localhost',
  // user     : 'root',
  // password : '',
  // database: 'arafactu_misspeper'

});
 
connection.getConnection(function (err, conecction){

  if(err){
    console.log("el error es " + err)
  }else{
    console.log("conectado correctamente");
  }


});
// connection(function(err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     console.log("entra aqui");
//     //setTimeout(handleDisconnect, 2000);
//     return;
//   }
 
//   console.log('connected as id ' + connection.threadId);
// });
export default connection;