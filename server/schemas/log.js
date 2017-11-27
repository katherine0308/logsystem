var mongoose = require('mongoose')

var LogSchema = new mongoose.Schema({
    sUserName : String,
    sMethod : String,
    sIp : String,
    sUrl : String,
    sSystem: {type: String, enum: ["MSO", "CRM", "DS"]},
    sPart: String,
    sLevel: {type: String, enum: ["error", "warn", "info"]},
    sMark: String,
    sCreateTime : String,
    sSystemTime: Date,
    oOption : Object
})

module.exports = LogSchema
