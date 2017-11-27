import moment from 'moment'

import alt from '../../alt'
import LogActions from './LogActions'

class LogStore {
  constructor() {
    this.bindActions(LogActions);
    this.logData = [];
    this.total = -1;
    this.logLimit = 500;
    this.systemInput = ['CRM', 'MSO', 'DS'];
    this.levelInput = ['ERROR', 'WARN', 'INFO'];
    this.dateRange = {
        from: moment().format('YYYY-MM-DD') + ' 00:00',
        to: moment().format('YYYY-MM-DD') + ' 23:59'
    };
    this.system = 'CRM';
    this.level = 'ERROR';
    this.dateLimit = 3;  //选择日期不应超过多少天
    this.searchClassName = 'index-search';
    this.titleClassName = 'index-title';
    this.urlShow = false;
    this.markShow = false;
    this.url = '';
    this.mark = '';
  }

  onPickDateRange(dateString) {
    this.dateRange.from = dateString[0];
    this.dateRange.to = dateString[1];
  }

  onGetSystem(system) {
    this.system = system;
  }

  onGetLevel(level) {
    this.level = level;
  }

  onFetchLogsSuccess(logData) {
    this.logData = logData.result;
    this.total = logData.total;
    this.searchClassName = 'detail-search';
    this.titleClassName = 'detail-title';
  }

  onChangeUrl(url) {
    this.url = url;
  }

  onChangeMark(mark) {
    this.mark = mark;
  }

  onShowInput() {
    this.urlShow = true;
    this.markShow = true;
  }

  onShowSelf() {
    this.systemInput.push('SELF');
  }
}

export default alt.createStore(LogStore);