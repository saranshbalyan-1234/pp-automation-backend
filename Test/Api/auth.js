import axios from "axios";

axios.defaults.baseURL = `http://localhost:${process.env.PORT || 3001}`;

const register = async (config) => {
    try {
        const payload = {
            name: config.name,
            email: config.email,
            password: config.password,
        };
        console.debug("Registering with payload", payload);
        const { data } = await axios.post(`/auth/register`, payload);
        console.log("Registration Successfull");
        return data;
    } catch (e) {
        console.error("Error while registering");
        return false;
    }
};

const login = async (config) => {
    try {
        const payload = {
            email: config.email,
            password: config.password,
        };
        console.debug("Login with payload", payload);
        const { data } = await axios.post(`/auth/login`, payload);
        console.log("Login Successfull");
        return data;
    } catch (e) {
        console.error("Error while login");
        return false;
    }
};

const verifyCustomer = async (token) => {
    try {
        console.debug("Verifying Customer");
        const { data } = await axios.post(`/auth/verify-customer`, { token });
        console.log("Customer Verified");
        return data;
    } catch (e) {
        console.error("Error while verifying customer", e);
        return false;
    }
};

const deleteCustomerByAdmin = async (config) => {
    try {
        const payload = {
            customerEmail: config.email,
        };

        const token = await getSuperAdminToken();
        await axios.post(`/super-admin/delete`, payload, { headers: { Authorization: token } });
        console.log("Deleted Customer", config.email);
        return true;
    } catch (e) {
        console.error("Error while delting customer");
        return false;
    }
};

export { register, login, deleteCustomerByAdmin, verifyCustomer };

const getSuperAdminToken = async () => {
    try {
        const config = {
            email: "superadmin@mail.com",
            password: "superadmin",
        };
        const loginResult = await login(config);
        return loginResult.accessToken;
    } catch (e) {
        console.error("Error while trying to login with super admin");
        return false;
    }
};
