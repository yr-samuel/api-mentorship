/* connect to mongoose - that provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.*/

const mongoose = require('mongoose');

/* connecting mongoose to database and creating a database called mern-pool*/
 mongoose.connect("mongodb://localhost:27017/angular-project", { useNewUrlParser: true }); 

 /* remove alerts from console*/ 
 mongoose.set('useCreateIndex', true);


module.exports = mongoose.connection;