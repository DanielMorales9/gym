package it.gym.pojo;

import lombok.Data;

import java.util.List;

@Data
public class Manifest {

    String name;
    String short_name;
    String theme_color;
    String background_color;

    List<Icon> icons;

    String display = "standalone";
    String scope = "/";
    String start_url = "/";

    public List<Icon> getIcons() {
        return icons;
    }

    public void setIcons(List<Icon> icons) {
        this.icons = icons;
    }

    public String getTheme_color() {
        return theme_color;
    }

    public void setTheme_color(String theme_color) {
        this.theme_color = theme_color;
    }

    public String getBackground_color() {
        return background_color;
    }

    public void setBackground_color(String background_color) {
        this.background_color = background_color;
    }

    public String getDisplay() {
        return display;
    }

    public String getScope() {
        return scope;
    }

    public String getStart_url() {
        return start_url;
    }

    public String getShort_name() {
        return short_name;
    }

    public void setShort_name(String short_name) {
        this.short_name = short_name;
    }

    public String getName() {
        return name;
    }

    public void setName(String fullName) {
        this.name = fullName;
    }
}
