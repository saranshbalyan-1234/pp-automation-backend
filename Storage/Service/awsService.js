import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import errorContstants from '#constants/error.js';

export const s3 = new S3({
  credentials: {
    accessKeyId: '',
    secretAccessKey: ''
  },
  region: 'ap-south-1'
});

export const listBuckets = () => {
  try {
    s3.listBuckets((err, data) => {
      if (err) throw new Error(err);
      return data.Buckets;
    });
  } catch (error) {
    console.error('Unable to list buckets from S3', error);
  }
};

export const uploadFile = async (file, bucketName, keyName) => {
  try {
    // Setting up S3 upload parameters
    if (!bucketName) throw new Error(errorContstants.INVALID_BUCKET);
    if (!keyName || !file) throw new Error(errorContstants.INVALID_FILE);

    const uploadParams = {
      Body: file.data,
      Bucket: bucketName.toLowerCase(),
      Key: keyName
    };

    return await new Upload({
      client: s3,
      params: uploadParams
    }).done();
  } catch (error) {
    console.error('Unable to upload file to aws S3', error);
  }
};

export const createBucket = (bucketName) => {
  try {
    if (!bucketName) throw new Error(errorContstants.INVALID_BUCKET);
    const bucketParams = {
      Bucket: bucketName.toLowerCase(),
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1'
      }
    };

    s3.createBucket(bucketParams, (err, data) => {
      if (err) {
        console.error('Failed to create s3 bucket', err);
      } else {
        console.log(`Created s3 bucket ${bucketName.toLowerCase()}`, data.Location);
      }
    });
  } catch (error) {
    console.error('Unable to create S3 bucket', error);
  }
};

export const deleteBucket = (bucketName) => {
  try {
    if (process.env.MULTI_TENANT === 'false') return;
    if (!bucketName) throw new Error(errorContstants.INVALID_BUCKET);

    const bucketParams = {
      Bucket: bucketName.toLowerCase()
    };

    s3.deleteBucket(bucketParams, (err) => {
      if (err) {
        console.error(`Failed to delete s3 bucket ${bucketName.toLowerCase()}`);
        console.error(err);
      } else {
        console.log(`Deleted s3 bucket ${bucketName.toLowerCase()}`);
      }
    });
  } catch (error) {
    console.error('Unable to delete S3 bucket', error);
  }
};

export const listObjectsInBucket = (bucketName) => {
  try {
    if (!bucketName) throw new Error(errorContstants.INVALID_BUCKET);

    const bucketParams = {
      Bucket: bucketName.toLowerCase()
    };

    s3.listObjects(bucketParams, (err, data) => {
      if (err) throw new Error(err);
      return data;
    });
  } catch (error) {
    console.error('Unable to list objects in AWS S3', error);
    return false;
  }
};

export const deleteObject = (bucketName, key) => {
  try {
    if (!bucketName) throw new Error(errorContstants.INVALID_BUCKET);
    if (!key) throw new Error(errorContstants.INVALID_FILE);

    s3.deleteObject({ Bucket: bucketName.toLowerCase(), key }, (err) => {
      if (err) return false;
      return true;
    });
  } catch (err) {
    console.error('Unable to delete S3 Object', err);
  }
};

export const getAwsObject = async (bucketName, key) => {
  try {
    if (!bucketName) throw new Error(errorContstants.INVALID_BUCKET);
    if (!key) throw new Error(errorContstants.INVALID_FILE);

    const getParams = {
      Bucket: bucketName.toLowerCase(),
      Key: key
    };
    const data = await s3.getObject(getParams);
    if (!data) throw new Error('Object Not Found');

    let temp = '';
    if (data.Body) {
      temp = await data.Body.transformToString('base64');
    } else {
      temp = data;
    }
    return temp;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteS3Folder = (bucketName, folderName) => {
  if (!bucketName) throw new Error(errorContstants.INVALID_BUCKET);
  if (!folderName) throw new Error(errorContstants.INVALID_FOLDER);

  let params = {
    Bucket: bucketName.toLowerCase(),
    Prefix: `${folderName}/`
  };
  try {
    s3.listObjects(params, (err, data) => {
      if (err) return console.log(err);

      if (data.Contents.length === 0) return;

      params = { Bucket: bucketName };
      params.Delete = { Objects: [] };

      data.Contents.forEach((content) => {
        params.Delete.Objects.push({ Key: content.Key });
      });

      s3.deleteObjects(params, (err, data) => {
        if (err) return console.log(err);
        if (data.Errors?.length > 0) {
          console.log('Error in Deleting S3 Files');
          console.log(data.Errors);
        }
      });
    });
  } catch (error) {
    console.error(error);
    console.error('something went wrong to delete s3 folder');
  }
};
