/**
 * API 모듈 통합 export
 */

// Client
export { ApiError, apiGet, apiPost, apiPut, apiDelete } from "./client";

// Address API
export {
  getAllAddress,
  getAddressByCoords,
  checkUpdateDate,
  isUpdateNeeded,
} from "./address";

// Apartment API
export { getAllApartments, getApartmentsByRegion } from "./apartment";

// Feedback API
export {
  getFeedbackList,
  getFeedbackById,
  addFeedback,
  updateFeedback,
  deleteFeedback,
} from "./feedback";

// Pending Address API
export {
  getAllPendingAddresses,
  getPendingAddressesPage,
  addSmokingArea,
} from "./pending-address";

// Smoking Area API (게시판)
export {
  getSmokingAreaList,
  getSmokingAreaDetail,
  voteSmokingArea,
} from "./smoking-area";

// Health Check API
export { checkServerHealth } from "./health";
