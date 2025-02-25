export const accountDelHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delete Account</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f0f0f0;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        h1 {
            color: #333;
        }
        p {
            color: #666;
        }
        .input{
            display: block;
            margin: 0 auto;
            padding: 10px 20px;
            width: 300px;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius:5px

            
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            border: none;
            border-radius: 5px;
            background-color: #8357FF;
            color: white;
            text-decoration: none;
            cursor: pointer;
        }
        .btn:hover {
            background-color: #858995;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Delete Account</h1>
        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
        <form action="/delete-account" method="POST">
            <input class="input" type="email" name="email" placeholder="your-email"/>
            <button type="submit" class="btn">Submit Request</button>
        </form>
    </div>
</body>
</html>
`;
