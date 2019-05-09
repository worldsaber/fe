import { getContactsNumber } from 'base/js/utils';

const contactsNumber = getContactsNumber();

export const lockedMessage = `This account has been temporarily locked for security concern. If you need any help, please contact us at: ${contactsNumber}.`;

export const defaultMessage = 'Sorry, something went wrong. Please try again later.';
