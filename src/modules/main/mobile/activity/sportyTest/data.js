export const questions = [{
	topic: '1. Which position do you prefer ？',
	options: [{
		label: 'Forward',
		value: 100,
		no: 'A',
	}, {
		label: 'Midfield',
		value: 200,
		no: 'B',
	}, {
		label: 'Defender',
		value: 300,
		no: 'C',
	}, {
		label: 'Goalkeeper',
		value: 400,
		no: 'D'
	}],
}, {
	topic: '2.If your friend gives you an EPL ticket , while that day happens to be your father\'s birthday, what would you do ?',
	options: [{
		label: 'Give it to your father as a gift',
		value: 20,
		no: 'A',
	}, {
		label: 'Sell it to buy a new present',
		value: 40,
		no: 'B',
	}, {
		label: ' "Sorry, Papa" then go to watch the game',
		value: 60,
		no: 'C',
	}, {
		label: 'Buy another ticket and go with your father',
		value: 80,
		no: 'D'
	}]
}, {
	topic: '3. What number of uniform would you prefer? ',
	options: [{
		label: '7&9',
		value: 50,
		no: 'A',
	}, {
		label: '8&10',
		value: 100,
		no: 'B',
	}, {
		label: '1&3 ',
		value: 150,
		no: 'C',
	}, {
		label: 'I don\'t care',
		value: 200,
		no: 'D'
	}]
}, {
	topic: '4. How do your friends label you?',
	options: [{
		label: 'Adventurous',
		value: 20,
		no: 'A',
	}, {
		label: 'Handsome',
		value: 40,
		no: 'B',
	}, {
		label: 'Smart',
		value: 60,
		no: 'C',
	}, {
		label: 'Matured',
		value: 80,
		no: 'D'
	}]
}, {
	topic: '5. What do you pay more attention to when you watch a football match ？',
	options: [{
		label: 'Player\'s Individual Performance',
		value: 30,
		no: 'A',
	}, {
		label: 'The Whole Team\'s Cooperation Strategy ',
		value: 60,
		no: 'B',
	}, {
		label: 'Scores and Result',
		value: 90,
		no: 'C',
	}, {
		label: 'Players\' Handsome Look',
		value: 120,
		no: 'D'
	}]
}, {
	topic: '6. Where do you come across Sporty Test？',
	options: [{
		label: 'SportyBet Homepage',
		value: 10,
		no: 'A',
	}, {
		label: 'SportyBet Official Facebook Account',
		value: 20,
		no: 'B',
	}, {
		label: 'Referred by Your Friend',
		value: 30,
		no: 'C',
	}, {
		label: 'Forgot it',
		value: 40,
		no: 'D'
	}]
}];

export const PlayersPath = [{
	name: 'Aubameyang',
	reg: /ABD[BC][ACD]C/,
}, {
	name: 'Ozil',
	reg: /BADCBB/,
}, {
	name: 'Lacazette',
	reg: /ABAA[BC]D/,
}, {

	name: 'Cech',
	reg: /DDDDCC/,
}, {
	name: 'Hazard',
	reg: /ACBA[AB]C/,
}, {
	name: 'Kante',
	reg: /BAA[CD]BB/,
}, {
	name: 'Moses',
	reg: /CDDAAC/,
}, {
	name: 'Kepa',
	reg: /DDCB[CD]D/,
}, {
	name: 'Salah',
	reg: /ACD[BC][AC]C/,
}, {
	name: 'Firmino',
	reg: /ABAABA/,
}, {
	name: 'Henderson',
	reg: /BCDDBA/,
}, {
	name: 'Virgil Van Dijk',
	reg: /CDCD[BC]B/,
}, {
	name: 'Alisson',
	reg: /DADB[AD]B/,
}, {
	name: 'Aguero',
	reg: /ABBCAC/,
}, {
	name: 'Kevin De Bruyne',
	reg: /BAD[BC][AB]A/,
}, {
	name: 'Kompany',
	reg: /CACDBC/,
}, {
	name: 'Bravo',
	reg: /DDCDCD/,
}, {
	name: 'Lukaku',
	reg: /ACAA[AC]D/,
}, {
	name: 'Pogba',
	reg: /BBA[AB][BD]D/,
}, {
	name: 'Baily',
	reg: /CCCABB/,
}, {
	name: 'David De Gea',
	reg: /DBCBCD/,
}, {
	name: 'Kane',
	reg: /ADB[CD][AC]D/,
}, {
	name: 'Eriksen',
	reg: /BADC[BD]A/,
}, {
	name: 'Lloris',
	reg: /DCCD[BC]A/
}];

export default {
	questions,
	PlayersPath
};
