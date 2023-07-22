const AWS = require('aws-sdk');

const uploadToS3 = (data, filename) => {
    const BUCKET_NAME = 'expensetrackingapp12';
    const IAM_USER_KEY = 'AKIA56L32LNZYR77ST3G';
    const IAM_USER_SECRET = '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';
  
    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET
    })
  
    var params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data, 
      ACL: 'public-read'
    }
  
    return new Promise((resolve, reject) => {
      s3bucket.upload(params, (err, s3response) => {
        if (err) {
          console.log('something went wrong');
          reject(err);
        } else {
          //console.log('success', s3response);
          resolve(s3response.Location);
        }
      })
  
    })
  }

  module.exports = {
    uploadToS3
  }