const depositCfg = window.depositCfg || {};

export const despositMin = +depositCfg.min;
export const despositMax = +depositCfg.max;
export const despositThreshold = despositMax + 1;
