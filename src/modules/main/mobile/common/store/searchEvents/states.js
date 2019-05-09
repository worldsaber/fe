import { LS } from 'storage';
import { URL } from 'utils';
import sportsConfig from 'config/sports';

let searchList = LS.get('h5_search_list') || '[]';
searchList = JSON.parse(searchList);

const searchKey = URL.getPara('key') || '';

const state = {
	/*
	请求状态
	 */
	dataLoading: false,

	moreLoading: false,

	events: [],

	searchKey,

	searchList,

	sportList: [{
		id: '0',
		name: 'All'
	}, ...Object.values(sportsConfig).map(x => ({
		id: x.id.replace(/\D/g, ''),
		name: x.text
	}))],

	currentType: 0,

	pageModule: 'history',

	pageSize: 20,

	pageIndex: 0,

	errorInfo: null,

	total: 0
};
export default state;
