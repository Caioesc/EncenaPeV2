package com.encenape.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MensagemRequest {
    
    @Size(max = 255, message = "Remetente deve ter no máximo 255 caracteres")
    private String remetente;
    
    @NotBlank(message = "Texto é obrigatório")
    private String texto;
    
    @Email(message = "Email deve ter formato válido")
    @Size(max = 255, message = "Email de contato deve ter no máximo 255 caracteres")
    private String emailContato;
}
