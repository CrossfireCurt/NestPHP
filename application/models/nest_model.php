<?php

class Nest_model extends CI_Model {

    function __construct(){
        // Call the Model constructor
        parent::__construct();
    }

    public function getNest($id){
		$this->load->database();
        $this->db->where('id', $id);
        $query = $this->db->get('nest');

        if($this->db->_error_message())
            $this->dbReportError('Unable to get nest #' . $id);

        return $query->row_array();
    }

    public function getAllNests(){
		$this->load->database();
		$this->db->where('is_deleted', '0');
		$this->db->order_by('id', 'asc');
		$query = $this->db->get('nest');

        if($this->db->_error_message())
            $this->dbReportError('Unable to get all nests.');

        return $query->result_array();
    }

    public function createNest($data){
        if(!is_array($data)) 
			throw new Exception('Invalid arguments passed.');

		$this->load->database();
        $this->db->insert('nest', $data);

        if($this->db->_error_message())
            $this->dbReportError('Unable to create nest');

        //die($this->db->last_query());
        return $this->db->insert_id();
    }
        
    public function updateNest($id, $data){
        if (!is_array($data))
            throw new Exception('Invalid arguments passed.');
            
        $this->load->database();
        $this->db->where('id', $id);
        $this->db->update('nest', $data);
        
        if ($this->db->_error_message())
            $this->dbReportError('Unable to edit nest.');
            
        return true;
    }
    
    public function deleteNest($id){
		$this->load->database();
        $this->db->where('id', $id);
		$this->db->update('nest', array('is_deleted' => '1'));

        if($this->db->_error_message())
            $this->dbReportError('Unable to delete nest.');

        return true;
    }

    private function dbReportError($message){
        throw new Exception($message . ' ' . $this->db->_error_message() . ' error #' . 	$this->db->_error_number());
    }
}