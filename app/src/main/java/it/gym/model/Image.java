package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "images")
public class Image implements Serializable {

  public Image() {}

  public Image(String name, String type, byte[] picByte, AUser user) {
    this.name = name;
    this.type = type;
    this.picByte = picByte;
    this.user = user;
  }

  public Image(String name, String type, byte[] picByte) {
    this.name = name;
    this.type = type;
    this.picByte = picByte;
  }

  @Id
  @SequenceGenerator(
      name = "image_id_seq",
      sequenceName = "image_id_seq",
      allocationSize = 1)
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "image_id_seq")
  @Column(name = "image_id")
  private Long id;

  @Column(name = "name")
  private String name;

  @Column(name = "type")
  private String type;

  // image bytes can have large lengths so we specify a value
  // which is more than the default length for picByte column
  @Column(name = "pic_byte", length = 10000)
  private byte[] picByte;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  @JsonIgnore
  private AUser user;

  public String getName() {
    return name;
  }

  public Long getId() {
    return id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public byte[] getPicByte() {
    return picByte;
  }

  public void setPicByte(byte[] picByte) {
    this.picByte = picByte;
  }

  public AUser getUser() {
    return user;
  }

  public void setUser(AUser user) {
    this.user = user;
  }

  public void setId(Long id) {
    this.id = id;
  }
}
