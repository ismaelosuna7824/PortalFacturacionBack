import mysql from 'mysql';
const connection = mysql.createPool({
  host     : '64.156.14.62',
  user     : 'ismael2021',
  password : 'ara2021!yu',
  database : 'dportenis'
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