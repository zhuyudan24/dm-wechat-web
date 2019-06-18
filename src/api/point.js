/**
 * 积分 api
 */
import { postJson } from './request';

/* Common */
export const getPointData = data => postJson('/gicfwh/load-group-interal-record', data);
