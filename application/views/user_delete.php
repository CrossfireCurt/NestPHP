<h1>Delete User</h1>

<p>Are you sure you want to delete user <?php echo $user['username']; ?>?</p>
<div id="code">
    <form action="<?php echo base_url() . 'index.php/user_admin/delete/' . $user['id']; ?>" method="post" name="userDeleteForm">
        <input type="hidden" name="blank" value="blank"> <!-- having an empty form submit doesnt work, needs at least 1 input -->
        <input type="submit" value="Yes" />
        <input type="button" value="No" onclick="javascript:document.location = '<?php echo base_url() . 'index.php/user_admin/'; ?>';" />
    </form>
</div>

<?php include('includes/footer.php'); ?>