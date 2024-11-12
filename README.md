# Serverless REST web API.
NOTE: this is a re-upload of the git as the last git became corrupted. please see screenshot to see prior commits:
![image](https://github.com/user-attachments/assets/dfc86fa0-51c3-41ec-8c64-be5617ce4924)


## Youtube
https://youtu.be/qEg8UzCW2e0

## Endpoints
# ALL ENDPOINTS ARE PROTECTED ROUTES, APART FROM GET GAMES. 
* GET /games - retrieves game list -- BUG
* GET /games/gameID - retrieves specific game --BUG
* POST /game - adds a new game with correct parameters
* PUT /game - updates a current game 
* DELETE /game/gameID - deletes a game -- BUG	 

##auth:
* POST /SIGNUP -adds a user
* POST /CONFIRM-SIGNUP - confirms via code
* POST /SIGNIN - signs user in
* GET /SIGNOUT - signs user out and clears cookie

##NOTE
There is code commented out for a failed implementation for a GameCompanies parent. this continously made the CDK crash and would only run when commented out. 
