package pl.herring.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import static javax.persistence.CascadeType.MERGE;
import static javax.persistence.CascadeType.PERSIST;
import static javax.persistence.GenerationType.IDENTITY;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Project implements Serializable {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;
    private String uuid;
    @Column(unique = true)
    private String title;
    private String description;
    private String creator;
    private boolean trackFlag;
    private Date creationDate;
    @ManyToMany(fetch = FetchType.EAGER, cascade = {MERGE, PERSIST})
    private Collection<User> users = new ArrayList<>();

    public Project(String title) {
        this.title = title;
    }
}
