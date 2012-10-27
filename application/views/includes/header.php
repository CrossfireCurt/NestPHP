<!-- header file -->
<!DOCTYPE html>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js" type="text/javascript"></script>
<script src="<?php echo base_url() . "js/titan.js";?>" type="text/javascript"></script>
<link href="<?php echo base_url() . "css/style.css";?>" rel="stylesheet" type="text/css" />
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Welcome to crap</title>

</head>
<body>

<?php
    if ($this->session->flashdata('status') == "success"){
        echo '<div class="success">' . $this->session->flashdata('message') . '</div>';
    } elseif ($this->session->flashdata('status') == "error"){
        $error = $this->session->flashdata('message');
        echo '<div class="error">Error: ' . ucfirst($error) . '</div>';
    }
?>

<?php 
    if(isset($loggedIn) && $loggedIn){
        if ($this->session->userdata('is_admin')) $isAdmin = true;
    ?>
    <div id="user_info">
        <div id="user_greeting">Hello, <?php echo $username; ?>!</div>
        <div id="usercp_links">
            <a href="<?php echo base_url() . 'index.php/site_admin'; ?>">home</a> - 
            <a href="<?php echo base_url() . 'index.php/user_admin/edit'; ?>">settings</a> - 
			<a href="<?php echo base_url() . 'index.php/login/logout'; ?>">logout</a>
        <?php if (isset($isAdmin) && $isAdmin) echo ' | <a href="' . base_url() . 'index.php/user_admin">-(admins only [us]) user admin</a>'; ?>
    </div>
    <?php
    }
?>