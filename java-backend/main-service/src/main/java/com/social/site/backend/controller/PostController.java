package com.social.site.backend.controller;

import com.social.site.backend.common.annotation.HandleAPIException;
import com.social.site.backend.common.api.HttpStatusCode;
import com.social.site.backend.common.api.Response;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.common.exception.ftp.FileUploadException;
import com.social.site.backend.common.validator.Validator;
import com.social.site.backend.dto.payload.CreatePostPayload;
import com.social.site.backend.dto.response.PostDto;
import com.social.site.backend.service.post.IPostService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/posts")
public class PostController
{
    private final IPostService postService;

    public PostController(IPostService postService)
    {
        this.postService = postService;
    }

    @GetMapping(path = "")
    @HandleAPIException
    public ResponseEntity<Response<List<PostDto>>> fetchPosts()
    {
        return Response.wrap(HttpStatusCode.SUCCESS, postService.getAll());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @HandleAPIException
    public ResponseEntity<Response<String>> createPost(
            HttpServletRequest request,
            @ModelAttribute CreatePostPayload payload
    ) throws ValidationException, AuthException, FileUploadException
    {
        postService.save(request,payload);
        return Response.wrap(HttpStatusCode.SUCCESS,"Success", null);
    }
}
