package br.com.terranova.utils;

import br.com.terranova.exceptions.ValidacaoException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public final class PasswordUtils {

    private static final SecureRandom RANDOM = new SecureRandom();

    private PasswordUtils() {
    }

    public static String gerarHash(String senha) {
        if (senha == null || senha.isBlank()) {
            throw new ValidacaoException("senha deve ser informada.");
        }
        byte[] salt = new byte[16];
        RANDOM.nextBytes(salt);
        byte[] hash = gerarSha256(salt, senha);
        return "sha256$" + Base64.getEncoder().encodeToString(salt) + "$"
                + Base64.getEncoder().encodeToString(hash);
    }

    private static byte[] gerarSha256(byte[] salt, String senha) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(salt);
            digest.update(senha.getBytes(StandardCharsets.UTF_8));
            return digest.digest();
        } catch (NoSuchAlgorithmException exception) {
            throw new ValidacaoException("Nao foi possivel gerar o hash da senha.", exception);
        }
    }
}
