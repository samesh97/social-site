package com.social.site.backend.dto.payload;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CreatePostPayload
{
    private String description;
    private List<MultipartFile> postImages = new ArrayList<>();
}
