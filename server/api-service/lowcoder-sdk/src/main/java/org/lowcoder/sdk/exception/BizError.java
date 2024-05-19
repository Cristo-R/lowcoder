package org.lowcoder.sdk.exception;

import lombok.Getter;

import static org.lowcoder.sdk.exception.ErrorLogType.SIMPLE;
import static org.lowcoder.sdk.exception.ErrorLogType.VERBOSE;
import static org.lowcoder.sdk.util.EnumUtils.checkDuplicates;

@Getter
public enum BizError {

    // 5000 - 5100 general errorCode
    INTERNAL_SERVER_ERROR(500, 5000, VERBOSE),
    NOT_AUTHORIZED(500, 5001),
    INVALID_PARAMETER(500, 5002),
    UNSUPPORTED_OPERATION(400, 5003),
    DUPLICATE_KEY(409, 5004, VERBOSE),
    NO_RESOURCE_FOUND(500, 5005),
    INFRA_REDIS_TIMEOUT(500, 5006),
    INFRA_MONGO_TIMEOUT(500, 5007),
    INVALID_PERMISSION_OPERATION(500, 5008),
    REQUEST_THROTTLED(429, 5009),
    SERVER_NOT_READY(503, 5010),
    REDIRECT(302, 5011),


    // ORG related, code range 5100 - 5149
    INVALID_ORG_ID(500, 5100),
    SWITCH_CURRENT_ORG_ERROR(500, 5101),
    LAST_ADMIN_CANNOT_LEAVE_ORG(500, 5102),
    EXCEED_MAX_USER_ORG_COUNT(500, 5103),
    EXCEED_MAX_ORG_MEMBER_COUNT(500, 5104),
    UNABLE_TO_FIND_VALID_ORG(500, 5105),
    EXCEED_MAX_DEVELOPER_COUNT(500, 5106),
    ORG_DELETED_FOR_ENTERPRISE_MODE(500, 5107),

    // GROUP related, code range 5150 - 5199
    INVALID_GROUP_ID(500, 5150),
    CANNOT_REMOVE_MYSELF(500, 5151),
    CANNOT_LEAVE_GROUP(500, 5152),
    EXCEED_MAX_GROUP_COUNT(500, 5153),
    CANNOT_DELETE_SYSTEM_GROUP(500, 5154),

    NEED_DEV_TO_CREATE_RESOURCE(500, 5155),

    // INVITE related, code range 5200 - 5300
    INVALID_INVITATION_CODE(400, 5200),
    INVITER_NOT_FOUND(404, 5201),
    ALREADY_IN_ORGANIZATION(400, 5202),
    INVITED_ORG_DELETED(500, 5203),
    INVITED_APPLICATION_DELETED(500, 5204),
    INVITED_USER_NOT_LOGIN(403, 5205),

    // APPLICATION related, code range 5300 - 5400
    QUERY_NOT_FOUND(500, 5300),
    APPLICATION_NOT_FOUND(500, 5301),
    ILLEGAL_APPLICATION_PERMISSION_ID(500, 5302),
    EXCEED_MAX_APP_COUNT(500, 5303),
    NO_PERMISSION_TO_VIEW(403, 5304),

    FETCH_HISTORY_SNAPSHOT_FAILURE(500, 5305),
    FETCH_HISTORY_SNAPSHOT_COUNT_FAILURE(500, 5306),
    INVALID_HISTORY_SNAPSHOT(500, 5307),

    NO_PERMISSION_TO_REQUEST_APP(403, 5308),

    // datasource related, code range 5500 - 5600
    DATASOURCE_NOT_FOUND(500, 5500),
    INVALID_DATASOURCE_CONFIGURATION(400, 5501, VERBOSE),
    DATASOURCE_DELETE_FAIL_DUE_TO_REMAINING_QUERIES(500, 5502),
    PLUGIN_CREATE_CONNECTION_FAILED(500, 5503, VERBOSE),
    DATASOURCE_PLUGIN_ID_NOT_GIVEN(400, 5504),
    EXCEED_MAX_DATASOURCE_COUNT(500, 5505),
    INVALID_DATASOURCE_CONFIG_TYPE(500, 5506, VERBOSE),
    DATASOURCE_TYPE_ERROR(500, 5507, VERBOSE),
    DUPLICATE_DATABASE_NAME(500, 5508),
    DATASOURCE_CLOSE_FAILED(500, 5509, VERBOSE),

    DATASOURCE_AND_APP_ORG_NOT_MATCH(500, 5510),
    CERTIFICATE_IS_EMPTY(400, 5511),


    // login related, code range 5600 - 5699
    USER_NOT_SIGNED_IN(401, 5600),
    FAIL_TO_GET_OIDC_INFO(500, 5601, VERBOSE),
    LOG_IN_SOURCE_NOT_SUPPORTED(403, 5602),
    TOO_MANY_REQUESTS(429, 5603),
    INVALID_OTP(403, 5604),

    USER_LOGIN_ID_EXIST(403, 5607),
    INVALID_PASSWORD(403, 5608),
    ALREADY_BIND(403, 5609),
    NEED_BIND_THIRD_PARTY_CONNECTION(400, 5610),
    CAS_LOGIN_ERROR(400, 5611),
    DING_TALK_LOGIN_ERROR(400, 5612),
    CANNOT_FIND_ENTERPRISE_ORG(500, 5613),
    AUTH_ERROR(400, 5614),
    AUTH_REFRESH_ERROR(400, 5615),
    LOGIN_EXPIRED(401, 5616),
    DISABLE_AUTH_CONFIG_FORBIDDEN(403, 5617),
    USER_NOT_EXIST(400, 5618),
    JWT_NOT_FIND(400, 5619),
    ID_NOT_EXIST(500, 5620),
    DUPLICATE_AUTH_CONFIG_ADDITION(400, 5621),


    // asset related, code range 5700 - 5799
    PAYLOAD_TOO_LARGE(413, 5700),


    // plugin related, code range 5800 - 5899
    PLUGIN_EXECUTION_TIMEOUT(504, 5800),
    INVALID_DATASOURCE_TYPE(500, 5801),
    PLUGIN_EXECUTION_TIMEOUT_WITHOUT_TIME(504, 5802, VERBOSE),

    // business related, code range 5900 - 5999
    NOT_RELEASE(423, 5901),

    // template related,  code range 6000 - 6099
    TEMPLATE_NOT_EXIST(500, 6000),
    TEMPLATE_NOT_CORRECT(500, 6001),

    // query related,  code range 6100 - 6199
    EXCEED_QUERY_REQUEST_SIZE(500, 6100),
    EXCEED_QUERY_RESPONSE_SIZE(500, 6101),
    QUERY_EXECUTION_ERROR(500, 6102),
    LIBRARY_QUERY_AND_ORG_NOT_MATCH(400, 6103),
    LIBRARY_QUERY_NOT_FOUND(400, 6104),

    // user related, code range 6200 - 6250,
    INVALID_USER_STATUS(500, 6200),
    USER_BANNED(500, 6201),

    // license related, code range 6251 - 6300
    CANT_DEPLOY_IN_AIR_GAPPED_ENV(400, 6251),
    CURRENT_EDITION_NOT_SUPPORT_FOR_THIS_FEATURE(400, 6252),

    // folder 6301 - 6350
    FOLDER_OPERATE_NO_PERMISSION(500, 6301),
    FOLDER_NOT_EXIST(500, 6302),
    FOLDER_NAME_CONFLICT(500, 6303),
    ILLEGAL_FOLDER_PERMISSION_ID(500, 6304),

    // material 6351 - 6400
    INVALID_MATERIAL_REQUEST(500, 6351),
    ;

    static {
        checkDuplicates(values(), BizError::getBizErrorCode);
    }

    private final int httpErrorCode;
    private final int bizErrorCode;
    private final ErrorLogType errorAction;

    BizError(int httpErrorCode, int bizErrorCode) {
        this(httpErrorCode, bizErrorCode, SIMPLE);
    }

    BizError(int httpErrorCode, int bizErrorCode, ErrorLogType errorLogType) {
        this.httpErrorCode = httpErrorCode;
        this.bizErrorCode = bizErrorCode;
        this.errorAction = errorLogType;
    }

    public boolean logVerbose() {
        return this.errorAction == VERBOSE;
    }
}
