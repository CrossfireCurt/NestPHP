<?php
    if(isset($notice)){
		echo '<div class="error">' . $notice . '</div>';
	}
?>

<h1>Login</h1>

<br /><br />

<div id="login">
    <form action="<?php echo base_url() . 'index.php/login/doLogin'; ?>" method="post" name="userLoginForm">
        username: <input type="text" name="username" class="form_input" /><br /><br />
		password: <input type="password" name="password" class="form_input" /><br /><br />
        <input type="submit" value="Login" />
    </form>
</div>

<a href="<?php echo base_url() . 'index.php/login/register'; ?>">Register!</a>
<br><br>