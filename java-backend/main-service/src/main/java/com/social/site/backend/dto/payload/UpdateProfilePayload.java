package com.social.site.backend.dto.payload;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class UpdateProfilePayload
{
    private MultipartFile profilePic;
    private MultipartFile coverPic;
}
