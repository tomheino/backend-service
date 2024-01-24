# Final Compulsory Task of Server Technologies
Author: Tommi Heino

## About
Implementation consists of 5 endpoints using protocols GET, POST, PUT, DELETE:    
'/' - Welcome message    
'/api/students' - GET all students    
'/api/student/:id' -  GET one student by ID   
'/api/student/add' - POST new student to DB  
'/api/student/update' - PUT update student   
'/api/student/remove/:id' - DELETE student by ID    

It uses sqlite-database (students.db) as a storage for students.

### GET
User can use GET method to retrieve info of all students in the database...  

![GET all](./screenshots/getall.jpg)     
... or just one by using ID.       

![GET one](./screenshots/getone.jpg)

Error handling is also implemented, so if the user requests ID that isn't in the DB, error message appears:     
     
![GET one](./screenshots/get_err.jpg)


### POST
User can use POST method to add new students to the database

![POST](./screenshots/post.jpg)

If information including ID, name or credits are missing, following error message appears:

![POST Error](./screenshots/post_err.jpg)

Also if student already exists with the same ID:

![POST Error](./screenshots/post_err2.jpg)

### PUT
Previously added information can be updated using PUT method. Any parameters can be updated if needed

![PUT](./screenshots/put.jpg)

Also error handling exists, if the student with specified ID is missing:

![PUT Error](./screenshots/put_err.jpg)

### DELETE
This wasn't TO-DO-methdod in the task, but I wanted to implement it too for practising reasons. Student can be removed using ID.

![DELETE](./screenshots/del.jpg)

And if student with specified ID doesn't exist:

![DELETE Error](./screenshots/del_err.jpg)












