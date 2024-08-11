package com.social.site.backend.validator;

import com.social.site.backend.exception.ValidationException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;

import java.util.Set;
import java.util.stream.Collectors;

public final class Validator
{
    private Validator() {}

    public static <T> void validate( T object )
    {
        Set<ConstraintViolation<T>> validations = Validation.buildDefaultValidatorFactory().getValidator().validate( object );
        if( validations.isEmpty() )
        {
            return;
        }
        throw new ValidationException( validations.stream().findFirst().get().getMessage() );
    }
}
