package com.social.site.backend.service.post;

import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.dto.payload.CreatePostPayload;
import com.social.site.backend.dto.response.PostDto;
import com.social.site.backend.model.Post;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;


public interface IPostService
{
    List<PostDto> getAll();
    Post save(HttpServletRequest request, CreatePostPayload payload) throws AuthException;
    Post findPost(String id);
}
