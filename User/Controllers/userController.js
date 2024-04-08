import db from "#utils/dataBaseConnection.js";
import getError from "#utils/error.js";
import bcrypt from "bcryptjs";
import { sendMail } from "#utils/Mail/nodeMailer.js";
import { s3, uploadFile } from "#storage/Service/awsService.js";
import errorContstants from "#constants/error.js";
import successConstants from "#constants/success.js";
import cache from "#utils/cache.js";
import { deleteCustomer } from "../Service/database.js";

const User = db.users;
const Customer = db.customers;
const UserRole = db.userRoles;
const userProject = db.userProjects;
const Role = db.roles;
const Permission = db.permissions;

const getTeam = async (req, res) => {
    /*  #swagger.tags = ["User"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const team = await User.schema(req.database).findAll({
            attributes: ["id", "name", "email", "profileImage", "verifiedAt", "deletedAt", "active", "defaultProjectId"],
        });
        const filteredTeam = team.filter((el) => {
            return el.id !== req.user.id;
        });

        const teamWithImages = await filteredTeam.map(async (user) => {
            let base64ProfileImage = "";
            if (user.dataValues.profileImage) {
                try {
                    var getParams = {
                        Bucket: req.database.split("_")[1].toLowerCase(),
                        Key: user.email.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase(),
                    };

                    const data = await s3.getObject(getParams);

                    if (data?.Body) {
                        base64ProfileImage = await data.Body.transformToString("base64");
                    } else {
                        base64ProfileImage = data;
                    }
                    return {
                        ...user.dataValues,
                        profileImage: user.dataValues.profileImage ? base64ProfileImage : "",
                    };
                } catch (err) {
                    console.error("Profile Image Error", err);
                    return {
                        ...user.dataValues,
                        profileImage: "",
                    };
                }
            } else
                return {
                    ...user.dataValues,
                    profileImage: base64ProfileImage,
                };
        });
        Promise.all(teamWithImages).then((data) => {
            return res.status(200).json(data);
        });
    } catch (error) {
        getError(error, res);
    }
};

const addUser = async (req, res) => {
    /*  #swagger.tags = ["User"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const { name, email, password } = req.body;
        const database = req.database;

        await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME)
            .create({ email, tenantName: req.user.tenant })
            .catch((e) => {
                console.error(e);
                throw new Error("User already exist");
            });

        const hash = await bcrypt.hash(password, 8);
        const user = await User.schema(req.database).create({
            name,
            email,
            password: hash,
            active: false,
        });
        sendMail({ email, name, tenant: database }, "addUser");

        return res.status(200).json({
            id: user.id,
            name,
            email,
            message: "User added, Verify user's email to login",
        });
    } catch (error) {
        getError(error, res);
    }
};

const resendVerificationEmail = async (req, res) => {
    /*  #swagger.tags = ["User"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const { email } = req.body;

        const user = await User.schema(database).findOne({
            where: { email },
        });

        const database = req.database;
        await sendMail({ email, name: user.name, tenant: database }, "addUser");

        return res.status(200).json({
            message: "Verification Email Resent!",
        });
    } catch (error) {
        getError(error, res);
    }
};

const deleteUser = async (req, res) => {
    /*  #swagger.tags = ["User"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const userId = req.params.userId;

        const user = await User.schema(req.database).findByPk(userId);
        if (req.user.tenant == user.email.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase()) throw new Error("Cannot Delete Customer Admin");
        if (user.verifiedAt) throw new Error("Cannot delete Active User, You can only mark them inactive!");
        await userProject.schema(req.database).destroy({ where: { userId } });
        await UserRole.schema(req.database).destroy({ where: { userId } });
        const deletedUser = await User.schema(req.database).destroy({
            where: {
                id: userId,
            },
        });
        if (deletedUser > 0) {
            const deletedCustomerUser = await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).destroy({
                where: {
                    email: user.email,
                },
            });
            if (deletedCustomerUser > 0) {
                return res.status(200).json({ message: "User Deleted Successfully" });
            }
        } else {
            throw new Error("User Not Found");
        }
    } catch (error) {
        getError(error, res);
    }
};

const deleteCustomerUser = async (req, res) => {
    /*  #swagger.tags = ["User"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        if (!req.user.customerAdmin) return res.status(401).json({ message: "Only customer admin can perform this operation!" });

        await deleteCustomer(req.user.email);
        return res.status(200).json({ message: "Deleted all data!" });
    } catch (error) {
        getError(error, res);
    }
};

const changePassword = async (req, res) => {
    /*  #swagger.tags = ["User"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.schema(req.database).findByPk(req.user.id);
        const isAuthenticated = await bcrypt.compare(oldPassword, user.password);
        if (!isAuthenticated) return res.status(400).json({ error: errorContstants.INCORRECT_PASSWORD });
        const updatedUser = await User.schema(req.database).update(
            { password: newPassword },
            {
                where: {
                    id: req.user.id,
                },
            }
        );
        if (updatedUser[0]) return res.status(200).json({ message: successConstants.UPDATED });
        else throw new Error(errorContstants.RECORD_NOT_FOUND);
    } catch (error) {
        getError(error, res);
    }
};

const changeDetails = async (req, res) => {
    /*  #swagger.tags = ["User"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const userId = req.params.userId || req.user.id;
        const body = req.user.id == userId ? req.body : { active: req.body.active } || {};
        delete body.password;

        const updatedUser = await User.schema(req.database).update(body, {
            where: {
                id: userId,
            },
        });
        if (updatedUser[0]) return res.status(200).json({ message: successConstants.UPDATED });
        else throw new Error(errorContstants.RECORD_NOT_FOUND);
    } catch (error) {
        getError(error, res);
    }
};

const uploadProfileImage = async (req, res) => {
    /*  #swagger.tags = ["User"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const file = req.files.image;
        if (!file) throw new Error("Inavlid Image");
        const bucketName = req.database.split("_")[1].toLowerCase();
        const fileName = req.user.email.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
        const result = await uploadFile(file, bucketName, fileName);
        if (result) {
            await User.schema(req.database).update(
                { profileImage: true },
                {
                    where: {
                        id: req.user.id,
                    },
                }
            );
            return res.status(200).json({ message: successConstants.UPDATED });
        } else throw new Error("Unable to upload profile image!");
    } catch (error) {
        getError(error, res);
    }
};

const getUserDetailsByEmail = async (req, res) => {
    /*  #swagger.tags = ["User"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        const database = req.user.database;
        const email = req.body.email || req.user.email;
        const customer = await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).findOne({
            where: { email },
        });

        const user = await User.schema(database).findOne({
            where: { email },
            include: [
                {
                    model: UserRole.schema(database),
                    attributes: ["roleId"],
                    include: [
                        {
                            model: Role.schema(database),
                            attributes: ["name"],
                            include: [
                                {
                                    model: Permission.schema(database),
                                    attributes: ["name", "view", "add", "edit", "delete"],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!user) throw new Error(errorContstants.RECORD_NOT_FOUND);

        const { id, name, verifiedAt, defaultProjectId, profileImage } = user;
        if (!verifiedAt) throw new Error(errorContstants.EMAIL_NOT_VERIFIED);

        let allPermissions = [];
        const newRoles = await user.userRoles.map((el) => {
            allPermissions = [...allPermissions, ...el.role.permissions];
            let tempRole = {};
            tempRole.name = el.role.name;
            tempRole.permissions = el.role.permissions;
            return tempRole;
        });

        const superAdmin = customer.admin == 2;
        const customerAdmin = customer.admin || superAdmin;

        let base64ProfileImage = "";
        if (profileImage) {
            var getParams = {
                Bucket: customer.tenantName,
                Key: email.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase(),
            };

            const data = await s3.getObject(getParams);

            if (data?.Body) {
                base64ProfileImage = await data.Body.transformToString("base64");
            } else {
                base64ProfileImage = data;
            }
        }

        return res.status(200).json({
            id,
            name,
            email,
            profileImage: profileImage ? base64ProfileImage : "",
            customerAdmin,
            defaultProjectId,
            verifiedAt,
            roles: newRoles,
        });
    } catch (error) {
        getError(error, res);
    }
};

const logout = async (req, res) => {
    /*  #swagger.tags = ["User"] 
     #swagger.security = [{"apiKeyAuth": []}]
  */
    try {
        if (process.env.JWT_ACCESS_CACHE) cache.del(`accesstoken_${req.user.tenant}_${req.user.email}`);
        return res.status(200).json({ message: "Logout Successfull" });
    } catch (error) {
        getError(error, res);
    }
};

// const toggleUserActiveInactive = async (req, res) => {
//     /*  #swagger.tags = ["User"]
//      #swagger.security = [{"apiKeyAuth": []}]
//   */
//     try {
//         const userId = req.params.userId;
//         const active = req.body.active;

//         const updatedUser = await User.schema(req.database).update(req.body, {
//             where: {
//                 id: userId,
//             },
//         });
//         if (updatedUser[0]) return res.status(200).json({ message: `Marked User as ${active ? "Active" : "Inactive"}` });
//         else throw new Error(errorContstants.RECORD_NOT_FOUND);
//     } catch (error) {
//         getError(error, res);
//     }
// };

// const myStatus = async (req, res) => {
//     /*  #swagger.tags = ["User"]
//      #swagger.security = [{"apiKeyAuth": []}]
//   */
//     try {
//         const user = await User.schema(req.database).findOne({
//             where: { email: req.user.email },
//         });
//         if (!user.active) return res.status(403).json({ error: errorContstants.ACCOUNT_INACTIVE });
//         const customer = await Customer.schema(process.env.DATABASE_PREFIX + process.env.DATABASE_NAME).findOne({
//             where: { email: req.user.email },
//         });

//         if (customer.blocked) return res.status(403).json({ error: errorContstants.ACCOUNT_BLOCKED });

//         return res.status(200).json("Active");
//     } catch (error) {
//         getError(error, res);
//     }
// };

export {
    addUser,
    deleteUser,
    changePassword,
    changeDetails,
    getTeam,
    resendVerificationEmail,
    deleteCustomerUser,
    uploadProfileImage,
    logout,
    getUserDetailsByEmail,
    // toggleUserActiveInactive,
    // myStatus,
};
