/**
 * 首页 api
 */
import { postJson } from './request';

/* Common */
export const getIndexData = data => postJson('/gicfwh/get-group-member-info', data);
export const getIndexUrl = data => postJson('/gicfwh/get-yueshi-params', data);
