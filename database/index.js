
const mysqlLib                      = require('./mysqlLib');
exports.initialize                  = initialize;


async function initialize(apiReference) {
    let config = {
        host              : "localhost",
        user              : "root",
        password          : "Oscor@123",
        database          : "sagarika",
        multipleStatements: true,
      }
  connection      = await mysqlLib.initialize(apiReference, config);
  
}


    