import { deleteCustomerByAdmin, login, register, verifyCustomer } from './auth.js';
// Import { deleteCustomer } from "#user/Service/database.service.js";

const config = {
  email: 'saranshbalyan123@gmail.com',
  name: 'Api Test',
  password: 'ysoserious123'
};

const apiTest = async () => {
  if (process.env.ENCRYPTION === 'true') return console.error('TURN OFF ENCRYPTION FOR TESTING');
  if (process.env.NODE_ENV === 'development') return console.error('TURN ON DEVEOPMENT MODE FOR TESTING');

  try {
    const registerResult = await register(config);
    if (!registerResult) throw new Error('Registration Failed');

    const verifyResult = await verifyCustomer(registerResult.verifyToken);
    if (!verifyResult) throw new Error('Verification Failed');

    const loginResult = await login(config);
    if (!loginResult) throw new Error('Login Failed');
  } catch (e) {
    // DeleteCustomerByAdmin(config);
  } finally {
    deleteCustomerByAdmin(config);
  }
};

apiTest();
