import { formatNumber } from 'utils';

const dpConfig = window.depositCfg || {};

export const dpMin = dpConfig.min && +dpConfig.min || 0;

export const dpMax = dpConfig.max && +dpConfig.max || 70000;

export const transThreshold = window.transThreshold && +window.transThreshold || 140000;

export const showDpMax = formatNumber(dpMax, 2);

export const showTransThreshold = formatNumber(transThreshold, 2);
