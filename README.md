# Revie

This serves as a use case document for the Revie API. This API can allow you to sign up as a user, post reviews about apartments, view all reviews, view a review using its ID, mark a review as helpful, sort reviews based on most helpful or recent reviews, and delete a review using its ID.

## API possible endpoints

#### Key

##### {{URL}} should be replaced by

##### Local -- localhost://5000

## OR

##### Heroku --

### Create a review

To create a review, simply make a POST request with Postman or any other API client to

```
{{URL}}/api/review/new
```

and pass the review data as raw/form data to the body property in the request
###### The data structure is shown below

#### landlords: String

#### environment: String

#### amenities: String

#### location: String

#### media file(optional): binary file(video or images)

Note that you can upload more than one media file in the form data.

Example Response: (Status 201 Created)

```
{
  message: 'Review has been created'
}
```
![Test1](https://github.com/jobafash/revie/blob/main/images/test1.png)

### Get all reviews

To get all reviews, simply make a GET request with Postman or any other API client to

```
{{URL}}/api/reviews/all
```

```
An array of JavaScript objects is returned in JSON format for a successful request, as shown below
```
Example Response: (Status 200 OK)
```
[
    {
        "id": "ca1186d1-79d9-41b3-a08c-ed4f50b7dfe6",
        "data": {
            "environment": "Island",
            "location": "LA",
            "landlords": "Sule",
            "timestamp": "2021-03-22T14:29:46.661Z",
            "amenities": "Security and Power",
            "media": [
                {
                    "id": "upload_1.mp4",
                    "url": "Firebase-URL"
                }
            ],
            "helpful": 1
        }
    },
    {
        "id": "f782b6d8-118a-43c1-acdd-f7e9a51b6765",
        "data": {
            "amenities": "Water and Power",
            "landlords": "Maina",
            "environment": "Mainland",
            "location": "LA",
            "media": [
                {
                    "id": "upload_2.mp4",
                    "url": "Firebase-URL"
                }
            ],
            "timestamp": "2021-03-22T14:22:58.672Z",
            "helpful": 0
        }
    }
]
```

For reviews sorted based on most helpful, add query parameters as shown below

```
{{URL}}/api/reviews/all?organize=helpful
```

For reviews sorted based on most recent, add query parameters as shown below

```
{{URL}}/api/reviews/all?organize=recent
```

### Get one review

To get a single review, simply make a GET request with ID paarameters on Postman or any other API client to

```
{{URL}}/api/review/:id
```

The route should contain an `id` property which is the ID of the review being requested.

Example Request

```
{{URL}}/api/review/d060d146-b6d5-42b1-9a3b-01632d818594

```

Example Response(Status 200 OK)

```
{
    "media": [],
    "amenities": "Water and Power",
    "landlords": "Maina",
    "helpful": 0,
    "environment": "Mainland",
    "timestamp": "2021-03-22T14:13:22.674Z",
    "location": "LA"
}
```

### Mark as helpful

To mark a review as helpful, simply make a PATCH request to

```
{{URL}}/api/review/:id/helpful
```

The route should contain an `id` property which is the ID of the review being requested.

Example Response: (Status 200 OK)

```
{
    "message": "Your review has been marked helpful"
}
```

### Delete a review

To delete a review, make a DELETE request to

```
{{URL}}/api/review/:id/delete
```

The route should contain an `id` property which is the ID of the review being requested.

Example Response: (Status 204 No Content)

```


```

### Sign up as a user

To sign up, make a POST request to

```
{{URL}}/api/users/signup
```

Example Request
{
"email": "email here",
"name": "name here",
"password": password here
}

Example Response: (Status 201 Created)

```
{
    "message": "User created successfully"
}

```

### Sign in as a user(passwordless)

To sign up, make a POST request to

```
{{URL}}/api/users/login
```

Example Request
{
"email": "email here"
}

Example Response: (Status 200 OK)

```
{
    "token": "token to be used for a session"
}

```
