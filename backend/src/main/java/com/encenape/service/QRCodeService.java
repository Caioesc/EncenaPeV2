package com.encenape.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
@Slf4j
public class QRCodeService {
    
    @Value("${app.frontend-url}")
    private String frontendUrl;
    
    public String generateQRCode(String codigo) {
        try {
            String qrData = frontendUrl + "/ingresso/" + codigo;
            
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrData, BarcodeFormat.QR_CODE, 200, 200);
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            
            byte[] qrCodeBytes = outputStream.toByteArray();
            String base64QRCode = Base64.getEncoder().encodeToString(qrCodeBytes);
            
            return "data:image/png;base64," + base64QRCode;
            
        } catch (WriterException | IOException e) {
            log.error("Erro ao gerar QR Code para código: {}", codigo, e);
            throw new RuntimeException("Erro ao gerar QR Code", e);
        }
    }
    
    public String generateQRCodeDataUrl(String codigo) {
        return generateQRCode(codigo);
    }
}
