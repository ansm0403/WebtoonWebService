package com.pknuwws.wws.config.security;



import com.pknuwws.wws.user.infrastructure.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

import static com.pknuwws.wws.config.security.JwtExceptionCode.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;

    @Value("${JWT.secret_key}")
    private String secretKey;

    @Value("${JWT.token.access-expiration-time}")
    private long accessExpirationTime;

    @Value("${JWT.token.refresh-expiration-time}")
    private long refreshExpirationTime;

    @Value("${JWT.expiration_time}")
    private long expirationTime;



    /**
     * 2
     * @param token
     * @param claimsResolver jwt토큰에서 추출한 정보를 어떻게 처리할지 결정하는 함수
     * @return jwt토큰에서 모든 클레임(클레임은 토큰에 담긴 정보 의미 ) 추출한 다음 claimsResolver함수를 처리해 결과 반환
     *
     */

    public <T> T extractClaims(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /** 3
     * @param token
     * 주어진 JWT 토큰에서 모든 클레임을 추출하여 반환합니다.
     * 토큰의 서명을 확인하기 위해 사용할 서명 키(getSigningKey())를 설정하고 토큰을 파싱하여 클레임들을 추출합니다.
     */
    private Claims extractAllClaims(String token) throws SecurityCustomException {
        try {
            return Jwts
                    .parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token) // 이 단계에서 token의 유효성 검사 및 만료일 검사를 실시한다!
                    .getBody();
        }
        // parseClaimsJws에서 토큰이 잘못된 경우 error를 발생시킨다! -> 발생한 오류는 ExceptionHandlerFilter로 가서 처리된다!
        catch (ExpiredJwtException e) {
            log.error("토큰오류 -> " + e);
            throw new SecurityCustomException(EXPIRED_TOKEN);
        }
        catch (SignatureException e){
            log.error("토큰오류 -> " + e);
            throw new SecurityCustomException(WRONG_TYPE_TOKEN);
        }
        catch (MalformedJwtException e){
            log.error("토큰오류 -> " + e);
            throw new SecurityCustomException(UNSUPPORTED_TOKEN);
        }
        catch (IllegalArgumentException e) {
            log.info("IllegalArgumentException");
            throw new SecurityCustomException(UNKNOWN_ERROR);
        }

    }
    /** 4
     *  JWT 토큰의 서명을 확인하기 위해 사용할 서명 키를 생성하여 반환합니다
     */
    private Key getSigningKey() {
        byte[] keyByte = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyByte);
    }

    /**
     * 1.
     * @param userDetails 사용자 정보
     * @return 클레임 정보와 사용자 정보를 기반으로 jwt 토큰 생성
     * 클레임 정보, 사용자 ID, 생성 시간, 만료 시간 등을 설정하고, 서명 알고리즘과 서명 키를 사용하여 토큰을 생성합니다.
     * Access TOken 역활
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(Map.of(), userDetails);
    }

    public String generateToken(Map<String,Object> extractClaims, UserDetails userDetails){
        return buildToken(extractClaims, userDetails, accessExpirationTime);
    }


    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    /**
     * Refresh 토큰 생성
     */
    public String generateRefreshToken(UserDetails userDetails){

        String refreshToken = buildToken(Map.of(), userDetails, refreshExpirationTime);
        // redis에 저장
        redisTemplate.opsForValue().set(
                userDetails.getUsername(),
                refreshToken,
                refreshExpirationTime,
                TimeUnit.MILLISECONDS
        );
        log.info("refreshExpirationTime={}",refreshExpirationTime);
        log.info("TimeUnit.MILLISECONDS={}",TimeUnit.MILLISECONDS);

        return refreshToken;
    }


    /**
     * 5
     * @param token 검증할 토큰
     * @param userDetails 사용자 정보
     * @return jwt토큰 유효성 검사
     * 토큰에서 추출한 UUID가 userDetails에서 가져온 사용자 id가 일치하며
     * 토큰이 만료되지 않은경우 토큰 유효
     */
    public boolean validateToken(String token, UserDetails userDetails){
            final String userId = getUserId(token);
            return (userId.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }


    /** 6
     *  주어진 JWT 토큰에서 UUID(사용자 ID) 클레임을 추출하여 반환합니다.
     */
    public String getUserId(String token) {
            return extractClaims(token, Claims::getSubject);
    }


    /** 7
     * 만료 비교
     */
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /** 8
     * 주어진 JWT 토큰에서 만료 시간 클레임을 추출하여 반환합니다.
     */
    private Date extractExpiration(String token) {
        return extractClaims(token,Claims::getExpiration);
    }

    //즉, 이 코드는 주어진 비밀 키 (secretKey)를 사용하여 HMAC-SHA 키를 생성하고 반환하는 메서드를 정의하고 있으며,
    // 이 키는 보안 관련 작업에서 사용될 수 있습니다.
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }





}