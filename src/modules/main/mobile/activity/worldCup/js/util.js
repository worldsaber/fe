export const isDuringSpecialPeriod = Date.now() > Date.parse(new Date('2018/12/17')) && Date.now() < Date.parse(new Date('2018/12/23 23:59:59'));

export default {
	isDuringSpecialPeriod
};

