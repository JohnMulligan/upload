# Official Documentation
###### Last updated 4/8/22 by Jingwen Hu :)

This repository contains the code for the Special Collections mobile app, containing API calls to pull from and push to an Omeka S database-- simplified into a repeatable workflow made using React Native. Omeka S is used as the data store and the app can be configured to use any instance, locally or remotely as long as there is an internet connection.

## Local Deployment Instructions
- Installation Requirements
  - Node.js / npm installed globally
  - macOS, XCode, and Simulator
- Omeka S accounts
  - Currently, Special Collections only allows authorized users with read write privileges (*user types here) to access the app and make changes. Each user should have an authentication key in Omeka S-- a key identity and a key credential to login to the app with. Once authenticated, the user is free to modify anything from creating items to attaching media to those items. There is no delete access to the database-- you'll have to do that from the web app.
- Set up in your IDE
  - In the terminal (macOS supported only right now):
  - npm i –save
  - npm start
  - npm run ios
## Using the API
- RNFS: React Native File System has two main purposes in the app:
  - Sending post requests with images from a mobile device to Omeka S
  - Checking that validity of the image uploaded to Omeka S
- axios: the main package sending HTTP requests
- expo-secure-store: securely retrieves the key_identity and key_credential from this session. you can’t make an HTTP request without them
### Authentication
> Find the full details here
- Although public information on an Omeka S database can be accessed without login credentials, SC Mobile requires authentication with a valid IP address, key_identity, and key_credential. You can create your own keys (make sure you save the key_credential because it will be hidden after you create it).
Post requests default to being public → make your own items private by adding “o:is_public: false” to your request.
  - Pass keys in through params
```javascript 
params = {key_identity: <key_identity>, key_credential: <key_credential>};
const res = await axios.get(address, {params})
```
### POST requests (axios/RNFS)
#### Item upload (ex @ app/screens/NewItem.js)
payload structure:
```javascript
{
  "dcterms:title": [
    {
       "@value": "Test", 
       "is_public": false, 
       "property_id": 1, 
       "property_label": "Title", 
       "type": "literal"
    }
  ], 
  "o:is_public": false,
  "o:resource_class": {"o:id": 94}, 
  "o:resource_template": {
    "@id": "http://150.136.1.167/api/resource_templates/3", 
    "o:id": 3
  }
}
```

#### Image upload (ex @ app/components/Camera.js)
usage: 
```javascript
RNFS.uploadFiles()
```

- fileUri leads to the location of the file saved in your local directory
We had a lot of trouble figuring this out over summer 2021, so if you alter anything from these specific lines, you might not get the intended result :-) Have fun!
#### Patching an Item
- This basically edits an item that already exists in the database. The payload MUST be the same as the original payload, with only the fields that you want to change being different.
> More information on patching here
### GET requests (all using axios) 
> find more information about these in ```api/util/Omeka.s```
- fetch
- fetchItemsFilter
- fetchResourceTemplates
- fetchItemData
- fetchOne
- getResourceTemplate
- getPropertiesInResourceTemplate
- getPropertyIds
- getThumbnail
- getImage
- getMedia

<h2>Usage</h2>

<h4>Login</h4>
The login screen requires 3 fields: a host IP address, a key identity, and a key credential. This information is automatically stored in the user’s keychain storage if successful, and can be removed at any time inside the app by logging out. The keychain encrypts and safely stores the keys locally so the user doesn’t have to login every time the app is opened. 

<h4>Create New Item</h4>
This screen pulls the resource templates specified in the Omeka S database, allowing the user to select one and then fill out the fields associated with that template. Then, the information is pushed to Omeka S, creating a new item. 

<h4>Upload Media</h4>
This app allows you to choose an upload type that matches the needs of your document uploads. You can take a single picture or multiple as well as assign them page numbers, saved as "o:page_num." Then you'll be redirect to a camera to take a picture and push the image along with its information into the Omeka S database

<h4>All Item View</h4>
View items that were either created by you or are publicly accessible to anyone. You can then edit these, view their metadata and attached media, as well as upload more images. A full text search is implemented which will return results of any items with metadata that contains the search query.

<h3>Future Developments</h3>

Currently, this app hasn’t been fully tested for Android devices, but in the future we plan to test on them more thoroughly. 
