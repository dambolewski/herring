package pl.herring.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.*;

import static javax.persistence.CascadeType.MERGE;
import static javax.persistence.CascadeType.PERSIST;
import static javax.persistence.GenerationType.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class TaskGroup implements Serializable {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;
    private String title;
    private boolean done;
    private Date creationDate;
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    @JsonManagedReference
    @OneToMany(mappedBy = "taskGroup", fetch = FetchType.EAGER, cascade = {MERGE, PERSIST}, orphanRemoval = true)
    private Collection<Task> tasks = new ArrayList<>();

    public TaskGroup(String title) {
        this.title = title;
    }

    public void addTask(Task task) {
        tasks.add(task);
        task.setTaskGroup(this);
    }

    public void deleteTask(Task task){
        tasks.remove(task);
        task.setTaskGroup(null);
    }
}
