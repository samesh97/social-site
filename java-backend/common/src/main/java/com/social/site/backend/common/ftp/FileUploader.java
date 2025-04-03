package com.social.site.backend.common.ftp;

import com.social.site.backend.common.exception.ftp.FileUploadException;
import org.springframework.web.multipart.MultipartFile;

public interface FileUploader
{
    String uploadFile(MultipartFile file, String subFolder) throws FileUploadException;
}
