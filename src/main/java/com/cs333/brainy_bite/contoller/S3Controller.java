package com.cs333.brainy_bite.contoller;

import com.cs333.brainy_bite.payload.request.PendingRequest;
import com.cs333.brainy_bite.repository.S3Repository;
import com.cs333.brainy_bite.service.S3Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/s3")
public class S3Controller {

    private final S3Service s3Service;

    @Autowired
    S3Repository s3Repository;

    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @GetMapping
    public String health() {
        return "UP";
    }

    @PostMapping(path = "/upload", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> uploadPending(
            @RequestParam("pdfFile") MultipartFile pdfFile,
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestParam("data") String jsonData) throws IOException {
        String pdfUrl = s3Service.uploadFileAndReturnUrl(pdfFile.getOriginalFilename(), pdfFile);
        String imageUrl = s3Service.uploadFileAndReturnUrl(imageFile.getOriginalFilename(), imageFile);
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            PendingRequest data = objectMapper.readValue(jsonData, PendingRequest.class);
            s3Repository.insertPendingArticle(data, pdfUrl, imageUrl);
            return new ResponseEntity<>("add pending article successfully", HttpStatus.CREATED);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Invalid JSON data", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(s3Service.getFile(fileName).getObjectContent()));
    }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<InputStreamResource> viewFile(@PathVariable String fileName) {
        var s3Object = s3Service.getFile(fileName);
        var content = s3Object.getObjectContent();
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG) //เปลี่ยนตามไฟล์
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\""+fileName+"\"")
                .body(new InputStreamResource(content));
    }

    @DeleteMapping("/delete/{fileName}")
    public String deleteFile(@PathVariable String fileName) {
        s3Service.deleteObject(fileName);
        return "File deleted";
    }
}
