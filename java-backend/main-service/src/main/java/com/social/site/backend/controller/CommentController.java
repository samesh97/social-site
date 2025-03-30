package com.social.site.backend.controller;

import com.social.site.backend.common.annotation.HandleAPIException;
import com.social.site.backend.common.api.HttpStatusCode;
import com.social.site.backend.common.api.Response;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.dto.payload.CommentPayload;
import com.social.site.backend.dto.response.CommentDto;
import com.social.site.backend.model.Comment;
import com.social.site.backend.service.comment.ICommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/comments")
public class CommentController
{
    private final ICommentService commentService;

    public CommentController(ICommentService commentService)
    {
        this.commentService = commentService;
    }

    @PostMapping
    @HandleAPIException
    public ResponseEntity<Response<String>> createComment(@RequestBody CommentPayload commentPayload) throws ValidationException
    {
        Comment comment = commentService.save(commentPayload);
        return Response.wrap(HttpStatusCode.SUCCESS,"comment created.", null);
    }

    @GetMapping
    @HandleAPIException
    public ResponseEntity<Response<List<CommentDto>>> fetchPostComments(@RequestParam String postId) throws ValidationException
    {
        List<CommentDto> commentDto = commentService.fetchPostComments(postId);
        return Response.success(commentDto);
    }
}
