<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
		<title><?php echo $status . ' ' . $statusCodeMessage; ?></title>
	</head>
	<body>
		<h1><?php echo $statusCodeMessage; ?></h1>
		<p><?php echo $message; ?></p>
		<hr />
		<address><?php echo $signature; ?></address>
	</body>
</html>