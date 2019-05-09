import store from '../../store/index';

import leopard from './leopard.png';
import horse from './horse.png';
import bull from './bull.png';
import lion from './lion.png';

import share from './share.png';

import a from './a.png';
import an from './an.png';

import captain from './captain.png';
import ceo from './ceo.png';
import boss from './boss.png';
import manager from './manager.png';
import president from './president.png';
import trainer from './trainer.png';

import energetic from './energetic.png';
import versatile from './versatile.png';
import humble from './humble.png';
import jovial from './jovial.png';
import reliable from './reliable.png';
import talented from './talented.png';
import experienced from './experienced.png';
import dynamic from './dynamic.png';
import glow from './glow.png';

const { getters } = store;

const aMap = {
	a,
	an,
};

const animalMap = {
	captain: leopard,

	trainer: bull,
	boss: bull,

	manager: horse,

	ceo: lion,
	president: lion,
};
const nounMap = {
	ceo,
	president,

	manager,

	trainer,
	boss,

	captain,
};
const adjMap = {
	energetic,
	jovial,

	reliable,
	humble,

	experienced,
	dynamic,

	talented,
	versatile,
};

function getShare() {
	let noun = getters['annual/getNounText'];
	let adj = getters['annual/getAdjText'];
	noun = noun.toLowerCase();

	const arr = adj.split(' ');
	const unit = aMap[arr[0]];

	adj = arr[1].toLowerCase();

	const result = {
		animal: animalMap[noun],
		share,
		unit,
		noun: nounMap[noun],
		adj: adjMap[adj],
		glow,
	};
	return result;
}

export default getShare;
