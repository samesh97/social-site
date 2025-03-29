package com.social.site.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.sql.Timestamp;

@Getter
@Setter
public class BaseDto
{
    protected Timestamp createdAt;
    protected Timestamp updatedAt;
}
