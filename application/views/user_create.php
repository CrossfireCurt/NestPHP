<h1>Create New User</h1>

<div id="code">
    <form action="<?php echo base_url() . 'index.php/user_admin/create'; ?>" method="post" name="userCreateForm">
        username: <input type="text" name="username" class="form_input" /><br /><br />
        email address: <input type="text" name="email" class="form_input" /><br /><br />
		password: <input type="password" name="password1" class="form_input" /><br /><br />
        password(confirm): <input type="password" name="password2" class="form_input" /><br /><br />
        <input type="submit" value="Create User" />
    </form>
</div>

<?php include('includes/footer.php'); ?>