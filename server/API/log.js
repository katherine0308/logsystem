var common = require('../lib/common')
var maxLevel = common.config.maxLevel;
var moment = require('moment');
var levels = {"error": 1, "warn": 2, "info": 3};
// var request = require('request')

class Log {
    postCreate(req, res, next) {
        if(!req.body || !req.body.sSystem || !req.body.sLevel) {
            return res.status(200).send({code: 450, msg: "缺少参数", data: req.body})
        }

	if(levels[req.body.sLevel] > maxLevel) {
		return res.status(200).send({code: 454, msg: `系统设定，暂不接收${req.body.sLevel}等级日志`});
	}

        req.body.sSystemTime = new Date();

        // 发送给大数据一份
        // request.post({url: 'http://xxx', form: req.body}, function(err, response, data) { // TODO });
        
        var logM = common.helper.modelLoader('log');
        logM.create(req.body, function(err, result) {
            if(err) return res.status(500).send({code: 452, msg: "不合法的参数，请参看API文档", data: req.body})
            return res.status(200).send({code: 200, msg: 'success'});
        });
    }
}

module.exports = Log
