package com.encenape.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    
    @Size(max = 255, message = "Nome deve ter no máximo 255 caracteres")
    private String nome;
    
    @Email(message = "Email deve ter formato válido")
    @Size(max = 255, message = "Email deve ter no máximo 255 caracteres")
    private String email;
    
    @Pattern(regexp = "^\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}$", message = "Telefone deve ter formato válido")
    @Size(max = 50, message = "Telefone deve ter no máximo 50 caracteres")
    private String telefone;
    
    @Size(max = 1024, message = "URL do avatar deve ter no máximo 1024 caracteres")
    private String avatarUrl;
    
    @Size(max = 1000, message = "Bio deve ter no máximo 1000 caracteres")
    private String bio;
}
