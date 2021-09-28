package pl.herring.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import static javax.persistence.GenerationType.AUTO;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = AUTO)
    @Column(nullable = false, updatable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long id;
    private String userId;
    private String username;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
    private String[] authorities;
    private Date joinDate;
    private Date lastLoginDate;
    private Date lastLoginDateDisplay;
    private boolean isActive;
    private boolean isNotLocked;
    private String profileImageUrl;
}
