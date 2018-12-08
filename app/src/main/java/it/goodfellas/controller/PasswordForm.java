package it.goodfellas.controller;

class PasswordForm {
    private String oldPassword;
    private String password;
    private String confirmPassword;

    PasswordForm() {
    }

    @Override
    public String toString() {
        return this.oldPassword + " " + this.password + " " + this.confirmPassword;
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