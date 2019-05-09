import { baseUrl } from 'config/pageConfig';

const config = {
	11: {
		title: 'Withdrawals Blocked',
		text: 'We noticed unusual activity in your account. Please verify this suspicious activity.',
		button: {
			label: 'Verify',
			href: `${baseUrl}my_accounts/transactions/materials_upload`
		}
	},
	12: {
		title: 'Withdrawals Blocked (Pending Verification)',
		text: 'The information is currently being reviewed and cannot be changed. It\'ll take up to 3 business days.',
		button: ''
	},
	13: {
		title: 'Withdrawals Blocked (Verification Failed)',
		text: 'Your information have failed this verification. Please contact us to complete withdrawals.',
		button: ''
	}
};

export default config;
