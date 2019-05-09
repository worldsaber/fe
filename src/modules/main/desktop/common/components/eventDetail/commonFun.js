export function modifyCombineData(list) {
	const rowData = {};   // outcome根据该字段分组
	const colTitle = [];   // 直接显示

	let errorItem;

	for (const item of list) {
		const descArr = item.desc && item.desc.split('&') || '',
			tdTitle = descArr[0] && descArr[0].trim() || '',
			trTitle = descArr[1] && descArr[1].trim() || '';

		if (tdTitle && trTitle) {
			tdTitle && !colTitle.includes(tdTitle) && (colTitle.push(tdTitle));

			if (trTitle && !rowData[trTitle]) {
				rowData[trTitle] = [];
				rowData[trTitle].title = trTitle;
			}

			rowData[trTitle].push(item);
		} else {
			errorItem = item;
		}

		if (errorItem) {
			rowData[tdTitle] = [];
			rowData[tdTitle].title = tdTitle;
			rowData[tdTitle].push(errorItem);

			errorItem = null;
		}
	}

	return { colTitle, rowData, colCount: colTitle.length + 1 };
}

export function modifyData(data) {
	if (!data || !data.list) {
		return [];
	}
}

export function modifyListData(list) {
	const ret = [];
	if (list.length <= 3) {
		ret.push(list);
		return { rowData: ret, colCount: list.length };
	}

	if (list.length === 4) {
		ret.push(list.slice(0, 2));
		ret.push(list.slice(2));
		return { rowData: ret, colCount: 2 };
	}

	let spaceNum = list.length % 3 ? 3 - list.length % 3 : 0;
	while (spaceNum--) {
		list.push({
			space: ''
		});
	}

	while (list.length) {
		ret.push(list.splice(0, 3));
	}

	return { rowData: ret, colCount: 3 };
}
