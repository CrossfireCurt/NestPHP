<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller {

	private $noticeMsg = null;

    function __construct(){
        parent::__construct();
		$this->load->helper('url');
		$this->load->library('session');
		$this->load->view('includes/header');	
    }

	private function isLoggedIn()
	{
		$this->load->model('User_model', 'user');
		if($this->user->isLoggedIn(false))
		{	
			redirect(base_url() . 'index.php/user_admin');
			return true;
		}

		return false;
	}

    public function index(){	
		date_default_timezone_set('America/New_York');
		if($this->isLoggedIn()) return;
        $this->load->view('login', array('notice' => $this->noticeMsg));
		$this->load->view('includes/footer');	
    }

	public function doLogin()
	{
		if($this->isLoggedIn()) return;
		if(!$_POST) $this->index();

		$username	= $this->input->post('username', true);
        $password	= $this->input->post('password', true);
		
		$user = $this->user->getUserByUsername($username);

		if(!is_array($user) || count($user) == 0){
			$this->noticeMsg = 'This user does not exist.';
			$this->index();
			return;
		}

		if($user['password'] != md5($password))
		{
			$this->noticeMsg = 'You have entered an incorrect password.';
			$this->index();
			return;
		}

		$sessionData = array(
			'user_id'	=> $user['id'],
			'username'  => $user['username'],
			'email'     => $user['email'],
			'logged_in' => true,
			'is_admin'  => ($user['is_admin'] == '1')
		);
		
		$this->session->set_userdata($sessionData);
		$this->load->helper('url');
		redirect(base_url() . 'index.php/user_admin');
	}

	public function logout()
	{
		$this->load->library('session');

		$this->session->sess_destroy();
		$this->load->helper('url');
		redirect(base_url() . 'index.php/login');
	}

	public function register()
	{
		if($this->isLoggedIn()) return;
		$this->load->view('user_create');
	}
}