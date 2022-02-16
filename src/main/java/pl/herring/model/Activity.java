package pl.herring.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

import static javax.persistence.GenerationType.IDENTITY;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Activity implements Serializable {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;
    private String username;
    private String projectName;
    private String message;
    private Date creationDate;
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    public Activity(String title, String username, String message, Date date) {
        this.username = username;
        this.projectName = title;
        this.message = message;
        this.creationDate = date;
    }
}
