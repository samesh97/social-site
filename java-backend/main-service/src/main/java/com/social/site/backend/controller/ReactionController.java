package com.social.site.backend.controller;

import com.social.site.backend.common.annotation.HandleAPIException;
import com.social.site.backend.common.api.HttpStatusCode;
import com.social.site.backend.common.api.Response;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.dto.payload.ReactionPayload;
import com.social.site.backend.model.Reaction;
import com.social.site.backend.service.reaction.IReactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/reactions")
public class ReactionController
{
    private final IReactionService reactionService;

    public ReactionController(IReactionService reactionService)
    {
        this.reactionService = reactionService;
    }

    @PostMapping
    @HandleAPIException
    public ResponseEntity<Response<String>> react(@RequestBody ReactionPayload payload) throws ValidationException
    {
        Reaction reaction = this.reactionService.save(payload);
        return Response.wrap(HttpStatusCode.SUCCESS, "Reacted!", null);
    }
}
