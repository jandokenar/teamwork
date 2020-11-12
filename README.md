# API Documentation
[[_TOC_]]



## User

| Request Methods | Endpoint  | Description |
| --- | --- |--- |
| GET    | /library/user/borrow  |
| GET    | /library/user/        | Get user
| GET    | /library/user/all/    | Get all users
| POST   | /library/user/        | Creates a new user
| POST   | /library/user/borrow  |
| POST   | /library/user/return  |
| PUT    | /library/user/        | Modify user
| PUT    | /library/user/reserve | Reserves book for user |
| DELETE | /library/user/        | Delete user


### GET     /library/user/borrow  

| Parameter Key | Description|
| ---  |---|
|      |   |

| Return Code | Return Value | Description |
| ---  |---|---|
|      |   |   |

#### Remarks


### GET     /library/user/
Get user

| Parameter Key | Description|
| ---  |---|
|      |   |

| Return Code | Return Value | Description |
| ---  |---|---|
|      |   |   |

#### Remarks


### GET     /library/user/all/
Get all users

| Parameter Key | Description|
| ---  |---|
|      |   |

| Return Code | Return Value | Description |
| ---  |---|---|
|      |   |   |

#### Remarks


### POST    /library/user/
Creates a new user

| Parameter Key | Description|
| ---  |---|
|      |   |

| Return Code | Return Value | Description |
| ---  |---|---|
|      |   |   |

#### Remarks


### POST    /library/user/borrow  

| Parameter Key | Description|
| ---  |---|
|      |   |

| Return Code | Return Value | Description |
| ---  |---|---|
|      |   |   |

#### Remarks


### POST    /library/user/return  

| Parameter Key | Description|
| ---  |---|
|      |   |

| Return Code | Return Value | Description |
| ---  |---|---|
|      |   |   |

#### Remarks

### PUT /library/user/
Modifies user

| Parameter Key | Description|
| ---  |---|
| id | ID of the user who issued the request |
| password | password string for the corresponding user |
| replacementData | user fields which to replace |


Every field in replacement data is optional.

| replacementData Key | Description |
| --- | --- |
| id | ID of the user which to be modified | 
| password | replacement |
| email | replacement |
| role | replacement |

| Return Code | Return Value | Description |
| ---  |---|---|
| 200 | modified user object |
| 400 | { Error : "NotFound" } | Something went wrong

#### Remarks
if `id` is not specified in replacement data, then requester `id` is used.
Requesting user has to have role "admin" in the following cases:
- requester `id` doesn't match replacementData `id`.
- replacementData has `role` specified.

### PUT /library/user/reserve/
Reserves a book for user

| Parameter Key | Description|
| ---  |---|
| id | ID of the user to whom the book is reserved for |
| password | password string for the corresponding user |
| isbn | isbn number of the book which to reserve |
| copy | book copy number |

| Return Code | Return Value | Description |
| ---  |---|---|
| 200 | book Object after user has been added to the reserve list |
| 400 | { Error : "AlreadyOnReserveList" } | `id` was already on books reserve list
| 400 | { Error: "CopyNotFound" } | Books copy wasn't found that matches `copy`
| 400 | { Error: "BookNotFound" } | Book wasn't found that has a matching `isbn` 
| 400 | { Error: "UserNotFound" } | `id` wasn't found or `password` was incorrect

### DELETE  /library/user/         
Delete user

| Parameter Key | Description|
| ---  |---|
|      |   |

| Return Code | Return Value | Description |
| ---  |---|---|
|      |   |   |

#### Remarks


## Book

| Request Methods | Endpoint  | Description |
| --- | --- |--- |
| GET    | /library/book/       | Returns first book that matches search criteria
| GET    | /library/book/all    | Returns all books
| GET    | /library/book/seach  | Returns all books that match search criteria
| POST   | /library/book/       | Add new book |
| PUT    | /library/book/       | Update book  |
| DELETE | /library/book/delete | Delete book

### GET     /library/book/
Returns first book that matches search criteria

| Parameter Key | Description|
| ---  |---|
|      |   |

| Return Code | Return Value | Description |
| ---  |---|---|
|      |   |   |

#### Remarks


### GET     /library/book/all
Returns all books

| Parameter Key | Description|
| ---  |---|
|      |   |

| Return Code | Return Value | Description |
| ---  |---|---|
|      |   |   |

#### Remarks


### GET     /library/book/seach
Returns all books that match search criteria

| Parameter Key | Description|
| ---  |---|
|      |   |

| Return Code | Return Value | Description |
| ---  |---|---|
|      |   |   |

#### Remarks


### POST    /library/book/
Add new book 

| Parameter Key | Description|
| ---  |---|
|      |   |

| Return Code | Return Value | Description |
| ---  |---|---|
|      |   |   |

#### Remarks


### PUT     /library/book/
Update book  

| Parameter Key | Description|
| ---  |---|
|      |   |

| Return Code | Return Value | Description |
| ---  |---|---|
|      |   |   |

#### Remarks


### DELETE  /library/book/delete
Delete book

| Parameter Key | Description|
| ---  |---|
|      |   |

| Return Code | Return Value | Description |
| ---  |---|---|
|      |   |   |

#### Remarks

