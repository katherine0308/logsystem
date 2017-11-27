import { notification } from 'antd';
import alt from '../../alt';

class LogActions
{
	constructor() {
		this.generateActions(
			'pickDateRange',
			'getSystem',
			'getLevel',
			'fetchLogsSuccess',
			'changeUrl',
			'changeMark',
			'showInput',
			'showSelf'
		)
	}

	fetchLogs(dateRange, system, level, url, mark) {
		if(!dateRange || !dateRange.from || !dateRange.to || !system || !level) {
			notification.warn({message: '缺少参数'});
			return false;
		}

		var data = {dateRange, system, level};
		if(url) {data.url = url};
		if(mark) {data.mark = mark};

		$.ajax({
			method: 'GET',
			url: '/sapi/log/list',
			data: data
		}).done(data => {
			this.actions.fetchLogsSuccess(data);
		}).fail(data => {
			notification.error({message: '服务器出错，请刷新后再试'});
		})
	}
}

export default alt.createActions(LogActions);