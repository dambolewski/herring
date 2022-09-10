# Herring
Project management app created with Java, Angular and MySQL.

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Application look](#application-look)

## General info
Project management app created with Java, Angular and MySQL.
	
## Technologies
Project is created with:
* Java version: 11
* Spring Boot version: 2.5.3
* Angular CLI version: 12.2.0
* MySQL version: 8.0.21
	
## Setup
To run this project, install it locally using npm:

### Front end
```
$ npm install -g @angular/cli@12.2.0
$ cd herring-frontend
$ ng serve
```

### Back end
```
$ java -jar target/herring-0.0.1-SNAPSHOT.jar (or just Run the app from IDE)
```

## Application look

* Log in
<img width="1792" alt="Zrzut ekranu 2022-04-20 o 18 37 37" 
     src="https://user-images.githubusercontent.com/56168607/164282971-2ef6df28-772e-441c-ae1a-754bb69f18a6.png">
* Register
<img width="1792" alt="Zrzut ekranu 2022-04-20 o 18 38 04" 
     src="https://user-images.githubusercontent.com/56168607/164283050-cc4e8aa2-2315-41b3-98e0-87d62f695b28.png">
* Home page <br>
This view contains two main functions: 
	* Greet logged User.
	* Show Activities tab that allows to see changes made on Projects that User is assigned to.
<img width="1792" alt="Zrzut ekranu 2022-04-20 o 18 52 04" 
     src="https://user-images.githubusercontent.com/56168607/164283055-3b93a335-d62a-4bc9-afad-7862e5037f61.png">
* Users
It allows you to view other User's data and change them when the manager role is assigned to the account.
<img width="1792" alt="Zrzut ekranu 2022-04-20 o 18 52 13" 
     src="https://user-images.githubusercontent.com/56168607/164283057-d5f0deff-f979-4502-8328-83ae4414af90.png">
* Setting
A view created for Managers in which it is possible to reset the User's password.
<img width="1792" alt="Zrzut ekranu 2022-04-20 o 18 52 18" 
     src="https://user-images.githubusercontent.com/56168607/164283058-9b2c95c2-198c-4207-b2d2-e74e12e85c26.png">
* Projects
The most important view of the application. Allows you to switch to two management views that differ from each other.
	<img width="1792" alt="Zrzut ekranu 2022-04-20 o 18 52 23" 
	     src="https://user-images.githubusercontent.com/56168607/164283064-4fc4b022-1778-4a18-9072-48cf621a675e.png">
	1. It allows you to edit basic Project data, add attachments and, as a Project creator, assign new Users to the project.
	<img width="1792" alt="Zrzut ekranu 2022-04-20 o 18 52 29" 
	     src="https://user-images.githubusercontent.com/56168607/164283065-4e6293a4-92f7-4fab-ac7d-626064b59c56.png"> 
	2. It allows you to create Task Groups and create tasks nested in them.
	<img width="1792" alt="Zrzut ekranu 2022-04-20 o 18 52 54" 
	     src="https://user-images.githubusercontent.com/56168607/164283067-456f2434-7c1e-4255-ae81-805fa0d687ef.png">
* User Profile
A view showing all the data about your User profile.
<img width="1792" alt="Zrzut ekranu 2022-04-20 o 18 37 37" 
     src="https://user-images.githubusercontent.com/56168607/164283119-88c47934-1878-49f0-b98c-4b23abcfbe8a.png">
