package kal.com.rolegames.exceptions;

import kal.com.rolegames.dto.SimpleErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class SimpleGlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(SimpleGlobalExceptionHandler.class);

    // ========================================
    // EXCEPCIONES DE NEGOCIO (NO DE SEGURIDAD)
    // ========================================

    // 404 - Resource Not Found
    @ExceptionHandler({
            NoResourceFoundException.class,
//            ResourceNotFoundException.class,
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

    // 400 - Bad Request / Validation
    @ExceptionHandler({
//            ValidationException.class,
            IllegalArgumentException.class})
    public ResponseEntity<SimpleErrorResponse> handleBadRequest(Exception ex) {
        logger.warn("Bad request: {}", ex.getMessage());

        SimpleErrorResponse error = SimpleErrorResponse.builder()
                .status(400)
                .code("BAD_REQUEST")
                .message(ex.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // 400 - Validation Errors (Spring Validation)
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
     * Maneja excepciones de email ya en uso
     */
    @ExceptionHandler(EmailAlreadyInUseException.class)
    public ResponseEntity<ErrorResponse> handleEmailAlreadyInUse(EmailAlreadyInUseException e) {
        logger.warn("Email ya en uso: {}", e.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.CONFLICT.value())
                .error("Email Already In Use")
                .message(e.getMessage())
                .path("/api/auth/register")
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    /**
     * Maneja excepciones de username ya en uso
     */
    @ExceptionHandler(UsernameAlreadyInUseException.class)
    public ResponseEntity<ErrorResponse> handleUsernameAlreadyInUse(UsernameAlreadyInUseException e) {
        logger.warn("Username ya en uso: {}", e.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.CONFLICT.value())
                .error("Username Already In Use")
                .message(e.getMessage())
                .path("/api/auth/register")
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    /**
     * Maneja excepciones de tipo de usuario inválido
     */
    @ExceptionHandler(InvalidUserTypeException.class)
    public ResponseEntity<ErrorResponse> handleInvalidUserType(InvalidUserTypeException e) {
        logger.warn("Tipo de usuario inválido: {}", e.getMessage());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Invalid User Type")
                .message(e.getMessage())
                .path("/api/auth/register")
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * Maneja excepciones de registro de usuario
     */
    @ExceptionHandler(UserRegistrationException.class)
    public ResponseEntity<ErrorResponse> handleUserRegistration(UserRegistrationException e) {
        logger.error("Error en registro de usuario: {}", e.getMessage(), e);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("User Registration Error")
                .message("Error interno durante el registro. Intenta nuevamente.")
                .path("/api/auth/register")
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }


    // 500 - Internal Server Error
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

    /**
     * Clase para estructurar las respuestas de error
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ErrorResponse {
        private LocalDateTime timestamp;
        private int status;
        private String error;
        private String message;
        private String path;
        private Map<String, String> details;
    }
}
