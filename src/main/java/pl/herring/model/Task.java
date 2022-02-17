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
public class Task implements Serializable {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;
    private String title;
    private boolean done = false;
    private Date creationDate;
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "task_group_id")
    private TaskGroup taskGroup;

    public Task(String title) {
        this.title = title;
    }
}
