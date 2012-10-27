<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Nestlib {

	private $CI				= null;
	private $sessionObj		= null;
	private $sessionID		= null;

	private $latestStats	= null;

	private $useCache		= true;
	
	private $entityTypes = array(
		'tuneups'			=> 'Device',
		'metadata'			=> 'Device',
		'track'				=> 'Device',
		'user_settings'		=> 'User',
		'structure'			=> 'Structure',
		'link'				=> 'Device',
		'device'			=> 'Device',
		'schedule'			=> 'Device',
		'shared'			=> 'Device',
		'user_alert_dialog' => 'User',
		'user'				=> 'User'
	);

	public function __construct()
	{		
		$this->CI = &get_instance();

		$this->sessionObj = array(
			'id'				=> null,
			'transport_url'		=> null,
			'weather_url'		=> null,
			'access_token'		=> null,
			'expire_date'		=> null,
			'user_id'			=> null,
			'serial'			=> null,
			'temperature_scale' => null
		);

		$this->sessionID = (time() * 1000) . '' . rand() * 100000000;
	}
		
	public function auth($username, $password, $forceReAuth = false)
	{
		$data = false;
		if($this->useCache)
		{
			$cacheFile = 'C:\wamp\www\nestphp\application\logs\auth_cache_' . $username . '.txt';
			if(is_file($cacheFile))
			{
				$data = file_get_contents('C:\wamp\www\nestphp\application\logs\auth_cache_' . $username . '.txt');
				$returnData = json_decode($data, true);
				if(strtotime($returnData['expires_in']) > time()) 
				{
					$data = false;
				}
			}
		}
			
		if($data === false || $forceReAuth)
		{
			$url = 'https://home.nest.com/user/login';

			$data = array(
				'username' => $username,
				'password' => $password
			);

			$headers = array();
			
			$data = $this->executeRequest($url, $data, $headers);
			
			file_put_contents('C:\wamp\www\nestphp\application\logs\auth_cache_' . $username . '.txt', $data);
			$returnData = json_decode($data, true);
		}


		$this->sessionObj = array();
		
		$this->sessionObj['access_token']	= $returnData['access_token'];
		$this->sessionObj['expire_date']	= date('c', strtotime($returnData['expires_in']));
		$this->sessionObj['user_id']		= $returnData['userid'];
		$this->sessionObj['transport_url'] = $returnData['urls']['transport_url'];
		$this->sessionObj['weather_url']	= $returnData['urls']['weather_url'];

		return $this->sessionObj;
	}

	public function getStats()
	{
		$this->CI->load->helper('format_helper');
		$ignorableEntityTypes = array('user_settings', 'user');
		
		$timeFields = array(
			'metadata' => array(
				'$timestamp'		=> 'formatDateDivide1000', 
				'last_connection'	=> 'formatDateDivide1000'
			),

			'track'	=> array(
				'$timestamp'		=> 'formatDateDivide1000', 
				'last_connection'	=> 'formatDateDivide1000'
			),

			'structure' => array(
				'$timestamp'		=> 'formatDateDivide1000', 
				'away_timestamp'	=> 'formatDate', 
				'creation_time'		=> 'formatDateDivide1000'
			),
			
			'device' => array(
				'$timestamp'	=> 'formatDateDivide1000', 
				'creation_time'	=> 'formatDateDivide1000'
			),

			'schedule'			=> array('$timestamp' => 'formatDateDivide1000'),
			'shared'			=> array('$timestamp' => 'formatDateDivide1000'),
			'user_alert_dialog'	=> array('$timestamp' => 'formatDateDivide1000'),
			'user'				=> array('$timestamp' => 'formatDateDivide1000'),
			'tuneups'			=> array('$timestamp' => 'formatDateDivide1000'),
			'user_settings'		=> array('$timestamp' => 'formatDateDivide1000'),
			'link'				=> array('$timestamp' => 'formatDateDivide1000')
		);

		$tempFields = array(
			'device' => array(
				'away_temperature_high' => 'formatTempCtoF',
				'away_temperature_low'  => 'formatTempCtoF',
				'leaf_away_high'		=> 'formatTempCtoF',
				'leaf_away_low'			=> 'formatTempCtoF',
				'leaf_threshold_cool'	=> 'formatTempCtoF',
				'leaf_threshold_heat'	=> 'formatTempCtoF',
				'lower_safety_temp'		=> 'formatTempCtoF',
				'upper_safety_temp'		=> 'formatTempCtoF'
			),

			'shared' => array(
				'current_temperature'		=> 'formatTempCtoF',
				'target_temperature'		=> 'formatTempCtoF',
				'target_temperature_high'	=> 'formatTempCtoF',
				'target_temperature_low'	=> 'formatTempCtoF'
			)
		);

		$latestStats = $this->getRawStats();

		foreach($latestStats as $entityType => $entities)
		{
			if(in_array($entityType, $ignorableEntityTypes))
			{
				unset($latestStats[$entityType]);
				continue;
			}
	
			foreach($entities as $entity_id => $stats)
			{
				ksort($stats);
				foreach($stats as $statName => $statVal)
				{
					if(isset($timeFields[$entityType][$statName]))
					{
						$statVal = $timeFields[$entityType][$statName]($statVal);
					}
					else if(isset($tempFields[$entityType][$statName]))
					{
						$statVal = $tempFields[$entityType][$statName]($statVal);
					}

					$stats[$statName] = $statVal;
				}

				$entities[$entity_id] = $stats;
			}

			$latestStats[$entityType] = $entities;
		}

		$this->latestStats = $latestStats;
	}

	public function getAllStructures()
	{
		$structStats = array();
		foreach($this->latestStats as $entityType => $structs)
		{
			if($this->entityTypes[$entityType] != 'Structure') continue;

			foreach($structs as $struct_id => $structs)
			{
				if(!isset($structStats[$struct_id])) $structStats[$struct_id] = array();
			
				$structStats[$struct_id][$entityType] = $structs;	
			}
 		}

		return $structStats;
	}

	public function getAllDevices()
	{
		$deviceStats = array();
		foreach($this->latestStats as $entityType => $devices)
		{
			if($this->entityTypes[$entityType] != 'Device') continue;

			foreach($devices as $device_id => $device)
			{
				if(!isset($deviceStats[$device_id])) $deviceStats[$device_id] = array();
			
				$deviceStats[$device_id][$entityType] = $device;	
			}
 		}

		return $deviceStats;
	}

	public function getRawStats()
	{
		$data = false;
		if($this->useCache)
		{
			//$data = file_get_contents('C:\wamp\www\nestphp\application\logs\getRawStats_cache.txt');
		}
			
		if($data === false)
		{
			$url = $this->sessionObj['transport_url'] . '/v2/mobile/user.' . $this->sessionObj['user_id'];
			$headers = array(
				'Authorization: Basic ' . $this->sessionObj['access_token'],
				'X-nl-user-id: ' . $this->sessionObj['user_id'],
				'X-nl-protocol-version: 1'
			);
			
			$data = $this->executeRequest($url, null, $headers);
			file_put_contents('C:\wamp\www\nestphp\application\logs\getRawStats_cache.txt', $data);
		}

		$stats = json_decode($data, true);
		
		if(isset($stats['device']))
		{
			$devices = $stats['device'];
			$device = array_shift($devices);
			$this->sessionObj['serial'] = $device['serial_number'];
			$this->sessionObj['temperature_scale'] = $device['temperature_scale'];	
		}
		
		return $stats;
	}

	public function getWeather($zipCode)
	{
		$this->CI->load->helper('format_helper');
		$data = false;
		$cacheFile = 'C:\wamp\www\nestphp\application\logs\forecast_' . $zipCode . '_cache.txt';
		if($this->useCache)
		{
			if(is_file($cacheFile))
			{
				$lastModified = filemtime($cacheFile);
				if($lastModified > time() - (60*15)) //15 minutes
				{
					$data = file_get_contents($cacheFile);
				}
			}
		}

		if($data === false)
		{
			$data = $this->executeRequest('https://home.nest.com/api/0.1/weather/forecast/' . $zipCode, null, array(), 'GET');
			file_put_contents($cacheFile, $data);
		}

		$forecast = json_decode($data, true);

		$forecast['now']['sunrise'] = formatDate($forecast['now']['sunrise']);
		$forecast['now']['sunset'] = formatDate($forecast['now']['sunset']);
		$forecast['now']['current_temperature'] = formatTempCtoF($forecast['now']['current_temperature']);

		foreach($forecast['forecast']['hourly'] as $i => $hour)
		{
			$hour['time'] = formatHour($hour['time']);
			$forecast['forecast']['hourly'][$i] = $hour;
		}

		foreach($forecast['forecast']['daily'] as $i => $day)
		{
			$day['date'] = formatDate($day['date']);
			$day['conditions'] = str_replace('a Thunderstorm', 'T-storms', $day['conditions']);
			if($i == 0)
			{
				$day['date'] = 'Today';
			}
			else if($i == 1)
			{
				$day['date'] = 'Tomorrow';
			}
			else
			{	
				$day['date'] = date('l', strtotime($day['date']));
			}

			$forecast['forecast']['daily'][$i] = $day;
		}

		return $forecast;
	}

	public function subscribe($type, $serial)
	{
		$data = false;
		$cacheFile = 'C:\wamp\www\nestphp\application\logs\subscribe_' . $type . '_' . $serial . '_cache.txt';
		if($this->useCache)
		{
			if(is_file($cacheFile))
			{
				$lastModified = filemtime($cacheFile);
				if($lastModified > strtotime(date('Y-m-d', time()) . ' 00:00:00'))
				{
					$data = file_get_contents($cacheFile);
				}
			}
		}

		if($data === false)
		{
			$payload = array(
				'keys' => array(
					array('key' => $type . '.' . $serial) //energy_latest.01AA02AB2012002C
				)
			);

			$jsonp = 'jQuery' . (time() * 1000);
			$data = array(
				'jsonp=' . $jsonp,
				'payload=' . urlencode(json_encode($payload)),
				'X-nl-subscribe-timeout=8',
				'_method=POST',
				'X-nl-client-timestamp=' . (time() * 1000),
				'X-nl-session-id=' . $this->sessionID,
				'X-nl-protocol-version=1',
				'Authorization=Basic+' . $this->sessionObj['access_token']
			);
			
			$url = $this->sessionObj['transport_url'] . '/v1/subscribe?' . (implode('&', $data));

			$data = $this->executeRequest($url, null, array(), 'GET');
			$data = substr_replace(str_replace($jsonp . '(', '', $data), '', -1);

			file_put_contents($cacheFile, $data);
		}

		$subscribe = json_decode($data, true);
		$subscribe = $subscribe['payload'];

		return $subscribe;
	}


	public function setParam($name, $value, $type = 'shared')
	{
		if($type == 'shared')
		{
			$data = '{"target_change_pending":true,"' . $name . '": ' . $value . '}';
		}
		else
		{
			$data = '{"' . $name . '": ' . $value . '}';
		}

		$url = $this->sessionObj['transport_url'] . '/v2/put/' . $type . '.' . $this->sessionObj['serial'];

		$headers = array(
			'Authorization: Basic ' . $this->sessionObj['access_token'],
			'X-nl-protocol-version: 1'
		);
		
		$result = json_decode($this->executeRequest($url, $data, $headers), true);
		return $result;
	}

	public function executeRequest($url, $data = null, $headers = array(), $method = 'POST')
	{
		if($method == 'POST' && !is_null($data))
		{
			if(is_array($data))
			{
				foreach($data as $key => $value)
				{
					$query[] = $key . '=' . $value;
				}
				$query_string = implode('&', $query);
			}
			else
			{
				$query_string = $data;
			}
		}

		if($method == 'POST')
		{
			$defaultHeaders = array(
				'user-agent: Nest/1.1.0.10 CFNetwork/548.0.4'
			);

			$headers = array_merge($defaultHeaders, $headers);
		}

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);

		if($method == 'POST' && !is_null($data))
		{
			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $query_string);
		}
		
		if($method == 'POST')
		{
			curl_setopt($ch, CURLOPT_HEADER, false);
			curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
		}

		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_TIMEOUT, 30);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		
		if(count($headers) > 0)
		{
			curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		}
		
		$result = curl_exec($ch);
		
		//Request Error Handling
		
		if(curl_error($ch))
		{
			throw new Exception(curl_getinfo($ch) . curl_error($ch));
			return;
		}
		
		if($this->curlStatusCheck($ch, $result))
		{
			return $result;
		}

		return false;
	}

	function curlStatusCheck($ch, $result) 
	{
		
		switch(curl_getinfo($ch, CURLINFO_HTTP_CODE))
		{
				
			case "404":
				throw new Exception("Class: The requested resource could not be found. Check the URI for errors, and verify that there are no sharing issues.");
				break;
				
			case "300":
				throw new Exception("Class: The value used for an external ID exists in more than one record. The response body contains the list of matching records.");
				break;
				
			case "400":
				throw new Exception("400");
				break;
			
			case "415":
				throw new Exception("The entity specified in the request is in a format that is not supported by specified resource for the specified method.");
				break;
				
			case "401":
				throw new Exception("401");
				break;
				
			case "500":
				throw new Exception("Class: An error has occurred within Nest.com, so the request could not be completed.");
				break;
			
			case "202":
			case "200":
				return TRUE;
				break;
		}
	}


}