var common = require('../lib/common')
var moment = require('moment')
// var request = require('request')

class Log {
    postCreate(req, res, next) {

        // 当并发到达xx时，停止接收info, warn等级的日志，并返回合理信息

        if(!req.body || !req.body.sSystem || !req.body.sLevel) {
            return res.status(200).send({code: 450, msg: "缺少参数", data: req.body})
        }

        req.body.sSystemTime = new Date();

        // 发送给大数据一份
        // request.post('http://xxx', req.body);
        
        var logM = common.helper.modelLoader('log');
        logM.create(req.body, function(err, result) {
            if(err) return res.status(500).send({code: 452, msg: "不合法的参数，请参看API文档", data: req.body})
            return res.status(200).send({code: 200, msg: 'success'});
        });
    }
}

module.exports = Log