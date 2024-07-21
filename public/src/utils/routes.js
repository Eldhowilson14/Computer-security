export const host = "http://localhost:5000";
export const relayHost = "http://localhost:5001";
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const googleAuthRoute = `${host}/api/auth/google-auth`;
export const logoutRoute = `${host}/api/auth/logout`;
export const friendsList = `${host}/api/user/{userId}/friends`;
export const relayRoutes = `${relayHost}/api/relay/relay`;