/**
 * 积分 api
 */
import { postJson } from './request';

/* Common */
export const getRecordData = data => postJson('/gicfwh/load-group-order-record', data);
