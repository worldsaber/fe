import dialog from 'components/dialog';
import { baseUrl } from 'config/pageConfig';

export function checkWithdrawBlock(auditStatus) {
	let d;
	switch (auditStatus) {
	case 11:
		d = dialog({
			title: 'Withdrawals Blocked',
			content: 'We noticed unusual activity in your account. Please verify this suspicious activity.',
			button: ['CANCEL', 'VERIFY']
		});
		d.onBtnClick(val => {
			if (val === 1) {
				window.location.href = `${baseUrl}/my_accounts/transactions/materials_upload`;
			}
		});
		break;
	case 12:
		d = dialog({
			title: 'Withdrawals Blocked',
			content: 'The information is currently being reviewed and cannot be changed. It\'ll take up to 3 business days.',
			button: ['OK']
		});
		break;
	case 13:
		d = dialog({
			title: 'Withdrawals Blocked',
			content: 'Your information have failed this verification. Please contact us to complete withdrawals.',
			button: ['OK']
		});
		break;
	default:
		break;
	}
	return [11, 12, 13].indexOf(auditStatus) < 0;
}
export default checkWithdrawBlock;
