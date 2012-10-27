<?php

class User_model extends CI_Model {

    function __construct(){
        // Call the Model constructor
        parent::__construct();
    }

	function isLoggedIn($redirect = true)
	{
		$this->load->library('session');

		if($this->session->userdata('logged_in'))
			return true;

		if($redirect)
		{
			$this->load->helper('url');
			redirect(base_url() . 'index.php/login');
		}
		
		return false;
	}

    public function getUser($id){
		$this->load->database();
        $this->db->where('id', $id);
        $query = $this->db->get('users');

        if($this->db->_error_message())
            $this->dbReportError('Unable to get user #' . $id);

        return $query->row_array();
    }

    public function getAllUsers(){
		$this->load->database();
		$this->db->where('is_deleted', '0');
		$this->db->order_by('id', 'asc');
		$query = $this->db->get('users');

        if($this->db->_error_message())
            $this->dbReportError('Unable to get all users.');

        return $query->result_array();
    }

	public function getUserByUsername($username)
	{
		$this->load->database();
	
		$username = strtolower(trim($username));

		$this->db->where('lower(username)', $username);
		$query = $this->db->get('users');

		if($this->db->_error_message())
            $this->dbReportError('Unable to get user with username ' . $username);

		return $query->row_array();
	}

	public function userExists($username)
	{
		$user = $this->getUserByUsername($username);

		if(!is_array($user) || count($user) == 0) 
			return false;

		return true;
	}

    public function createUser($data){
        if(!is_array($data)) 
			throw new Exception('Invalid arguments passed.');

		$this->load->database();
        $this->db->insert('users', $data);

        if($this->db->_error_message())
            $this->dbReportError('Unable to create user');

        //die($this->db->last_query());
        return $this->db->insert_id();
    }
    
    
    public function updateUser($id, $data){
        if (!is_array($data))
            throw new Exception('Invalid arguments passed.');


            
        $this->load->database();
        $this->db->where('id', $id);
        $this->db->update('users', $data);
        
        if ($this->db->_error_message())
            $this->dbReportError('Unable to edit user.');
            
        return true;
    }
    
    public function deleteUser($id){
		$this->load->database();
        $this->db->where('id', $id);
		$this->db->update('users', array('is_deleted' => '1'));

        if($this->db->_error_message())
            $this->dbReportError('Unable to delete user.');

        return true;
    }

    private function dbReportError($message){
        throw new Exception($message . ' ' . $this->db->_error_message() . ' error #' . 	$this->db->_error_number());
    }
}