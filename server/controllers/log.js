var common = require('../lib/common')
var co = require('co')
class Log {
    // list(req, res, next) {
    //     var _this = this, logM;
    //     if(req.query.page) {
    //         console.log(req.query.page)
    //         logM = common.helper.modelLoader(req.query.page);
    //     } else {
    //         return res.status(451).send({code: 451, msg: 'counld not find the page'})
    //     }

    //     co(function*() {
    //         let result = {
    //             data: [],
    //             current: Number(req.query.pagination.current) || 0,
    //             pageSize: Number(req.query.pagination.pageSize) || 0,
    //             total: 0
    //         }

    //         req.query = common.helper.recomposeQuery(req.query);

    //         result.data = yield _this.fetch(req, res, next, logM);
    //         result.total = yield _this.count(req, res, next, logM);

    //         return res.status(200).send(result)
    //     }).catch(e => {
    //         console.error(e)
    //         return res.status(500).send({code: 500, msg: 'list failed'})
    //     })
        
    // }

    // fetch(req, res, next, logM) {
    //     return new Promise((resolve, reject) => {
    //         logM.find(req.query.filters)
    //             .sort(req.query.sorter)
    //             .skip(req.query.skip)
    //             .limit(req.query.limit)
    //             .exec(function(err, result) {
    //                 if (err){
    //                     reject(err);
    //                 } else {
    //                     resolve(result);
    //                 }
    //             })
    //     })
    // }

    // count(req, res, next, logM) {
    //     return new Promise((resolve, reject) => {
    //         logM.count(req.query.filters)
    //             .exec(function(err, result) {
    //                 if (err){
    //                     reject(err);
    //                 } else {
    //                     resolve(result);
    //                 }
    //             })
    //     })
    // }

    list(req, res, next) {
        if(!req.query || !req.query.dateRange || !req.query.dateRange.from || !req.query.dateRange.to || !req.query.system || !req.query.level) {
            return res.status(451).send({code: 451, msg: '缺少必要的参数', eres: req.query})
        }

        var params = {
            sSystemTime: {$gte: new Date(req.query.dateRange.from), $lte: new Date(req.query.dateRange.to)},
            sSystem: req.query.system,
            sLevel: req.query.level
        }

        if(req.query.url) {
            params.sUrl = new RegExp(req.query.url);
        }

        if(req.query.mark) {
            params.sMark = req.query.mark;
        }

        console.log(params)

        var logM = common.helper.modelLoader('log');

        co(function*() {
            var total = yield logM.count(params);

            logM.find(params, {})
                .limit(500)
                .exec(function(err, result) {
                    if(err) return res.status(500).send({code: 500, msg: '', eres: err.toString()});
                    return res.status(200).send({result, total});
                })
        })
    }
}

module.exports = Log