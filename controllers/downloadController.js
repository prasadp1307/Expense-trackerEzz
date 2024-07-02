// const User = require ('../util/user');
// const sequelize = require('../database/db');
// const AWS = require('aws-sdk');

// function uploadToS3(data, filename) {
//     const BUCKET_NAME = 'expensetrackerezz';
//     const AWS_USER_KEY = process.env.AWS_USER_KEY;
//     const AWS_USER_SECRET = process.env.AWS_USER_SECRET;

//     const s3Bucket = new AWS.S3({
//         accessKeyId: AWS_USER_KEY,
//         secretAccessKey: AWS_USER_SECRET
//     });

//     const params = {
//         Bucket: BUCKET_NAME,
//         Key: filename,
//         Body: data,
//         ACL: 'public-read'
//     };

//     return new Promise((resolve, reject) => {
//         s3Bucket.upload(params, (err, s3Response) => {
//             if (err) {
//                 console.log('Something went wrong', err);
//                 reject(err);
//             }
//             else {
//                 console.log('success', s3Response);
//                 resolve(s3Response.Location);
//             }
//         })
//     })
// }

// // User can expenseFile in pdf file
// // exports.downloadExpense = async (req, res, next) => {
// //     const t = await sequelize.transaction();
// //     try {
// //         const UserExpenses = await req.user.getExpenses({ transaction: t });
// //         const stringifiedExpenses = JSON.stringify(UserExpenses);
// //         console.log(UserExpenses)
// //         // filename will be Data & Time (different for each upload)
// //         // files is going in a folder --> named Expense-userId, for "Expense-${userId}/..."
// //         const userId = req.user.id;
        
// //         const filename = `Expense-${userId}/${new Date()}.pdf`;
// //         const fileURL = await uploadToS3(stringifiedExpenses, filename);
// //         console.log('Testing..', fileURL);
        
// //         const saveFileURLinDB = await req.user.createDownload({
// //             url: fileURL
// //         }, { transaction: t });

// //         await t.commit();
// //         res.status(200).json({ fileURL, success: true });
// //     }
// //     catch (err) {
// //         res.status(200).json({ fileURL: '', success: false });
// //         await t.rollback();
// //         console.log(err);
// //     }

// // };



// const Downloads = require('../models/download');

// // exports.getoldreports = async (req, res, next) => {

// //     try {
// //         const userId = req.user.id;
// //         const reports = await Downloads.findAll({
// //             where: { userId }
// //         });
// //         res.status(200).json(reports);
// //     } catch (error) {
// //         res.status(500).json({ message: 'Failed to retrieve old reports' });
// //     }
// // };


// // exports.getfile = async (req, res, next) => {
// //     const t = await sequelize.transaction();
// //     try {
// //         const UserExpenses = await req.user.getExpenses({ transaction: t });
// //         const stringifiedExpenses = JSON.stringify(UserExpenses);
// //         console.log(UserExpenses);
        
// //         // Create a filename with a proper format
// //         const userId = req.user.id;
// //         const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
// //         const filename = `Expense-${userId}/${timestamp}.pdf`;
        
// //         // Upload the stringified expenses to S3
// //         const fileURL = await uploadToS3(stringifiedExpenses, filename);
// //         console.log('Testing..', fileURL);
        
// //         // Save the file URL in the database
// //         await req.user.createDownload({
// //             url: fileURL
// //         }, { transaction: t });

// //         await t.commit();
// //         res.status(200).json({ fileURL, success: true });
// //     } catch (err) {
// //         await t.rollback();
// //         console.error(err);
// //         res.status(500).json({ fileURL: '', success: false, error: err.message });
// //     }
// // };


// // const Downloads = require('../models/download');
// // const Downloads = require('../models/download');

// exports.getOldReports = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const reports = await Downloads.findAll({ where: { userId } });
//         res.status(200).json(reports);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to retrieve old reports' });
//     }
// };

// exports.getFile = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const latestReport = await Downloads.findOne({ where: { userId }, order: [['createdAt', 'DESC']] });

//         if (!latestReport) {
//             return res.status(404).json({ message: 'No reports found' });
//         }

//         res.status(200).json({ fileURL: latestReport.fileURL, prevdata: latestReport });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to retrieve file' });
//     }
// };

const User = require('../util/user');
const sequelize = require('../database/db');
const AWS = require('aws-sdk');
const Downloads = require('../models/download');

function uploadToS3(data, filename) {
    const BUCKET_NAME = 'expensetrackerezz';
    const AWS_USER_KEY = process.env.AWS_USER_KEY;
    const AWS_USER_SECRET = process.env.AWS_USER_SECRET;

    const s3Bucket = new AWS.S3({
        accessKeyId: AWS_USER_KEY,
        secretAccessKey: AWS_USER_SECRET
    });

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    };

    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, (err, s3Response) => {
            if (err) {
                console.log('Something went wrong', err);
                reject(err);
            } else {
                console.log('Upload success', s3Response);
                resolve(s3Response.Location);
            }
        });
    });
}

exports.getFile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const t = await sequelize.transaction();
        const UserExpenses = await req.user.getExpenses({ transaction: t });
        const stringifiedExpenses = JSON.stringify(UserExpenses);
        
        const userId = req.user.id;
        const filename = `Expense-${userId}/${new Date().toISOString()}.txt`;
        const fileURL = await uploadToS3(stringifiedExpenses, filename);
        
        await req.user.createDownload({
            url: fileURL
        }, { transaction: t });

        await t.commit();
        res.status(200).json({ fileURL, success: true });
    } catch (err) {
        console.error('Error in getFile:', err);
        res.status(500).json({ fileURL: '', success: false, error: err.message });
    }
};

exports.getOldReports = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const userId = req.user.id;
        const reports = await Downloads.findAll({ where: { userId } });
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error in getOldReports:', error);
        res.status(500).json({ message: 'Failed to retrieve old reports', error: error.message });
    }
};
