#  Expense Tracker App
A simple and powerful Expense Tracker web application built to help users record, manage, and visualize their daily expenses.

Visit: [http://3.7.70.221/](http://3.7.70.221/)

## Project Structure
ExpenseTrackerApp/

├── models/

├── routes/

├── controllers/

├── middlewares/

├── public/

├── app.js

├── utils/

├── package.json

└── README.md

##  Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: JWT
- **Deployment**: AWS EC2,AWS s3,Aws RDS, PM2, Jenkins, Nginx

##  Features

- ✅ User Signup/Login with secure authentication
- ✅ Add, update, and delete expenses
- ✅ View total and daily expense history
- ✅ Download expenses in CSV format
- ✅ Admin access to premium reports
- ✅ Continuous Deployment with Jenkins & PM2
- ✅ Hosted on EC2 with Nginx

##  Setup Environment Variables
Create a .env file in the root of your project and add the following environment variables:
# JWT and App Security
SECRET_KEY=your_secret_key

# Cashfree Payment Gateway
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key

# Email Service (e.g., Sendinblue / Mailing Service)
MAILING_API_KEY=your_mailing_api_key
MY_EMAIL=your_email@example.com

# Database Configuration
DB_NAME=expansetrackerapp
DB_USER=root
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=4000
DB_DIALECT=mysql

# AWS S3 Bucket Configuration
BUCKET_NAME=your_s3_bucket_name
IAM_USER_KEY=your_aws_access_key
IAM_USER_SECRET=your_aws_secret_key



