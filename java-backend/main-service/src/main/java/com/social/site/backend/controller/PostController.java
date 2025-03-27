package com.social.site.backend.controller;

import com.social.site.backend.common.api.HttpStatusCode;
import com.social.site.backend.common.api.Response;
import com.social.site.backend.model.Post;
import com.social.site.backend.model.PostImage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/posts")
public class PostController
{
    @GetMapping(path = "")
    public ResponseEntity<Response<List<Post>>> fetchPosts()
    {
        Post post = new Post();
        PostImage postImage = new PostImage();
        postImage.setImageUrl("https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2018/09/1200/675/8Kenyawildlife.jpg?ve=1&tl=1");
        post.setPostImages(List.of(postImage));
        return Response.wrap(HttpStatusCode.SUCCESS, List.of(post));
    }
}
