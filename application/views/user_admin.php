<?php
    if(isset($notice))
        echo "<div class='notice'>$notice</div>";
?>
<h1>User Admin</h1>
<br>

<a href="<?php echo base_url() . 'index.php/user_admin/create'; ?>">Create New User</a><br/><br/>

<p>Edit existing user:</p>
<div id="code">
    <div id="users">
        <?php
            foreach($users as $user){
                echo $user['id'] . '. ' . $user['username'];
                echo " - <a href=" . base_url() . "index.php/user_admin/edit/" . $user['id'] . ">edit / view pages</a>";

                if (!$user['is_admin']){ //do not delete admins!
                    echo " | <a href=" . base_url() . "index.php/user_admin/delete/" . $user['id'] . ">delete</a><br />";
                } else {
                    echo "<br />";
                }
            }
        ?>
    </div>
</div>

<br><br>

<?php include('includes/footer.php'); ?>