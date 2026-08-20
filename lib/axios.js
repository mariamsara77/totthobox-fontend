import Axios from 'axios';

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Cross-domain cookie/session pass করার জন্য অতি জরুরি
    withXSRFToken: true,   // Laravel Sanctum CSRF token পাঠানোর জন্য
});

export default axios;