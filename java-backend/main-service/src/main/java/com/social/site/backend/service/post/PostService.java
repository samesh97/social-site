package com.social.site.backend.service.post;

import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.common.ftp.FileUploader;
import com.social.site.backend.dto.payload.CreatePostPayload;
import com.social.site.backend.dto.response.PostDto;
import com.social.site.backend.enums.TokenType;
import com.social.site.backend.mapper.PostMapper;
import com.social.site.backend.model.Post;
import com.social.site.backend.model.PostImage;
import com.social.site.backend.model.User;
import com.social.site.backend.repositoy.PostRepository;
import com.social.site.backend.service.user.IUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService implements IPostService
{
    private final PostRepository repository;
    private final FileUploader fileUploader;
    private final IUserService userService;
    private final PostMapper postMapper;

    public PostService(PostRepository postRepository, FileUploader fileUploader,IUserService userService,PostMapper postMapper)
    {
        this.repository = postRepository;
        this.fileUploader = fileUploader;
        this.userService = userService;
        this.postMapper = postMapper;
    }

    @Override
    public List<PostDto> getAll()
    {
        return postMapper.convert(repository.findAll());
    };

    @Override
    public Post save(HttpServletRequest request,CreatePostPayload payload) throws AuthException
    {
        User user = userService.getUserFromToken(request, TokenType.ACCESS_TOKEN);

        Post post = new Post();
        post.setUser(user);
        post.setDescription(payload.getDescription());

        List<PostImage> postImages = new ArrayList<>();
        for(MultipartFile multipartFile: payload.getPostImages())
        {
            String downloadUrl = fileUploader.uploadFile(multipartFile,null);
            PostImage postImage = new PostImage();
            postImage.setImageUrl(downloadUrl);
            postImage.setPost(post);
            postImages.add(postImage);
        }
        post.setPostImages(postImages);
        return repository.save(post);
    }

    @Override
    public Post findPost(String id)
    {
        return repository.findById(id).orElse(null);
    }
}
