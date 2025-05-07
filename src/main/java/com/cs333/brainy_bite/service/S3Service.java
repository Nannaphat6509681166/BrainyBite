package com.cs333.brainy_bite.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class S3Service {
    private AmazonS3 s3client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public S3Service(AmazonS3 s3client) {
        this.s3client = s3client;
    }

    public void uploadFile(String objectName, MultipartFile file) throws IOException {
        var putObjectResult = s3client.putObject(bucketName, objectName, file.getInputStream(), null);
        //log.info(putObjectResult.getMetadata());
    }

    public String uploadFileAndReturnUrl(String objectName, MultipartFile file) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType()); // เช่น application/pdf หรือ image/jpeg

        // อัปโหลดไฟล์ไปยัง S3
        PutObjectRequest request = new PutObjectRequest(bucketName, objectName, file.getInputStream(), metadata);
        s3client.putObject(request);

        // Return the file URL
        return s3client.getUrl(bucketName, objectName).toString();
    }

    public S3Object getFile(String objectName) {
        return s3client.getObject(bucketName, objectName);
    }

    public void deleteObject(String objectName) {
        DeleteObjectRequest deleteObjectRequest = new DeleteObjectRequest(bucketName, objectName);
        s3client.deleteObject(deleteObjectRequest);
    }

}
