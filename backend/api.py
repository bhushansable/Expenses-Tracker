from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from app import add,get_expenses,check_expen , register as register_DB , verify_user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Expense(BaseModel):
    user_id: int
    category: str
    item_name: str
    item_price: float

class Register(BaseModel):
    name : str
    email : str
    password : str

class Login(BaseModel):
    email : str
    password : str

@app.get("/")
def home():
    return {"message": "Expense Tracker API running"}

@app.post("/expenses")
def add_expense(expense: Expense):
    add(
        expense.user_id,
        expense.category,
        expense.item_name,
        expense.item_price
    )

    return {
        "message": "Expense saved successfully",
        "expense": expense
    }

@app.get("/expense/{user_id}")
def read_expense(user_id : int):
    expenses = get_expenses(user_id)

    return {
        "user_id" : user_id ,
        "expenses" : [
            {
                "id" : row[0],
                "category": row[1],
                "item_name": row[2],
                "item_price": row[3]
            }
            for row in expenses
        ]
    }


@app.get("/expense/expense_total/{user_id}")
def total_expense(user_id : int):
    total = check_expen(user_id)

    return{
        " user_id" : user_id,
        "total expense" : total
    }


@app.post("/register")
def register_user(user : Register):
     register_DB(
         user.name,
         user.email,
         user.password
    )

     return {
           "message": "Register successfully",
           "register": user
       }

@app.post("/login")
def login_user(user:Login):
    user_id = verify_user(user.email,user.password)

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    return {
               "message": "login successfully",
               "user_id": user_id
           }
