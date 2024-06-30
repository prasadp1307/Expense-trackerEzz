const Forgotpassword = require('../models/forget');
const bcrypt = require('bcrypt');
const User = require('../util/user');
const UUID = require('uuid');
const sib = require('sib-api-v3-sdk');
require('dotenv').config();


exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            throw new Error('User does not exist');
        }

        const id = UUID.v4();
        await Forgotpassword.create({ id, active: true, userId: user.id });

        const client = sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SIB_API_KEY;

        console.log("Sendinblue API Key:", process.env.SIB_API_KEY);

        const transEmailApi = new sib.TransactionalEmailsApi();

        const sender = {
            email: 'prasaddp1137@gmail.com',
            name: 'ExpenseEzz powered by @PrasadPatharvat'
        };

        const receivers = [{ email: email }];

        transEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset your password for ExpenseEzz!',
            textContent: `Follow the link to reset the password`,
            htmlContent: `<h1>Click on the link below to reset the password</h1><br>
                          <h3>Hello, follow this link to reset your ExpenseEzz! password for your account.</h3>
                          <a href="http://localhost:4000/password/resetpassword/${id}">Reset your Password</a>`
        }).then(response => {
            return res.status(202).json({ success: true, message: "Password reset link sent" });
        }).catch(err => {
            console.error("Error sending email:", err.response ? err.response.body : err);
            return res.status(500).json({ success: false, message: "Failed to send email", error: err.response ? err.response.body : err });
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: error.message, success: false });
    }
};

// exports.resetPassword = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const forgetpassword = await Forgotpassword.findOne({ where: { id: id } });

//         if (!forgetpassword) {
//             throw new Error('Invalid or expired password reset request');
//         }

//         await forgetpassword.update({ active: false });

//         res.status(201).send(
//             `<html>
//                 <style>
                 
//                 </style>
//                 <body>
//                     <div class="center">
//                         <div class="container">
//                             <form onsubmit="onsub(event)">
//                                 <div class="data">
//                                     <label for="newpassword">Enter New password:</label>
//                                     <input type="password" name="newpassword" id="pass" required>
//                                 </div>
//                                 <div class="btn">
//                                     <button type="submit">Reset Password</button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                     <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.2/axios.min.js"></script>
//                     <script>
//                         async function onsub(event) {
//                             event.preventDefault();
//                             try {
//                                 let pass = { pass: event.target.newpassword.value };
//                                 let op = await axios.post("http://localhost:4000/password/updatepassword/${id}", pass);
//                                 if (op.status == 201) {
//                                     alert('Password Reset Successfully');
//                                     window.close();
//                                 } else {
//                                     throw new Error('Failed to reset password');
//                                 }
//                             } catch (err) {
//                                 alert(err);
//                                 console.log(err);
//                             }
//                         }
//                     </script>
//                 </body>
//             </html>`
//         );
//         res.end();
//     } catch (err) {
//         console.error("Error:", err);
//         res.status(500).json({ message: err.message, success: false });
//     }
// };

// exports.resetPassword = async (req, res) => {
//     try {
//         const id = req.params.id;

//          if (!id) {
//             throw new Error('Invalid request');
//         }
//         const forgetpassword = await Forgotpassword.findOne({ where: { id: id } });

//         if (!forgetpassword) {
//             throw new Error('Invalid or expired password reset request');
//         }

//         await forgetpassword.update({ active: false });

//         res.status(201).send(
//             `<html>
//                 <style>
//                     body {
//                         display: flex;
//                         justify-content: center;
//                         align-items: center;
//                         height: 100vh;
//                         margin: 0;
//                         font-family: Arial, sans-serif;
//                         background-color: #f4f4f4;
//                     }
//                     .center {
//                         display: flex;
//                         justify-content: center;
//                         align-items: center;
//                         width: 100%;
//                     }
//                     .container {
//                         background-color: white;
//                         padding: 20px;
//                         box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//                         border-radius: 8px;
//                     }
//                     .data {
//                         margin-bottom: 15px;
//                     }
//                     .data label {
//                         display: block;
//                         margin-bottom: 5px;
//                         font-weight: bold;
//                     }
//                     .data input {
//                         width: 100%;
//                         padding: 10px;
//                         border: 1px solid #ddd;
//                         border-radius: 4px;
//                         box-sizing: border-box;
//                     }
//                     .btn button {
//                         width: 100%;
//                         padding: 10px;
//                         background-color: #4CAF50;
//                         color: white;
//                         border: none;
//                         border-radius: 4px;
//                         cursor: pointer;
//                         font-size: 16px;
//                     }
//                     .btn button:hover {
//                         background-color: #45a049;
//                     }
//                 </style>
//                 <body>
//                     <div class="center">
//                         <div class="container">
//                             <form onsubmit="onsub(event)">
//                                 <div class="data">
//                                     <label for="newpassword">Enter New password:</label>
//                                     <input type="password" name="newpassword" id="pass" required>
//                                 </div>
//                                 <div class="btn">
//                                     <button type="submit">Reset Password</button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                     <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.2/axios.min.js"></script>
//                     <script>
//                         async function onsub(event) {
//                             event.preventDefault();
//                             try {
//                                 let pass = { pass: event.target.newpassword.value };
//                                 let op = await axios.post("http://localhost:4000/password/updatepassword/${id}", pass);
//                                 if (op.status == 201) {
//                                     alert('Password Reset Successfully');
//                                     window.close();
//                                 } else {
//                                     throw new Error('Failed to reset password');
//                                 }
//                             } catch (err) {
//                                 alert(err);
//                                 console.log(err);
//                             }
//                         }
//                     </script>
//                 </body>
//             </html>`
//         );
//         res.end();
//     } catch (err) {
//         console.error("Error:", err);
//         res.status(500).json({ message: err.message, success: false });
//     }
// };

exports.resetPassword = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            throw new Error('Invalid request');
        }

        const forgetpassword = await Forgotpassword.findOne({ where: { id: id } });

        if (!forgetpassword) {
            throw new Error('Invalid or expired password reset request');
        }

        await forgetpassword.update({ active: false });

        res.status(201).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        background: url('fp.jpg') no-repeat center center fixed;
                        background-size: cover;
                    }
                    .center {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                    }
                    .container {
                        background-color: white;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                    }
                    .data {
                        margin-bottom: 15px;
                    }
                    .data label {
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                    }
                    .data input {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        box-sizing: border-box;
                    }
                    .btn button {
                        width: 100%;
                        padding: 10px;
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                    }
                    .btn button:hover {
                        background-color: #45a049;
                    }
                </style>
            </head>
            <body>
                <div class="center">
                    <div class="container">
                        <form onsubmit="onsub(event)">
                            <div class="data">
                                <label for="newpassword">Enter New password:</label>
                                <input type="password" name="newpassword" id="pass" required>
                            </div>
                            <div class="btn">
                                <button type="submit">Reset Password</button>
                            </div>
                        </form>
                    </div>
                </div>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.2/axios.min.js"></script>
                <script>
                    async function onsub(event) {
                        event.preventDefault();
                        try {
                            let pass = { pass: event.target.newpassword.value };
                            let op = await axios.post("http://localhost:4000/password/updatepassword/${id}", pass);
                            if (op.status == 201) {
                                alert('Password Reset Successfully');
                                window.close();
                            } else {
                                throw new Error('Failed to reset password');
                            }
                        } catch (err) {
                            alert(err.message);
                            console.log(err);
                        }
                    }
                </script>
            </body>
            </html>
        `);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: err.message, success: false });
    }
};




















exports.updatePassword = async (req, res) => {
    try {
        const newpassword = req.body.pass;
        const resetpasswordid = req.params.id;
        const resetpasswordrequest = await Forgotpassword.findOne({ where: { id: resetpasswordid } });

        if (!resetpasswordrequest) {
            return res.status(404).json({ message: 'Invalid or expired password reset request', success: false });
        }

        const user = await User.findOne({ where: { id: resetpasswordrequest.userId } });

        if (!user) {
            return res.status(404).json({ message: 'No user exists', success: false });
        }

        const saltRound = 10;
        bcrypt.hash(newpassword, saltRound, async (err, hash) => {
            if (err) {
                console.log(err);
                throw new Error(err);
            }
            await User.update({ password: hash }, { where: { id: user.id } });
            console.log('Password changed successfully');
            res.status(201).json({ message: 'Successfully updated the new password' });
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error, success: false });
    }
};
