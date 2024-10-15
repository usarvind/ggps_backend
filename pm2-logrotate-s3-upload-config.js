module.exports = {
  "max_size": "10MB",
  "retain": "2",
  "compress": false,
  "dateFormat": "YYYY-MM-DD_HH-mm-ss",
  "workerInterval": "300",
  "rotateInterval": "0 0 * * *",
  "rotateModule": true,
  "aws": {
    "credentials": {
      "accessKeyId": "AKIAZUK5EW7AIYSDQOHZ",
      "secretAccessKey": "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",
      "region": "ap-southeast-1",
      "version": "latest"
    }
  },
  "logBucketSetting": {
    "bucket": "cvz-crm",
    "s3Path": "Apollo/CRM_App/Prod_Logs",
    "s3FilePathFormat": "__year__month__day__ip__filename__epoch__"
  },
  "getAWSPublicIp": true,
  "serverIp": null
}