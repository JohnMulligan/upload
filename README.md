# Special Collections Mobile

<h2>Documentation</h2>

This repository contains the code for the Special Collections mobile app, containing API calls to pull from and push to an Omeka S database-- simplified into a repeatable workflow made using React Native. Omeka S is used as the data store and the app can be configured to use any instance, locally or remotely as long as there is an internet connection.

<h2>Omeka S accounts</h2>

Currently, Archival Assist only allows authorized users with read write privileges (*user types here) to access the app and make changes. Each user should have an authentication key in Omeka S-- a key identity and a key credential to login to the app with. Once authenticated, the user is free to modify anything from creating items to attaching media to those items. There is no delete access to the database-- you'll have to do that from the web app.

<h2>Usage</h2>

<h4>Login</h4>
The login screen requires 3 fields: a host IP address, a key identity, and a key credential. This information is automatically stored in the user’s keychain storage if successful, and can be removed at any time inside the app by logging out. The keychain encrypts and safely stores the keys locally so the user doesn’t have to login every time the app is opened. 

<h4>Create New Item</h4>
This screen pulls the resource templates specified in the Omeka S database, allowing the user to select one and then fill out the fields associated with that template. Then, the information is pushed to Omeka S, creating a new item. 

<h4>Upload Media</h4>
This app allows you to choose an upload type that matches the needs of your document uploads. You can take a single picture or multiple as well as assign them page numbers, saved as "o:page_num." Then you'll be redirect to a camera to take a picture and push the image along with its information into the Omeka S database

<h4>All Item View</h4>
View items that were either created by you or are publicly accessible to anyone. You can then edit these, view their metadata and attached media, as well as upload more images. A full text search is implemented which will return results of any items with metadata that contains the search query.

<h2>Running Locally</h2>
npm i --save
npm start
npm run ios or npm run android

<h3>Future Developments</h3>

Currently, this app hasn’t been fully tested for Android devices, but in the future we plan to test on them more thoroughly. 
