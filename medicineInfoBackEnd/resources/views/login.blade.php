<!DOCTYPE html>
<html lang="en">
    <head></head>
    <body>
        <form method="POST" action="{{ url('user/verify') }}">
            {{ csrf_field() }}
            Email:<br>
            <input type="text" name="email" id="email"><br>
            Password:<br>
            <input type="password" name="password" id="password">
            <input type="submit" value="Submit">
        </form>
    </body>
</html>

