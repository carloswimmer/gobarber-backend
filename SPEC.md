# Password recovery

**Functional requirements**

- The user must be able to recover their password by providing their email;
- The user must receive an email with password recovery instructions;
- The user must be able to reset their password;

**Non-functional requirements**

- Use Mailtrap to test email sending in the development environment;
- Use Amazon SES for production sends;
- Email sending must happen in the background (background job);

**Business rules**

- The link sent by email to reset the password must expire in 2 hours;
- The user must confirm the new password when resetting it;

# Profile update

**Functional requirements**

- The user must be able to update their username, name, and password;

**Business rules**

- The user cannot change their email to one that is already in use;
- To update their password, the user must provide the old password;
- To update their password, the user must confirm the new password;

# Provider dashboard

**Functional requirements**

- The user must be able to list their appointments for a specific day;
- The provider must receive a notification whenever there is a new appointment;
- The provider must be able to view unread notifications;

**Non-functional requirements**

- The provider's appointments for the day must be cached;
- The provider's notifications must be stored in MongoDB;
- The provider's notifications must be sent in real time using Socket.io;

**Business rules**

- Each notification must have a read or unread status so the provider can manage them;

# Service scheduling

**Functional requirements**

- The user must be able to list all registered service providers;
- The user must be able to list the days in a month with at least one available slot for a provider;
- The user must be able to list the available slots on a specific day for a provider;
- The user must be able to create a new appointment with a provider;

**Non-functional requirements**

- The provider listing must be cached;

**Business rules**

- Each appointment must last exactly 1 hour;
- Appointments must be available between 8:00 and 18:00 (first at 8:00, last at 17:00);
- The user cannot book a slot that is already taken;
- The user cannot book a slot that has already passed;
- The user cannot book a slot with themselves;
