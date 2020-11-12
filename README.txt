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
| 400 | { Error: "CopyNotFound" } | Books copy wasn`t found that matches `copy`
| 400 | { Error: "BookNotFound" } | Book wasn`t found that has a matching `isbn` 
| 400 | { Error: "UserNotFound" } | `id` wasn`t found or `password` was incorrect

### PUT /library/user/
Modifies user
| Parameter Key | Description|
| ---  |---|
| id | user who issued the request |
| password | password string for the corresponding user |
| replacementData | user fields which to replace |


Every field in replacement data is optional.

| replacementData Key | Description |
| --- |
| id | ID of the user which to be modified | 
| password | replacement |
| email | replacement |
| role | replacement |

| Return Code | Return Value | Description |
| ---  |---|---|
| 200 | modified user object |
| 400 | { Error : "NotFound" } | Something went wrong

### Remarks
if `id` is not specified in replacement data, then requester `id` is used.
Requesting user has to have role "admin" in the following cases:
- requester `id` doesn't match replacementData `id`.
- replacementData has `role` specified.

