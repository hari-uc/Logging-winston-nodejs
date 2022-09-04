const winston = require('winston');
require('winston-daily-rotate-file');
const { createLogger, format, transports, info } = require('winston');
const fs = require('fs')

require('dotenv').config();



var err_file = 'errors-%DATE%.log'   //log file name (eg. errors-2022-09-13.log)



var transport = new winston.transports.DailyRotateFile({
    filename: err_file,
    datePattern: 'YYYY-MM-DD',
    // prepend: true,
    zippedArchive: false,   //convert to zip ?
    frequency: '1d',   // in how many days the file has to be rotated
    // maxSize: '20m',
    maxFiles: '2'  // how many files has to be kept in stack?
  });



  transport.on('rotate', function(oldFilename, newFilename) {
  
    console.log("new file created")    // triggered when new file created

  });

  var logger = createLogger({
    format: format.combine(
        format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
  
            format.printf(info => JSON.stringify(` Level :  ${info.level} - TimeStamp :  ${[info.timestamp]} - Message :  ${info.message} `)),
  
    )
  });




if (process.env.NODE_ENV === 'PRODUCTION') {  //runs if environment in production

    console.log("production running")

    var logger = createLogger({
      format: format.combine(
          format.timestamp({
              format: 'MMM-DD-YYYY HH:mm:ss'
          }),
    
              format.printf(info => JSON.stringify(` Level :  ${info.level} - TimeStamp :  ${[info.timestamp]} - Message :  ${info.message} `)),
    
      ),
      transports:[
        transport  //including transport only for production (i.e saving logs only in production)
      ]
    });

    
    logger.add(new transports.File({ filename: err_file, level: 'error' }));
    // logger.add(new transports.File({ filename: 'log/output/warn.log', level: 'warn' }));
    // logger.add(new transports.File({ filename: 'log/output/info.log', level: 'info' }));

}else {
    console.log("dev running")
    logger.add(new transports.Console({ format: winston.format.cli() }));   //for drvelopment only logging in terminal

    // Turn these on to create logs as if it were production
    // logger.add(new transports.Console({ format: winston.format.simple(), level: 'error' }));
    // logger.add(new transports.File({ filename: 'log/output/warn.log', level: 'warn' }));
    // logger.add(new transports.File({ filename: 'log/output/info.log', level: 'info' }));

}





module.exports = {
    logger,
    transport
};