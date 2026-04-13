const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");

const s3 = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });

module.exports.handler = async (event) => {
  console.log("Reading options from event:", JSON.stringify(event, null, 2));

  try {
    for (const record of event.Records) {
      const srcBucket = record.s3.bucket.name;
      // Object key may have spaces or unicode non-ASCII characters
      const srcKey    = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
      const dstBucket = process.env.DEST_BUCKET;
      const dstKey    = "resized-" + srcKey;

      // Infer the image type from the file suffix
      const typeMatch = srcKey.match(/\.([^.]*)$/);
      if (!typeMatch) {
        console.log("Could not determine the image type.");
        return;
      }

      // Check that the image type is supported
      const imageType = typeMatch[1].toLowerCase();
      if (imageType != "jpg" && imageType != "jpeg" && imageType != "png") {
        console.log(`Unsupported image type: ${imageType}`);
        return;
      }

      // Download the image from the S3 source bucket
      console.log(`Downloading ${srcKey} from ${srcBucket}`);
      const getObjectParams = {
        Bucket: srcBucket,
        Key: srcKey,
      };
      
      const response = await s3.send(new GetObjectCommand(getObjectParams));
      
      // Read stream into buffer
      const streamToBuffer = (stream) =>
        new Promise((resolve, reject) => {
          const chunks = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () => resolve(Buffer.concat(chunks)));
        });
      
      const origImage = await streamToBuffer(response.Body);

      // Perform the resize operation
      console.log(`Resizing the image to width 200...`);
      const buffer = await sharp(origImage).resize(200).toBuffer();

      // Upload the thumbnail to the destination bucket
      console.log(`Uploading thumbnail to ${dstBucket}/${dstKey}`);
      const putObjectParams = {
        Bucket: dstBucket,
        Key: dstKey,
        Body: buffer,
        ContentType: "image",
      };

      await s3.send(new PutObjectCommand(putObjectParams));
      console.log(`Successfully resized ${srcKey} and uploaded to ${dstBucket}/${dstKey}`);
    }
  } catch (error) {
    console.log("Error resizing image:", error);
    throw error;
  }
};
