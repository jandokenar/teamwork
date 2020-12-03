# API Documentation
[[_TOC_]]

## Authentication

`id` and `password` parameters have been removed from requests and accessToken is used instead. AccessToken is created by `login` request and has to be included in each request which has `id` and `password` defined. 

| Request Methods | Endpoint  | Description |
| --- | --- |--- |
| POST   | /library/user/login/  | Creates accessToken if user credentials are valid
| POST   | /library/user/logout/ | Clear cookies
| POST   | /library/user/refresh/| Renews accessToken if refreshToken is valid

### POST     /library/user/login/

Creates accessToken if user credentials are valid

| Parameter Key | Description|
| ---  |---|
| id | requester id |
| password | requesters password |

| Return Code | Return Value | Description |
| ---  |---|---|
| 200 | token: accessToken|


### POST     /library/user/logout/

Clear cookies

| Return Code | Return Value | Description |
| ---  |---|---|
| 200 | token: null|


### POST   /library/user/refresh/

Renews accessToken if refreshToken is valid

| Return Code | Return Value | Description |
| ---  |---|---|
| 200 | token: accessToken|

## User

| Request Methods | Endpoint  | Description |
| --- | --- |--- |
| GET    | /library/user/borrow  | Get users borrowed books
| GET    | /library/user/        | Get user
| GET    | /library/user/all/    | Get all users
| POST   | /library/user/        | Creates a new user
| POST   | /library/user/borrow  | Borrow a book
| POST   | /library/user/return  | Return a book
| PUT    | /library/user/        | Modify user
| PUT    | /library/user/reserve | Reserves book for user |
| DELETE | /library/user/        | Delete user

### GET     /library/user/borrow  

| Parameter Key | Description|
| ---  |---|
| id | requester id |
| password | requesters password |
| filter | id of user to seach for |

| Return Code | Return Value | Description |
| ---  |---|---|
| 200 | array of borrowed books Objects|
| 400 |{ Error: "NotFound" }|
         
#### Remarks
filter `id` has to match parameter `id` or requester has to have "admin" role. Otherwise request returns { 400, Error: "NotFound" }.

BorrowedBook Object

| Member keys | Description|
| --- | --- |
| isbn | book isbn number|
| copy | book copy number|
| borrow_date | When the book was borrowed|

### GET /library/user/
Get user

| Parameter Key | Description|
| ---  |---|
| id   |    |
| password | |
| filter | resembles user fields which are used when filtering for an user |
          
| Return Code | Return Value | Description |
| ---  |---|---|
| 200  | user Object that matches filter |   |
| 400  | { Error: "NotFound" } |  |

#### Remarks
filter `id` has to match parameter `id` or requester has to have "admin" role. Otherwise request returns { 400, Error: "NotFound" }.

### GET     /library/user/all/
Get all users

| Parameter Key | Description|
| ---  |---|
| id   |    |
| password| |

| Return Code | Return Value | Description |
| ---  |---|---|
| 200  | users []  |   |
| 400  | { Error: "NotFound" } |  

#### Remarks
Requesting user has to have "admin" role for this request to succeed.

### POST    /library/user/
Creates a new user

| Parameter Key | Description|
| ---  |---|
| name | name of user |
| email | email of user |
| password | password of user |
| role | role of user (admin/employee/customer) |

| Return Code | Return Value | Description |
| ---  |---|---|
| 200  | user []  |   |
| 400  | { Error: "NotFound" } |  

### POST    /library/user/borrow  

| Parameter Key | Description|
| ---  |---|
| id   | id of user |
| password | password of user |
| isbn | isbn of book |
| copy | copy id of book |

| Return Code | Return Value | Description |
| ---  |---|---|
| 200  |  history[] |   |
| 400  | { Error: "invalid password" } |  
| 400  | { Error: "book not available" } |  



### POST    /library/user/return  

| Parameter Key | Description|
| ---  |---|
| id   | id of user |
| password | password of user |
| isbn | isbn of book |
| copy | copy id of book |

| Return Code | Return Value | Description |
| ---  |---|---|
| 200  | book `Isbn` returned |   |
| 400  | { Error: "invalid password" } |  
| 400  | { Error: "loan not found" } |  

#### Remarks
If book is returned late adds 1.5€ fee per day to user

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
| id   | id of user which to delete |
| password | |

| Return Code | Return Value | Description |
| ---  | --- | --- |
| 200  | user Object which was deleted  |   |
| 400  | { Error: "NotFound"} | 

#### Remarks   
If user has books borrowed, request returns { 400, Error: "NotFound" }.

## Book

| Request Methods | Endpoint  | Description |
| --- | --- |--- |
| GET    | /library/book/       | Returns first book that matches search criteria
| GET    | /library/book/all    | Returns all books
| POST   | /library/book/       | Add new book |
| PUT    | /library/book/       | Update book  |
| DELETE | /library/book/delete | Delete book

### GET     /library/book/
Returns first book that matches filter

| Parameter Key | Description|
| ---    |---|
| filter | resembles book fields which are used when filtering books |


| Return Code | Return Value | Description |
| ---  |---|---|
| 200  | Book []  | all books that match filter  |
| 400  | { Error: "NotFound"} |


### GET     /library/book/all
Returns all books that match filter

| Parameter Key | Description|
| ---    |---|
| filter | resembles book fields which are used when filtering books |


| Return Code | Return Value | Description |
| ---  |---|---|
| 200  | Book []  | all books that match filter  |
| 400  | { Error: "NotFound"} |

#### Remarks
Return code shouldn't ever be `400`, "NotFound". Empty array is a possible return value  


### POST    /library/book/
Add new book

| Parameter Key | Description|
| ---   |---|
| isbn  | book isbn number |
| title | book name |
| author | book author |
| pages | number of the book pages |
| published | book publish day |
| description | short description of the book |

| Return Code | Return Value | Description |
| ---  |---|---|
| 200  | book object |   |

#### Remarks
if book already in database, then adds copy of the book.

### PUT     /library/book/
Update book  

| Parameter Key | Description|
| ---   |---|
| isbn  | book isbn number |
| title | book name |
| author | book author |
| pages | number of the book pages |
| description | short description of the book |


Every field in replacement data is optional.

| Return Code | Return Value | Description |
| ---  |---|---|
| 200  | updated book object |   |
| 400  | { Error: "NotFound" } |   |

### DELETE  /library/book/delete
Delete book

| Parameter Key | Description|
| ---  |---|
| isbn | book isbn number |
| id | book copy id number |

| Return Code | Return Value | Description |
| ---  |---|---|
| 200 | Book: ${isbn} deleted. |   |
| 200 | book object |   |
| 400 | { Error: "Not Found" } |   |

#### Remarks
Removes book from database.
if book has copies, removes one copy by id.