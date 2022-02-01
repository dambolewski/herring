package pl.herring.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

import static javax.persistence.GenerationType.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Attachment implements Serializable {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;
    private String name;
    private String url;
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    public Attachment(String name, String originalFilename) {
        this.name = name;
        this.url = originalFilename;
    }
}
