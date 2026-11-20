const env = import.meta.env;

export const API = {
    register: (env.VITE_REGISTER_KEY as string) || "/api/auth/register",
    login: (env.VITE_LOGIN_KEY as string) || "/api/auth/login",
    logout: (env.VITE_LOGOUT_KEY as string) || "/api/auth/logout",
    profile: (env.VITE_PROFILE_KEY as string) || "/api/auth/profile",
    profileCompleted:
        (env.VITE_PROFILECOMPLETED_KEY as string) || "/api/auth/profilecompleted",
    createJob: (env.VITE_CREATE_JOB_KEY as string) || "/api/job/createjob",
    getAllJobs: (env.VITE_GET_ALL_JOBS as string) || "/api/job/getalljobs",
    getMyJobs: (env.VITE_GET_MY_JOBS as string) || "/api/job/getmyjobs",
    deleteJob: (env.VITE_DELETE_JOB as string) || "/api/job/deletejob",
    updateJobPath: (env.VITE_UPDATE_JOB as string) || "/employer/updatejobs",
};
