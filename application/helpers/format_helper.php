<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function formatDate($date)
{
	$timestamp = new DateTime();
	$timestamp->setTimeZone(new DateTimeZone('GMT'));
	$timestamp->setTimestamp($date);
	$timestamp->setTimeZone(new DateTimeZone('America/New_York'));
	return $timestamp->format('Y-m-d h:i:s A T');
}

function formatHour($date)
{
	$timestamp = new DateTime();
	$timestamp->setTimeZone(new DateTimeZone('GMT'));
	$timestamp->setTimestamp($date);
	$timestamp->setTimeZone(new DateTimeZone('America/New_York'));
	return $timestamp->format('g:i');
}

	
function formatDateDivide1000($date){ 
	return formatDate($date/1000); 
};

function formatHourDivide1000($date){ 
	return formatHour($date/1000); 
};

function formatTempCtoF($temp){
	return number_format((($temp * 1.8) + 32.0) , 1);
};