package it.gym.dto;

public class PasswordFormDTO {
  private String oldPassword;
  private String password;
  private String confirmPassword;

  public PasswordFormDTO() {}

  public PasswordFormDTO(
      String oldPassword, String password, String confirmPassword) {
    this.oldPassword = oldPassword;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }

  public String getPassword() {
    return password;
  }

  public String getConfirmPassword() {
    return confirmPassword;
  }

  public String getOldPassword() {
    return oldPassword;
  }

  public void setConfirmPassword(String confirmPassword) {
    this.confirmPassword = confirmPassword;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public void setOldPassword(String oldPassword) {
    this.oldPassword = oldPassword;
  }
}
