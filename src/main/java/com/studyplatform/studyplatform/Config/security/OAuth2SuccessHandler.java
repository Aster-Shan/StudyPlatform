package com.studyplatform.studyplatform.Config.security;


import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import  com.studyplatform.studyplatform.Model.User;
import  com.studyplatform.studyplatform.Repository.UserRepository;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
  
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String pictureUrl = oAuth2User.getAttribute("picture");
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                
                    if (name != null && name.contains(" ")) {
                        String[] nameParts = name.split(" ", 2);
                        newUser.setFirstName(nameParts[0]);
                        newUser.setLastName(nameParts[1]);
                    } else {
                        newUser.setFirstName(name);
                    }
                    
                    newUser.setProfilePictureUrl(pictureUrl);
                    newUser.setProvide(User.AuthProvider.GOOGLE);
                    newUser.setEnabled(true);
                    
                    return userRepository.save(newUser);
                });
        
        // Generate JWT token
        String token = tokenProvider.generateToken(user.getEmail());
        
        // Redirect to frontend with token
        String redirectUrl = "http://localhost:3000/oauth2/redirect?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}