package com.social.site.backend.common.ftp;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.social.site.backend.common.exception.ftp.FileUploadException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.UUID;

@Component
public class FirebaseFileUploader implements FileUploader
{
    private static final String BUCKET_NAME = "social-site-211f3.appspot.com";
    private static final String CONFIG_FILE_NAME = "firebase-private-key.json";

    @Override
    public String uploadFile(MultipartFile multipartFile, String subFolder) throws FileUploadException
    {
        try
        {
            String fileName = multipartFile.getOriginalFilename();
            fileName = UUID.randomUUID().toString().concat(this.getExtension(fileName));

            File file = this.convertToFile(multipartFile, fileName);
            String URL = this.uploadFile(file, fileName);
            file.delete();
            return URL;
        }
        catch (Exception e)
        {
            throw new FileUploadException(e.getMessage());
        }
    }

    private File convertToFile(MultipartFile multipartFile, String fileName) throws IOException
    {
        File file = new File(fileName);
        try(FileOutputStream fos =  new FileOutputStream(file))
        {
            fos.write(multipartFile.getBytes());
        }
        return file;
    }

    private String uploadFile(File file, String fileName) throws IOException
    {
        BlobId blobId = BlobId.of(BUCKET_NAME, fileName); // Replace with your bucker name
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType("media").build();
        InputStream inputStream = FirebaseFileUploader.class.getClassLoader().getResourceAsStream(CONFIG_FILE_NAME); // change the file name with your one
        Credentials credentials = GoogleCredentials.fromStream(inputStream);
        Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
        storage.create(blobInfo, Files.readAllBytes(file.toPath()));

        String DOWNLOAD_URL = "https://firebasestorage.googleapis.com/v0/b/" + BUCKET_NAME + "/o/%s?alt=media";
        return String.format(DOWNLOAD_URL, URLEncoder.encode(fileName, StandardCharsets.UTF_8));
    }

    private String getExtension(String fileName)
    {
        return fileName.substring(fileName.lastIndexOf("."));
    }
}
