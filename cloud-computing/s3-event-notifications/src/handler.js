const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const sns = new SNSClient({ region: process.env.AWS_REGION || "us-east-1" });

module.exports.process = async (event) => {
  console.log("Received S3 Event:", JSON.stringify(event, null, 2));

  try {
    for (const record of event.Records) {
      const bucketName = record.s3.bucket.name;
      const objectKey = record.s3.object.key;
      const fileSize = record.s3.object.size;

      const message = `A new file was uploaded to your bucket!\n\nDetails:\n- Bucket: ${bucketName}\n- File: ${objectKey}\n- Size: ${fileSize} bytes.`;

      const params = {
        Message: message,
        Subject: "New File Upload Notification",
        TopicArn: process.env.SNS_TOPIC_ARN,
      };

      console.log(`Publishing to SNS: ${process.env.SNS_TOPIC_ARN}`);
      await sns.send(new PublishCommand(params));
    }
  } catch (error) {
    console.error("Error processing S3 event or publishing to SNS:", error);
    throw error;
  }
};
