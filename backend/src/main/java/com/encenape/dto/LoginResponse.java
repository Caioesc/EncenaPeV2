package com.encenape.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    
    private String accessToken;
    private Long expiresIn;
    private UserResponse user;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String nome;
        private String email;
        private String telefone;
        private String avatarUrl;
        private String bio;
        private List<String> roles;
    }
}
