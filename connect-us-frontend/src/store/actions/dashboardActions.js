export const DASHBOARD_SET_USERNAME = 'DASHBOARD.SET_USERNAME';
export const DASHBOARD_SET_AVATAR = 'DASHBOARD.SET_AVATAR';
export const DASHBOARD_SET_ACTIVE_USERS = 'DASHBOARD.SET_ACTIVE_USERS';

export const setUsername = (username) => {
    return {
        type: DASHBOARD_SET_USERNAME,
        username
    };
};

export const setAvatarUrl = (avatar) => {
    return {
        type: DASHBOARD_SET_AVATAR,
        avatar
    };
};

export const setActiveUsers = (activeUsers) => {
    return {
        type: DASHBOARD_SET_ACTIVE_USERS,
        activeUsers
    };
};