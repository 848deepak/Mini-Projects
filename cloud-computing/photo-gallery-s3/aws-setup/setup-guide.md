# AWS S3 Static Website Setup

This guide details the steps to launch a static website purely via AWS S3 using the AWS CLI.

## 1. Create S3 Bucket
Create a new unique bucket. Bucket names must be globally unique across all of AWS.

```bash
aws s3 mb s3://my-cloud-portfolio-gallery-bucket
```

## 2. Enable Static Website Hosting
Configure the bucket to serve website files. We indicate that `index.html` is our root document.

```bash
aws s3 website s3://my-cloud-portfolio-gallery-bucket/ --index-document index.html
```

## 3. Disable Block Public Access
Before we can apply a public policy, we must uncheck the block public access settings on the bucket.

```bash
aws s3api put-public-access-block \
    --bucket my-cloud-portfolio-gallery-bucket \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

## 4. Apply Public Bucket Policy
Apply the bucket policy that grants everyone `s3:GetObject` permission. This allows browsers to read your HTML/JS/image files.

```bash
# Ensure you replace the ARN in the JSON with your actual bucket name
aws s3api put-bucket-policy \
    --bucket my-cloud-portfolio-gallery-bucket \
    --policy file://bucket-policy.json
```

## 5. Sync the Content Directory
Upload all the files from the local `gallery/` folder to the root of your newly configured bucket.

```bash
aws s3 sync ../gallery/ s3://my-cloud-portfolio-gallery-bucket/
```

## 6. Access Your Gallery
You can now access your gallery at the standard S3 website endpoint format:
`http://my-cloud-portfolio-gallery-bucket.s3-website-<aws-region>.amazonaws.com`

**Uploading new photos:**
```bash
aws s3 cp new-photo.jpg s3://my-cloud-portfolio-gallery-bucket/
```
