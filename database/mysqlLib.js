const mysql                                           = require('mysql');
const logging                                         = require('./../logging/logging');

exports.mysqlQueryPromise                             = mysqlQueryPromise;
exports.initialize                                    = initialize;

function initialize(apiReference, config) {
  let numConnectionsInPool = 0;
  logging.log(apiReference, "STARTING MYSQL CONNECTION @ ");
  console.log('mysql connection creds', JSON.stringify(config));
  let conn = mysql.createPool(config);
  console.log("$$",conn);
  conn.on('connection', function (connection) {
    console.log("%%%CONNECTED");
    numConnectionsInPool++;
    console.log('CONNECTION IN POOL : ', numConnectionsInPool);
  });
  conn.on('error', function (error) {
    logging.logError(apiReference, {EVENT : "MYSQL_CONN_ERROR",  ERROR : error});
    return initialize(apiReference, config);
  });
  logging.log(apiReference, "MYSQL CONNECTED @ ");
  return conn;
}

function mysqlQueryPromise(apiReference, queryString, params, noErrorlog, transactionConnection) {
  let event = "EXECUTING QUERRY";
  return new Promise((resolve, reject) => {
    let newConnection;
    if (transactionConnection) {
      newConnection = transactionConnection;
    } else {
      newConnection = connection;
    }
    if (!apiReference) {
      apiReference = {
        module: "mysqlLib",
        api   : "executeQuery"
      }
    }
    let query = newConnection.query(queryString, params, function (sqlError, sqlResult) {
      logging.log(apiReference, {
        EVENT            : "Executing query " + event,
        QUERY            : query.sql,
        SQL_ERROR        : sqlError,
        SQL_RESULT       : sqlResult,
        SQL_RESULT_LENGTH: sqlResult && sqlResult.length,
        params           : params
      });
      if (sqlError || !sqlResult) {
        if (sqlError) {
          console.error(query.sql, sqlError);
          if (!noErrorlog) {
            logging.logError(apiReference, {EVENT: event, ERR: sqlError, RESULT: sqlResult, SQL: query.sql});
          }
          if (sqlError.code === 'ER_LOCK_DEADLOCK' || sqlError.code === 'ER_QUERY_INTERRUPTED') {
            setTimeout(module.exports.mysqlQueryPromise.bind(null, apiReference, event, queryString, params, noErrorlog, newConnection), 50);
          } else {
            return reject({ERROR: sqlError, QUERY: query.sql, EVENT: event, params: params, SQL: this.sql});
          }
        }
      }
      return resolve(sqlResult);
    });
  });
}
