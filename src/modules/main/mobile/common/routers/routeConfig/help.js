import { helpMap } from '../../../help/js/bridge.js';
import HelpContainer from '../../../help/pagelet/help-container';
import ContactUs from '../../../help/pagelet/contact-us';

const country = (__baseUrl__).replace(/\//g, '') || 'ke'; // eslint-disable-line

const mapRoutes = function (obj, status, parentRoute) {
	status++; // eslint-disable-line
	return Object.entries(obj).map(([k, v]) => {
		const r = {
			path: parentRoute ? `${parentRoute}/${k}` : `/${k}`,
			name: v.name,
			component: HelpContainer
		};

		if (v.label) {
			r.meta = {
				label: v.label,
				status
			};
		}

		if (v.children) {
			const tempRoute = parentRoute ? `${parentRoute}/${k}` : `/${k}`;
			r.children = mapRoutes(v.children, status, tempRoute);
		}
		return r;
	});
};

export const helpRoutes = mapRoutes(helpMap, 0);

const routes = [
	...helpRoutes,
	{
		path: '/contact-us',
		component: ContactUs
	},
	{
		path: '*',
		component: HelpContainer
	}
];

export default routes;
