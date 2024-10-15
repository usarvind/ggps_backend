/**
 * Created by Shruti on 15/12/2019.
 */
module.exports = {
    commonResponseCode: {
        dataFound: { code: 200, message: "Details found" },
        dataNotFound: { code: 202, message: "Data not found" },
        Status_OK: 200,//message: "Success." }
        Status_Accepted: { code: 202, message: "Accepted" },
        Status_Not_Found: { code: 404, message: "Data Not Available" },
        Status_Forbidden: { code: 402, message: "Access Forbidden" },
        Status_Unauthorized: { code: 401, message: "Unauthorized Access" },
        Status_Non_Authoritative_Information: { code: 203, message: "Non Authoritative Information" },
        Status_Bad_Request: { code: 400, message: "Bad Request" },
        Status_Partial_Content: { code: 206, message: "Partial Content" },
        Status_Not_Implemented: { code: 501, message: "Not Implemented" },
        Status_Request_Entity_Too_Large: { code: 413, message: "Request Entity Too Large" },
        Status_Service_Unavailable: { code: 503, message: "Service Unavailable" },
        Status_Login_Timeout: { code: 440, message: "Request Timeout" },
        Status_Internal_Server_Error: { code: 500, message: "Internal Server Error" }
    },
    commonResponseMsg: {
        serverError: "Internal server error",
        success: "Successful"
    },
    complaintResponseMsg: {
        success: "Complaint registered successfully",
        updateTicket:"Complaint updated successfully",
        updateInspDesposition:"Your request has been send for verification to THD",
        getTicketSuccess:"Complaint details found",
        getTicketFail:"Complaint details not found",
        sapTyreSerialSuccess:"Serial number details found",
        sapTyreSerialFail:"Serial number details not found",
        sapRHPSuccess:"RHP details found",
        sapRHPFail:"RHP details not found",
        dispatchListSuccess:"Dispatch data found",
        dispatchListFail:"Dispatch data not found",
        complaintTrackingListSuccess:"complaint tracking data found",
        complaintTrackingListFail:"complaint tracking data not found"
    },
    smsResponseMsg: {
        success: "SMS Sent successfully",
        verifyOtpSuccess:"OTP Verification has been done",
        
    },
    
    userRoleResponseMsg: {
        success: "User details added successfully",
        updateSuccess:"User role updated successfully",
        getUserSuccess:"Details found",
        deleteUserRole: "User role removed successfully",
        getUserRoles: "Roles fetched successfully"
    },
    userResponseMsg: {
        addUserSuccess: "New user added successfully",
        updateSuccess: "User details updated successfully",
        getUserSuccess: "User details fetch successfully",
        listUsersSuccess: "All user details fetch successfully",
        updateUserStatus: "User status updated "
    },
    dispatchResponseMsg:{
        dispatchListSuccess:"Dispatch data found",
        dispatchListFail:"Dispatch data not found",
    },
    warrantyListResponseMsg: {
        fail:"Warranty details not found",
        success: "Warranty details found",
        
    },
    dispatchResMsg: {
        orderDetailsFail:"Order details not fount",
        orderDetailsSuccess: "Order details found",
        orderSummaryFail:"Order summary not fount",
        orderSummarySuccess: "Order summary found",
        sendForDispatch: "Dispatched Successfully",
        cancelOrder:"Delivery Cancelled",
        receivedOrder:"Delivery  Received",
        pendingMaterialDispatchFail:"pending material to dispatch not fount",
        pendingMaterialDispatchSuccess: "pending material to dispatch found",
        selectForPickupSuccess: "Order submitted",
        selectForPickupFail:"Order not submitted",
        
    },
    userLoginResponseMsg: {
        loginSuccess: "User login successful",
        resetPasswordSuccess: "Password updated successfully",
        accessAddedSuccess: "Access given to user successfully",
        accessRevokedSuccess: "Access revoked from user successfully",
        loginAllowedSuccess: "Login access allowed successfully",
        accessPaginatedRecords: "Access master records fetched successfully",
        accessUpdatedSuccess: "Access updated for user successfully",
        logoutSuccess: "User logged out successfully"
    },
    assignmentResponseMsg: {
        addAssignmentSuccess: "Assignment details added successfully",
        updateSuccess: "Assignment details updated successfully",
        accessRevokedSuccess: "Access revoked from user successfully"
    },
    wearMasterResponseMsg: {
        addWearMasterSuccess: "Wear percentage details added successfully",
        updateWearMasterSuccess: "Wear percentage details updated successfully",
        wearMasterRecordSuccess: "Wear percentage record fetched successfully",
        deleteWearMasterSuccess: "Wear percentage record deleted successfully",
    },
    cartingAgentResponseMsg:{
        getlist: "Required lists are as follows",
        addCartingAgent: "Carting Agent details added successfully",
        updateCartingAgent: "Carting Agent details updated successfully",
        deleteCartingAgent: "Carting Agent deleted successfully",
        cartingAgentRecordSuccess: "Carting Agent record fetched successfully",
        cartingAgentRecordFail: "Carting Agent record fetched not found",
        cartingAgentPagination: "Carting Agent records fetched successfully",
        vehicleAddedSuccess: "New vehicle added for agent successfully",
        getVehicleListSuccess: "Carting agent vehicle details fetched successfully"
    },
    permissionsResponseMsg: {
        addPermissions: "Permissions added successfully for the role",
        updatePermissions: "Permission updated successfully",
        permissionDetails: "Permission details fetched successfully",
        permissionsList: "Permission records fetched successfully"
    },
    slaMasterResponseMsg: {
        addSlaSuccess: "Sla master added successfully",
        updateSlaMasterSuccess: "Sla master updated successfully",
        deleteSlaMasterSuccess: "Sla master deleted successfully",
    },
};
