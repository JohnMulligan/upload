# Archival Assist

<h2>Documentation</h2>

This repository contains the code for the Archival Assists app, containing API calls to pull from and push to an Omeka S database-- simplified into a repeatable workflow made using React Native.

Omeka S is used as the data store and the app can be configured to use any instance, locally or remotely as long as there is an internet connection.

<h2>Omeka S accounts</h2>

Currently, Archival Assist only allows authorized users with read write privileges (*user types here) to access the app and make changes. Each user should have an authentication key in Omeka S-- a key identity and a key credential to login to the app with. Once authenticated, the user is free to create items and attach media to those items.

<h2>Usage</h2>

<h4>Login</h4>
The login screen requires 3 fields: a host IP address, a key identity, and a key credential. This information is automatically stored in the user’s keychain storage if successful, and can be removed at any time inside the app by logging out. The keychain encrypts and safely stores the keys locally so the user doesn’t have to login every time the app is opened. 

<h4>Create New Item</h4>
This screen pulls the resource templates specified in the Omeka S database, allowing the user to select one and then fill out the fields associated with that template. Then, the information is pushed to Omeka S, creating a new item. 

<h4>Choose Upload Type</h4>
The next screen allows the user to choose how they want to upload their media:
No media, skips straight to the end
Only upload one image with the option to give it a page number
Upload page numbers without any order/page number
Upload page numbers in order with a page number (and be able to manually change each page number)

<h4>Upload Media</h4>
A simple camera screen to take a picture and push the image along with its information into the Omeka S database

<h2>Running Locally</h2>
npm i --save
npm start
npm run ios or npm run android

<h3>Future Developments</h3>

Currently, this app hasn’t been fully tested for Android devices, but in the future we plan to test on them more thoroughly. 
