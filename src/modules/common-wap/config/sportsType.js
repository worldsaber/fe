import invert from 'utils/invert';

export const sportConfigLowerCase = {
	1: 'football',
	2: 'basketball',
	5: 'tennis',
	12: 'rugby',
	21: 'cricket'
};

export const sportConfigUpperCase = {
	1: 'Football',
	2: 'Basketball',
	5: 'Tennis',
	12: 'Rugby',
	21: 'Cricket'
};

export const sportListUpperCase = [
	{
		id: '1',
		name: 'Football'
	}, {
		id: '2',
		name: 'Basketball'
	}, {
		id: '5',
		name: 'Tennis'
	}, {
		id: '12',
		name: 'Rugby'
	}, {
		id: '21',
		name: 'Cricket'
	}
];

export const sportListLowerCase = sportListUpperCase.map(cur => ({
	...cur,
	name: cur.name.toLowerCase()
}));

export const sportType2Id = (() => invert(sportConfigLowerCase))();

export const sportTypes = Object.values(sportConfigLowerCase);
