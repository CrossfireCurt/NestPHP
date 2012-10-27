<script>
//we can put this somewhere else later
$(document).ready(function(){
    
    $("#generate_api_key").click(function(e){
        e.preventDefault();
        $.get('<?php echo base_url() . 'index.php/user_admin/generate_api_key'; ?>', {'user_id' : '<?php echo $id; ?>'}, function(r){
            $("#editUser_api_key").val(r);
        });
    });
    
    $("#userEditForm").submit(function(){
        if ($("#editUser_api_key").val() == ""){
            alert('please generate an api key');
            return false;
        }
    });
    
});


</script>


<h1>Welcome to Titan!</h1>

<p>Edit user info:</p>
<div class="code">
    <form action="<?php echo base_url() . 'index.php/user_admin/edit/' . $id; ?>" method="post" id="userEditForm">
        userid: <b><?php echo $id ?></b><br><br>
        username: <b><?php echo $username ?></b><br><br>
        password: <input type="password" name="editUser_password" id="editUser_password" value="" style="width:230px;text-align:center;"><br><br>
        password verify: <input type="password" name="editUser_password2" id="editUser_password2" value="" style="width: 230px;text-align:center;"><br><br>
        api_key: <input type="text" name="editUser_api_key" id="editUser_api_key" value="<?php echo $api_key; ?>" style="width:230px;text-align:center;">
        <a href="#" id="generate_api_key">Generate new API Key</a>        
        <br><br>
        <input type="submit" value="submit changes">
    </form>
</div>

<p>Link with Google Analytics:</p>
<div class="code">
    <?php 
    //TODO: Right here, this should be the users own settings. we should make an admin-only replacement of this section to reset the ga_token_status to reset that specific users auth stuff. in case they have errors or it unexpectectly changed or something, who knows.
	if(strlen($ga_token) > 0)
	{
		?>
		Session Token: <?php echo $ga_token; ?><br />
		Status: <?php echo $ga_token_status; ?><br />
		<?php
	}
	?>
	<a href="https://www.google.com/accounts/AuthSubRequest?next=<?php echo base_url(); ?>index.php/user_admin/googleToken&scope=https://www.google.com/analytics/feeds/&secure=0&session=1">Click here to authenticate through Google.</a>
</div>

<p>Edit users pages:</p>
<div class="code">
    <?php echo $usersPages; ?>
</div>

<?php include('includes/footer.php'); ?>