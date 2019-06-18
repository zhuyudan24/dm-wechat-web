/**
 * 卡券 api
 */
import { postJson } from './request';

/* Common */
export const getCardsData = data => postJson('/gicfwh/get-tpn-card-list.json', data);
