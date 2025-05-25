package kal.com.rolegames.exceptions;

import kal.com.rolegames.dto.SimpleErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.NoSuchElementException;

@RestControllerAdvice
@Order(1) // Asegurar que este handler tenga prioridad
public class SimpleGlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(SimpleGlobalExceptionHandler.class);

    // ========================================
    // EXCEPCIONES DE AUTENTICACIÓN/AUTORIZACIÓN
    // ========================================

    /**
     * Maneja excepciones de email ya en uso - 409 CONFLICT
     */
    @ExceptionHandler(EmailAlreadyInUseException.class)
    public ResponseEntity<SimpleErrorResponse> handleEmailAlreadyInUse(EmailAlreadyInUseException e) {
        logger.warn("Email ya en uso: {}", e.getMessage());

        SimpleErrorResponse errorResponse = SimpleErrorResponse.builder()
                .status(HttpStatus.CONFLICT.value())
                .code("EMAIL_ALREADY_IN_USE")
                .message(e.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    /**
     * Maneja excepciones de username ya en uso - 409 CONFLICT
     */
    @ExceptionHandler(UsernameAlreadyInUseException.class)
    public ResponseEntity<SimpleErrorResponse> handleUsernameAlreadyInUse(UsernameAlreadyInUseException e) {
        logger.warn("Username ya en uso: {}", e.getMessage());

        SimpleErrorResponse errorResponse = SimpleErrorResponse.builder()
                .status(HttpStatus.CONFLICT.value())
                .code("USERNAME_ALREADY_IN_USE")
                .message(e.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    /**
     * Maneja excepciones de tipo de usuario inválido - 400 BAD REQUEST
     */
    @ExceptionHandler(InvalidUserTypeException.class)
    public ResponseEntity<SimpleErrorResponse> handleInvalidUserType(InvalidUserTypeException e) {
        logger.warn("Tipo de usuario inválido: {}", e.getMessage());

        SimpleErrorResponse errorResponse = SimpleErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .code("INVALID_USER_TYPE")
                .message(e.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * Maneja excepciones de registro de usuario - 500 INTERNAL ERROR
     */
    @ExceptionHandler(UserRegistrationException.class)
    public ResponseEntity<SimpleErrorResponse> handleUserRegistration(UserRegistrationException e) {
        logger.error("Error en registro de usuario: {}", e.getMessage(), e);

        SimpleErrorResponse errorResponse = SimpleErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .code("USER_REGISTRATION_ERROR")
                .message("Error interno durante el registro. Intenta nuevamente.")
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    // ========================================
    // EXCEPCIONES GENERALES
    // ========================================

    /**
     * 404 - Resource Not Found
     */
    @ExceptionHandler({
            NoResourceFoundException.class,
            NoSuchElementException.class})
    public ResponseEntity<SimpleErrorResponse> handleNotFound(Exception ex) {
        logger.warn("Resource not found: {}", ex.getMessage());

        SimpleErrorResponse error = SimpleErrorResponse.builder()
                .status(404)
                .code("RESOURCE_NOT_FOUND")
                .message(ex.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * 400 - Bad Request (SOLO para IllegalArgumentException que NO sean las excepciones de auth)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<SimpleErrorResponse> handleBadRequest(IllegalArgumentException ex) {
        logger.warn("Bad request: {}", ex.getMessage());

        SimpleErrorResponse error = SimpleErrorResponse.builder()
                .status(400)
                .code("BAD_REQUEST")
                .message(ex.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * 400 - Validation Errors (Spring Validation)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<SimpleErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .reduce((a, b) -> a + ", " + b)
                .orElse("Validation failed");

        logger.warn("Validation error: {}", message);

        SimpleErrorResponse error = SimpleErrorResponse.builder()
                .status(400)
                .code("VALIDATION_ERROR")
                .message(message)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * 500 - Internal Server Error (Debe ser el último para capturar todo lo demás)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<SimpleErrorResponse> handleGenericError(Exception ex) {
        logger.error("Unexpected error: ", ex);

        SimpleErrorResponse error = SimpleErrorResponse.builder()
                .status(500)
                .code("INTERNAL_ERROR")
                .message("Internal server error occurred")
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}