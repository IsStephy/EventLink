# Changelog

## November 8
- **Star Favoriting System**:
  - Implemented a star favoriting system for events, allowing users to mark and save their preferred events while maintaining the original card design (with minor adjustments). ([Alexandra](https://github.com/AlexandraB-C) in Commit: [e1aa9a2](https://github.com/IsStephy/EventLink/commit/e1aa9a2b195940c02aa80275658826ffc66cb97a))

## November 5 – November 7
- **Login and Registration Update**:
  - Modified the login and registration processes to authenticate users via corporate email and password instead of username. This enhances security and aligns with corporate standards.
- **Database Structure Changes**:
  - Updated the database structure to replace storing user details by name/surname with corporate email as the primary identifier. ([Ștefan](https://github.com/IsStephy) in Commit: [bdc6559](https://github.com/IsStephy/EventLink/commit/bdc6559e2fff7ce1b4f10ea0c294d6175985d02c))

## November 4 – November 6
- **Login Page Functionality**:
  - Enabled full functionality for the login page by integrating the front end with the back end.
  - The student’s email and password are now verified in the database using backend functions.
  - Students who enter their university email and correct password can access the calendar and all app features. ([Maria-Elena](https://github.com/mariaelenabotnari))

## October 28 – October 31
- Designed the login page for the calendar app. ([Maria-Elena](https://github.com/mariaelenabotnari) and [Alexandra](https://github.com/AlexandraB-C) in Commit: [3ea0698](https://github.com/IsStephy/EventLink/commit/3ea0698d0cd848976ece7cf364a631d4e3bf8bc9))
- Developed the front-end code for the login page. ([Maria-Elena](https://github.com/mariaelenabotnari) and [Alexandra](https://github.com/AlexandraB-C) in Commit: [3ea0698](https://github.com/IsStephy/EventLink/commit/3ea0698d0cd848976ece7cf364a631d4e3bf8bc9))

## October 27 – October 31
- **Update Database**:
  - Introduced a new table in the database schema to store information about users.
  - Updated the `ddl.sql` file to reflect these changes. (Commit: [d6cc393](https://github.com/IsStephy/EventLink/commit/1fe47cc1fc1d8c810c28bb5d2b8304a5514a03eb))
- **Added New Functions**:
  - Implemented functions to interact with the new user table, enabling operations like adding, retrieving, updating, and deleting user data. ([Ștefan](https://github.com/IsStephy) and [Pavel](https://github.com/pavelcium23) in Commit: [d6cc393](https://github.com/IsStephy/EventLink/commit/1fe47cc1fc1d8c810c28bb5d2b8304a5514a03eb))
