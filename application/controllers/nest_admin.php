<?php if(!defined('BASEPATH')) exit('No direct script access allowed');

class Nest_admin extends CI_Controller{

	private $latestStats = null;

    function __construct(){
        parent::__construct();
        $this->load->library('session');

		$this->load->library('nestlib');
		$newNest = $this->nestlib->auth('hostetcl@gmail.com', 'testtest1', true);
		$this->nestlib->getStats();
    }

	public function index()
	{
		$viewData = $this->getData();
		
		$this->load->helper('url');

		$this->load->view('nest_home', $viewData);
	}

	public function setTemp($temp) //F
	{
		$temp = number_format(($temp - 32.0) / 1.8, 4); //C to F
		$result = $this->nestlib->setParam('target_temperature', $temp);
		var_dump($result);
	}

	public function echoData()
	{
		echo json_encode($this->getData());
	}

	private function getData()
	{
		$devices = $this->nestlib->getAllDevices();
		foreach($devices as $serial => $device)
		{
			$latestEnergy = $this->nestlib->subscribe('energy_latest', $serial);
			$labels = array();
			$dataHeat = array();
			$dataCool = array();
			$maxHrs = 0;
			foreach($latestEnergy['days'] as $day)
			{
				$unixDate = strtotime($day['day']);
				$totalHeat = $day['total_heating_time']/60/60;
				$totalCool = $day['total_cooling_time']/60/60;

				$labels[] = date('jS', $unixDate);
				$dataHeat[] = number_format($totalHeat, 2);
				$dataCool[] = number_format($totalCool, 2);

				if($totalHeat+$totalCool > $maxHrs) $maxHrs = $totalHeat+$totalCool;
			}
			$maxHrs = number_format($maxHrs, 0) + 1;

			$devices[$serial]['latestEnergy'] = array(
				'labels'	=> implode('|', $labels),
				'dataHeat'	=> implode(',', $dataHeat),
				'dataCool'	=> implode(',', $dataCool),
				'maxHrs'	=> $maxHrs
			);
		}

		$structs = $this->nestlib->getAllStructures();

		foreach($structs as $struct_id => $struct)
		{
			$structs[$struct_id]['weather'] = $this->nestlib->getWeather($struct['structure']['postal_code']);
		}

		$thermoData = array(
			'devices'	=> $devices,
			'structs'	=> $structs
		);

		return $thermoData;
	}
}