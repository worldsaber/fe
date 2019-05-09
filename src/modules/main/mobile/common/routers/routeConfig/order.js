import { fixRoutes } from './sportsBetHistory.js';
import jackpotRoute from './jackpotBetHistory.js';

export const routes = [...fixRoutes, ...jackpotRoute];

export default routes;
