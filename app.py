# This is a simple expenses tracker application that allows users to register, log in, add expenses, and check their total expenses. The application uses SQLite as the database to store user information and expense data.

import sqlite3

# Database setup
DB ='Expenses_data.DB'
conn = sqlite3.connect(DB)
cursor = conn.cursor()

# Create users table if it doesn't exist
cursor.execute(
    ''' CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VANCHAR(50) NOT NULL,
        email TEXT NOT NULL,
        password VANCHAR(10) NOT NULL
        )
''')
# Create expenses table if it doesn't exist
cursor.execute(
    ''' CREATE TABLE IF NOT EXISTS ex_data(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category VANCHAR(50),
        iteam_name VANCHAR(50),
        iteam_price INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    ) '''
)

conn.commit()

#  child of main Function to register a new user
def register(name,email,password):
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute(
            ''' INSERT INTO users(name,email,password)
            VALUES(?,?,?)''',(name ,email,password) 
            )
        
        conn.commit()

# child of main Function to login an existing user
def login(email,password):
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute(
            ''' SELECT * FROM users
            WHERE email =? AND password =?''',(email,password)
        )
        result = cursor.fetchone()

        if result:
            print("Login succuseful")
            user_id = result[0]
            expenses(user_id)
        else:
            print("Invalide email or passwords try agian")

        conn.commit()

def verify_user(email ,password):
     with sqlite3.connect(DB) as conn:
            cursor = conn.cursor()
            cursor.execute(
                ''' SELECT * FROM users
                WHERE email =? AND password =?''',(email,password)
            )
            result = cursor.fetchone()
    
            if result:
                return result[0]
           
            return None
     

# child of expenses Function to add a new expense for the logged-in user
def add(user_id,category,iteam_name,iteam_price):
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute(
            ''' INSERT INTO ex_data(user_id,category,iteam_name,iteam_price)
                 VALUES(?,?,?,?)''',(user_id,category,iteam_name,iteam_price)
         )
        conn.commit()


def get_expenses(user_id):
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT id, category, iteam_name, iteam_price
            FROM ex_data
            WHERE user_id = ?
            """,
            (user_id,)
        )

        return cursor.fetchall()

    
# child of expenses Function to check the total expenses for the logged-in user
def check_expen(user_id):
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute(
              ''' SELECT SUM(iteam_price) 
                  FROM ex_data
                  WHERE user_id =? ''',(user_id,)
         )

        return cursor.fetchone() or 0
       
            

# child of login Function to manage expenses for the logged-in user
def expenses(user_id):
    while True:
        print("Welcome to Expenses Tracker")
        print("\n")
        print("1. Add Iteam")
        print("2. Check Expenses ")
        print("3. Exists")
        print("\n")

        user =int(input("Enter your option ----> "))

        if user == 1:
            category =input("Enter your categroy ---> ")
            iteam_name =input("Enter your iteam name ---> ")
            iteam_price =input("Enter your iteam price  ---> ")

            add(user_id,category,iteam_name,iteam_price)

        elif user == 2:
            check_expen(user_id)

        elif user == 3:
            break

        else:
            print("Invalide option try agian")


# This is the main function that serves as the entry point of the application. It provides a menu for users to register, log in, or exit the application.
def main():
    while True:
        print("Welcome to Expenses Tracker")
        print("\n")
        print("1. Resigerter")
        print("2. Login")
        print("3. Exists")
        print("\n")

        user =int(input("Enter your option ----> "))

        if user == 1:
            name = input("Enter your name ---> ")
            email = (input("Enter your email ---> "))
            password = (input("Enter your password ---> "))

            register(name,email,password)

        elif user == 2:
            email = (input("Enter your email ---> "))
            password = (input("Enter your password ---> "))

            login(email,password)

        elif user == 3:
            break

        else:
            print("Invaide option please try agian")


if __name__ == '__main__' :
    main()


# SO this is a simple expenses tracker application that allows users to register, log in, add expenses, and check their total expenses. The application uses SQLite as the database to store user information and expense data.