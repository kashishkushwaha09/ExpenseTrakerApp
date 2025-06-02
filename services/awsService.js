const AWS=require('aws-sdk');

 function uploadToS3(data,fileName){
    const BUCKET_NAME=process.env.BUCKET_NAME;
    const IAM_USER_KEY=process.env.IAM_USER_KEY;
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET;

    const s3=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    });

    const params={
        Bucket:BUCKET_NAME,
        Key:fileName,
        Body:data,
        ACL:'public-read',
    }
    // return new Promise((resolve,reject)=>{
//         s3.upload(params,(err,s3Response)=>{
//             if(err){
//                 console.log("something went wrong",err);
//                 reject(err);
//             }
//             console.log("file uploaded successfully at ",s3Response.Location);
//             resolve(s3Response.Location);
//         });
//  });
     return s3.upload(params).promise();

}
module.exports={
    uploadToS3
}