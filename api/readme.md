# ClassM8 Models

User - Anyone who uses the application, Can be a -

- Student
  - Can Add Scene Request
  - Can Attend Classes
- Moderator
  - Can Take attendance
  - Edit already create classes
- Instructor
  - Approve/Deny Scene requests
  - Add courses/classes

Course - A group of classes that can have multiple instructors and students.

Class - One instance of a course, has an instructor and attendees.

A good way to think about this is -

- January Scene Study (The Course) would "contain" the following classes
  - January 7
  - January 14
  - January 21
  - January 28

You can find the prisma scehem in the prisma dir
