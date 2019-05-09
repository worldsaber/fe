import { formatNumber } from 'utils';

const wdConfig = window.withdrawCfg || {};

export const wdMin = wdConfig.min && +wdConfig.min || 10;

export const wdMax = wdConfig.max && +wdConfig.max || 70000;

export const wdFee = wdConfig.fee && +wdConfig.fee || 30;

export const transThreshold = window.transThreshold && +window.transThreshold || 140000;

export const showFee = formatNumber(wdFee, 2);

export const showWdMax = formatNumber(wdMax, 2);

export const showTransThreshold = formatNumber(transThreshold, 2);
