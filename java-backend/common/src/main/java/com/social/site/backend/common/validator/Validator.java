package com.social.site.backend.common.validator;

import com.social.site.backend.common.exception.ValidationException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;

import java.util.Set;

public final class Validator
{
    private Validator() {}

    public static <T> void validate( T object ) throws ValidationException
    {
        Set<ConstraintViolation<T>> validations = Validation.buildDefaultValidatorFactory().getValidator().validate( object );
        if( validations.isEmpty() )
        {
            return;
        }
        throw new ValidationException( validations.stream().findFirst().get().getMessage() );
    }
}
