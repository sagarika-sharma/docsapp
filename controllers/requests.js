
const apiReferenceModule                    = 'Controller';
var ObjectID                                = require('mongodb').ObjectID;

const _                                     = require('underscore');

const mysqlLib                                 = require('./../database/mysqlLib');
const responses                             = require('./../utilities/responses');
const constants                             = require('./../utilities/constants');

const moment                       = require('moment');

const schedule       = require('node-schedule');

exports.getRequests = getRequests;
exports.getAllRequests = getAllRequests;
exports.acceptBooking = acceptBooking;
exports.createBooking = createBooking;

async function getRequests(req,res){
    var apiReference = {
        module: "docsapp",
        api   : "getRequests"
    };
    try{
        let user_id        = req.body.user_id;  
        let driver_id      = req.body.driver_id;   
        let status         = req.body.status;               
        
        let sql = "SELECT * FROM tb_bookings WHERE driver_id = ?  AND booking_status = ? AND user_id = ? AND is_deleted=0 ";
        let params=[];
        if(status==1){
            params = [0,status,user_id]
        }
        else {
            params = [driver_id,status,user_id]
        }
        
        let bookings_data = await mysqlLib.mysqlQueryPromise(apiReference, sql, params);

        return responses.actionCompleteResponse(res, {bookings: bookings_data}); 
    }

    catch(error){
        return responses.sendCatchError(res, error);
     }
}

async function getAllRequests(req,res){
    var apiReference = {
        module: "docsapp",
        api   : "getAllRequests"
    };
    try{

        let user_id        = req.body.user_id;                
 
        let sql = "SELECT booking_id,created_datetime, TIMESTAMPDIFF(second,created_datetime,NOW()) AS time_elapsed,booking_status FROM tb_bookings WHERE  is_deleted=0 AND user_id = ? ";
        let params=[user_id];
        let bookings_data = await mysqlLib.mysqlQueryPromise(apiReference, sql, params);
        for(let i=0;i<bookings_data.length;i++){
            bookings_data[i].time_elapsed = getTimeDifferenceString(bookings_data[i].time_elapsed);
            bookings_data[i].created_datetime = moment(new Date(bookings_data[i].created_datetime)).format("YYYY-MM-DD HH:mm:ss");
        }
        
        return responses.actionCompleteResponse(res, {bookings: bookings_data});        
     }
    catch(error){
        return responses.sendCatchError(res, error);
     }
}
var getTimeDifferenceString = function (millies,opts) {
    function makeNumberEndingPlural(number) {
        return (Number(number) > 1) ? 's' : '';
    }

    var diffDate = new Date(millies);
    var diffDateKeys = {
        yr: diffDate.getFullYear() - 1970,
        mth: diffDate.getMonth(),
        day: diffDate.getDate(),
        hr: diffDate.getHours(),
        min: diffDate.getMinutes(),
        sec: diffDate.getSeconds()
    };
    if(opts && opts.not_display_sec) {
        diffDateKeys.sec = 0;
    }
    if ((diffDateKeys.day == 1 && diffDateKeys.mth == 0 && diffDateKeys.yr == 0 )
        || (diffDateKeys.hr == 0 && diffDateKeys.min == 0 && diffDateKeys.sec == 0)) {
        diffDateKeys.day -= 1;
    }
    var diffDateString = "";
    for (var key in diffDateKeys) {
        if (diffDateKeys[key] > 0) {
            diffDateString += diffDateKeys[key] + " " + key.toString() + makeNumberEndingPlural(diffDateKeys[key]) + " ";
        }
        if (key == "Minute" && diffDateString != "") {
            break;
        }
    }
    return diffDateString;
};


async function acceptBooking(req,res){
    var apiReference = {
        module: "docsapp",
        api   : "acceptBooking"
    };
    try{

        let user_id        = req.body.user_id;
        let booking_id     = req.body.booking_id;
        let driver_id      = req.body.driver_id;

        let sql = "SELECT booking_id FROM tb_bookings WHERE driver_id = ? AND booking_status = 2 AND user_id = ? AND is_deleted=0 ";
        let params = [driver_id,user_id];
        let check_progress_requests = await mysqlLib.mysqlQueryPromise(apiReference, sql, params);
        if(check_progress_requests.length){
            let msg = "Driver has request in progress."
            return responses.sendCustomResponse(res, msg,
            constants.responseFlags.SHOW_ERROR_MESSAGE, {}, apiReference)
        }
        
    
        sql = "SELECT booking_id FROM tb_bookings WHERE booking_id = ? AND booking_status = 1 AND user_id = ? AND is_deleted=0 ";
        params = [booking_id,user_id];
        let check_request_availability = await mysqlLib.mysqlQueryPromise(apiReference, sql, params);
        if(!check_request_availability.length){
            let msg = "Request no longer available."
            return responses.sendCustomResponse(res, msg,
            constants.responseFlags.SHOW_ERROR_MESSAGE, {}, apiReference)
        }

        sql = "UPDATE tb_bookings SET booking_status = 2, driver_id = ?, started_datetime= now()  WHERE booking_id = ? AND user_id = ? AND is_deleted=0 " ;
        await mysqlLib.mysqlQueryPromise(apiReference, sql, [driver_id,booking_id,user_id]);
        let refundTime = moment().add(1, 'minutes').format();
        schedule.scheduleJob(refundTime,async ()=>{ 
            sql = "UPDATE tb_bookings SET booking_status = 3, driver_id = ?, completed_datetime= now()  WHERE booking_id = ? AND user_id = ? AND is_deleted=0 " ;
            await mysqlLib.mysqlQueryPromise(apiReference, sql, [driver_id,booking_id,user_id]);

        });   

    return responses.actionCompleteResponse(res, {}); 
    }

    catch(error){
        return responses.sendCatchError(res, error);
     }
}

async function createBooking(req,res){
    var apiReference = {
        module: "docsapp",
        api   : "createBooking"
    };
    try{

        let user_id        = req.body.user_id;      
        let customer_id      = req.body.customer_id;
        
        let sql = "INSERT INTO tb_bookings (user_id, customer_id, created_datetime)" +
        "  VALUES (?,?,NOW())";
        let create_booking = await mysqlLib.mysqlQueryPromise(apiReference, sql, [user_id, customer_id]);   

    return responses.actionCompleteResponse(res, {booking_id: create_booking.insertId}); 
    }

    catch(error){
        return responses.sendCatchError(res, error);
     }
}
