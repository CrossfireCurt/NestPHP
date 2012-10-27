<?php

class Settings extends CI_Model {

	public $table = 'settings';

    function __construct(){
        // Call the Model constructor
        parent::__construct();
		$this->load->database();
    }

    public function getVal($param_name = null)
    {
        $this->db->select('param_value');

        if (!is_null($param_name)) 
		{
            $this->db->where('param_name', $param_name);
        }

        $query = $this->db->get($this->table);

        if($this->db->_error_message() || $query->result_array() == 0)
            $this->dbReportError('Unable to get setting ' . $param_name);

		$row = $query->row_array();

		return $row['param_value'];
    }

    private function dbReportError($message)
	{
        throw new Exception($message . ' ' . $this->db->_error_message() . ' error #' . 	$this->db->_error_number());
    }
}