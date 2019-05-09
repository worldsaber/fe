/**
 * Mocking client-server processing
 */

import mockjax from 'mock';

const _mobileSports = [{
        content: 'Home',
    }, {
        content: 'Soccer',
        extra: '2 Events'
    },
    {
        content: 'basketball',
        extra: '5 Events'
    },
    {
        content: 'tennis',
        extra: '7 Events'
    },
    {
        content: 'rugby',
        extra: 'Today none'
    },
    {
        content: 'cricket',
        extra: '2 Events'
    }
];

mockjax.get('test/fucking', _mobileSports);