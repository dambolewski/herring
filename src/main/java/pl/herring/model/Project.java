package pl.herring.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

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
    private Date completionDate;
    private boolean status;
    @ManyToMany(fetch = FetchType.EAGER, cascade = {MERGE, PERSIST})
    @Fetch(value = FetchMode.SUBSELECT)
    private Collection<User> users = new ArrayList<>();
    @JsonManagedReference
    @OneToMany(mappedBy = "project", fetch = FetchType.EAGER, cascade = {MERGE, PERSIST}, orphanRemoval = true)
    private Collection<TaskGroup> taskGroups = new ArrayList<>();
    @JsonManagedReference
    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY, cascade = {MERGE, PERSIST}, orphanRemoval = true)
    private Collection<Attachment> attachments = new ArrayList<>();
    @JsonManagedReference
    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY, cascade = {MERGE, PERSIST}, orphanRemoval = true)
    private Collection<Activity> activities = new ArrayList<>();


    public Project(String title) {
        this.title = title;
    }

    public void addTaskGroup(TaskGroup taskGroup) {
        taskGroups.add(taskGroup);
        taskGroup.setProject(this);
    }

    public void deleteTaskGroup(TaskGroup taskGroup){
        taskGroups.remove(taskGroup);
        taskGroup.setProject(null);
    }

    public void addAttachment(Attachment attachment) {
        attachments.add(attachment);
        attachment.setProject(this);
    }

    public void deleteAttachment(Attachment attachment){
        attachments.remove(attachment);
        attachment.setProject(null);
    }

    public void addActivity(Activity activity) {
        activities.add(activity);
        activity.setProject(this);
    }

    public void deleteActivity(Activity activity){
        activities.remove(activity);
        activity.setProject(null);
    }

}
