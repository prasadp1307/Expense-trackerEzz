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
