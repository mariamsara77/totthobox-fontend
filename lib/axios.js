import Axios from 'axios';

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.totthobox.com',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true, // কুকি পাস করার জন্য
    withXSRFToken: true,   // CSRF টোকেনের জন্য
});

export default axios;