/**
 * API 모듈 통합 export
 */

// Address API
export {
  checkUpdateDate,
  getAddressByCoords,
  getAllAddress,
  isUpdateNeeded,
} from "./address";
// Apartment API
export { getAllApartments, getApartmentsByRegion } from "./apartment";
// Client
export { ApiError, apiDelete, apiGet, apiPost, apiPut } from "./client";

// Feedback API
export { addFeedback } from "./feedback";
// Health Check API
export { checkServerHealth } from "./health";
// Pending Address API
export {
  addSmokingArea,
  getAllPendingAddresses,
  getPendingAddressesPage,
} from "./pending-address";
// Smoking Area API (게시판)
export {
  getSmokingAreaDetail,
  getSmokingAreaList,
  voteSmokingArea,
} from "./smoking-area";
