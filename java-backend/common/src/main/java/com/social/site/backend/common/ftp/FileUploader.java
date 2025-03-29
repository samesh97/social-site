package com.social.site.backend.common.ftp;

import org.springframework.web.multipart.MultipartFile;

public interface FileUploader
{
    String uploadFile(MultipartFile file, String subFolder);
}
