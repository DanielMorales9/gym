package it.gym.dto;

import java.io.Serializable;

public class IconDTO implements Serializable {

  String src;
  String sizes;
  String type;

  public IconDTO(String src, String sizes, String type) {
    this.src = src;
    this.sizes = sizes;
    this.type = type;
  }

  public String getSrc() {
    return src;
  }

  public void setSrc(String src) {
    this.src = src;
  }

  public String getSizes() {
    return sizes;
  }

  public void setSizes(String sizes) {
    this.sizes = sizes;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }
}
