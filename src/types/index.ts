/**
 * 타입 정의 통합 export
 */

export type {
  AddressCategory,
  AddressItem,
  AddressPath,
  AllAddressResponse,
  UpdateDateRequest,
  UpdateDateResponse,
  UpdateNotNeededResponse,
} from "./address";

export type {
  ApartmentItem,
  ApartmentListResponse,
  ApartmentPath,
  DesignationStatus,
} from "./apartment";
export type { ApiErrorResponse, MessageResponse } from "./api";
export type {
  FeedbackAddRequest,
  FeedbackDetail,
  FeedbackListItem,
  FeedbackListResponse,
  FeedbackUpdateRequest,
} from "./feedback";
export type {
  PageInfo,
  PendingAddressItem,
  PendingAddressListResponse,
  PendingAddressPageResponse,
  PendingAddressPath,
  SmokingAreaAddRequest,
} from "./pending-address";
export type {
  SmokingAreaDetail,
  SmokingAreaItem,
  SmokingAreaPageResponse,
  SmokingAreaPath,
  SmokingAreaVoteRequest,
} from "./smoking-area";
