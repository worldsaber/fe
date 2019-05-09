import { getContactsNumber } from 'base/js/utils';

const withdrawCfg = window.withdrawCfg || {};

export const wdMin = +withdrawCfg.min;
export const wdMax = +withdrawCfg.max;
export const wdThreshold = wdMax + 1;
export const feeThreshold = +withdrawCfg.feeThreshold;
export const fee = +withdrawCfg.fee;

export const withdrawContactPhone = getContactsNumber();
