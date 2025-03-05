package com.studyplatform.studyplatform.Controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.Service.UserService;
import com.studyplatform.studyplatform.dto.LoginRequest;
import com.studyplatform.studyplatform.dto.LoginResponse;
import com.studyplatform.studyplatform.dto.PassowrdChangeRequest;
import com.studyplatform.studyplatform.exception.ResourceNotFoundException;
import com.studyplatform.studyplatform.exception.ValidationException;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST,
		RequestMethod.PUT, RequestMethod.DELETE })
@RequestMapping("/api/users")
public class UserController {

	private static final Logger logger = LoggerFactory.getLogger(UserController.class);
	@Autowired
	private UserService userService;

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody User user) {
		try {
			User registeredUser = userService.registerUser(user);
			return ResponseEntity.ok(registeredUser);
		} catch (ValidationException e) {
			logger.warn("Validation error during user registration: {}", e.getMessage());
			return ResponseEntity.badRequest().body(e.getMessage());
		} catch (Exception e) {
			logger.error("Unexpected error during user registration", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An unexpected error occurred during registration: " + e.getMessage());
		}
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
		try {
			String email = request.getEmail();
			String password = request.getPassword();
			LoginResponse response = userService.login(email, password);

			return ResponseEntity.ok(response);
		} catch (Exception e) {
			System.out.println(e);
			return ResponseEntity.badRequest().body(new LoginResponse(null, null, e.getMessage()));
		}
	}

	@PostMapping("/forgot-password")
	public void forgotPassword(@RequestBody String email) {
		userService.forgetpassword(email);
	}

	@PutMapping("/reset-password")
	public void resetPassword(@RequestParam String token, @RequestBody String newPassword) {
		userService.resetPassword(token, newPassword);
	}

	@PostMapping("/verify-email")
	public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
		try {
			userService.verifyUser(token);
			return ResponseEntity.ok("Email verified successfully!");
		} catch (Exception e) {
			return ResponseEntity.status(400).body("Invalid verification token or user not found.");
		}
	}

	@PutMapping("/update")
	public ResponseEntity<User> updateUser(@RequestBody User user) {
		User updatedUser = userService.updateUser(user);
		return ResponseEntity.ok(updatedUser);
	}

	@PostMapping("/update-password")
	public ResponseEntity<?> updatePassword(@RequestBody PassowrdChangeRequest request) {
	    try {
	        User updatedUser = userService.changePassword(request.getUser(), request.getOldPassword(), request.getNewPassword());
	        return ResponseEntity.ok(updatedUser);
	    } catch (ValidationException e) {
	        return ResponseEntity.badRequest().body(Map.of(
	            "error", "Validation Error",
	            "message", e.getMessage()
	        ));
	    } catch (ResourceNotFoundException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
	            "error", "User Not Found",
	            "message", e.getMessage()
	        ));
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
	            "error", "Internal Server Error",
	            "message", "An unexpected error occurred"
	        ));
	    }
	}

	@GetMapping("/get-user")
	public ResponseEntity<User> getUser(@RequestParam("token") Long id) {
		User updatedUser = userService.getUser(id);
		return ResponseEntity.ok(updatedUser);
	}

}
