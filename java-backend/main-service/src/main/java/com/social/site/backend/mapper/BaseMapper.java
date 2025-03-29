package com.social.site.backend.mapper;

import com.social.site.backend.dto.response.BaseDto;
import com.social.site.backend.model.BaseModel;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BaseMapper
{
    default void mapBaseModelToBaseDTO(BaseModel baseModel, @MappingTarget BaseDto baseDTO)
    {
        baseDTO.setCreatedAt(baseModel.getCreatedAt());
        baseDTO.setUpdatedAt(baseModel.getUpdatedAt());
    }
}
