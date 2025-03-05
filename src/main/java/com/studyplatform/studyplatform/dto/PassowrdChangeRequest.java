package com.studyplatform.studyplatform.dto;

import com.studyplatform.studyplatform.Model.User;

public class PassowrdChangeRequest {
	private User user;
	private String oldPassword;
    private String newPassword;
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public String getNewPassword() {
		return newPassword;
	}
	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}
	public String getOldPassword() {
		return oldPassword;
	}
	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}
}
