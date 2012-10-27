<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_admin extends CI_Controller {

    private $noticeMsg	= null;
    private $is_admin	= false;
    private $username	= null;
    private $user_id	= null;

    function __construct(){
        parent::__construct();

        $this->load->helper('url');
        $this->load->library('session');

        $this->is_admin = $this->session->userdata('is_admin');
        $this->username = $this->session->userdata('username');
        $this->user_id = $this->session->userdata('user_id');
        $this->loggedIn = ($this->session->userdata('logged_in') === true);

        $viewData = array(
        'username' => $this->username,
        'loggedIn' => $this->loggedIn,
        'isAdmin'  => $this->is_admin
        );

        $this->load->view('includes/header', $viewData);
    }

    private function isAdmin()
    {
        $this->load->model('User_model', 'user');
        if(!$this->user->isLoggedIn()) exit;

        if(!$this->is_admin)
        {
            redirect(base_url() . 'index.php/page_admin');
            return false;
        }

        return true;
    }

    public function generate_api_key(){
        //if (!isset($user_id)) return;

        if($this->isAdmin())
            $user_id = $this->input->get('user_id');
        else
            $user_id = $this->user_id;

        $this->load->model('User_model', 'user');

        $user = $this->user->getUser($user_id);
        die(md5($user['username']. $user['email'] . $user['password'] . time()));
    }

    public function index(){ //main page
        if(!$this->isAdmin()) return;

        $this->load->model('User_model', 'user');

        $viewData = array();
        $viewData['notice'] = $this->noticeMsg;
        $viewData['users']	= $this->user->getAllUsers();

        $this->load->view('user_admin', $viewData);
    }

    public function create(){
        //if(!$this->isAdmin()) return; //why would user signup be admin only?
        if (!$_POST){
            $flash = array(
            'status'    => 'error',
            'message'   => 'Expecting POST.'
            );
            $this->session->set_flashdata($flash);

            $this->load->view('user_create');
            return;
        }

        $username	= $this->input->post('username');
        $email		= $this->input->post('email');
        $password1	= $this->input->post('password1');
        $password2	= $this->input->post('password2');

        $this->load->model('User_model', 'user');

        if (!$username || !$email || !$password1 || !$password2){
            $flash = array(
            'status'   => 'error',
            'message'   => 'Oops! Please fill out all form fields.'
            );
            $this->session->set_flashdata($flash);
            redirect(base_url() . 'index.php/login/register');
            return;
        }


        if($this->user->userExists($username)){
            $flash = array(
            'status'   => 'error',
            'message'   => 'This username is already taken.'
            );
            $this->session->set_flashdata($flash);
            redirect(base_url() . 'index.php/login/register');
        }

        if($password1 != $password2){
            $flash = array(
            'status'   => 'error',
            'message'   => 'Passwords did not match.'
            );
            $this->session->set_flashdata($flash);
            redirect(base_url() . 'index.php/login/register');
            return;
        }

        try {
            $data = array(
            'username'	=> $username,
            'email'		=> $email,
            'password'	=> md5($password1),
            'api_key'   => md5($username . $email . $password1 . time())
            );

            $user_id = $this->user->createUser($data);
        }
        catch(Exception $e)
        {            
            $flash = array(
            'status'    => 'error',
            'message'   => $e->getMessage()
            );
            $this->session->set_flashdata($flash);
            $this->load->view('user_create', $viewData);
            return;
        }

        $flash = array(
        'status'   => 'success',
        'message'   => 'Successfully created user.'
        );
        $this->session->set_flashdata($flash);
        redirect(base_url() . 'index.php/user_admin');
    }

    //@todo: add deletion of users pages as well, just like edit
    public function delete($id, $page=null,$page_id=null){ 
        if(!$this->isAdmin()) return;
        if (!isset($id)) return;

        $this->load->model('User_model', 'user');

        if ($_POST){

            try {
                $this->user->deleteUser($id);
            } catch(Exception $e){
                $this->noticeMsg = $e->getMessage();
            }

            $flash = array(
            'status'   => 'success',
            'message'   => 'Successfully deleted user.'
            );
            $this->session->set_flashdata($flash);
            redirect(base_url() . 'index.php/user_admin');
            return;
        }

        $viewData = array(
        'user' => $this->user->getUser($id)
        );

        $this->load->view('user_delete', $viewData);
    }

    public function googleToken()
    {
        $this->load->model('User_model', 'user');
        if(!$this->user->isLoggedIn())
        {
            die('You are not logged in.');
        }

        $uriArray = explode('token=', $_SERVER['REQUEST_URI']);
        $token = $uriArray[1];
        $this->load->model('Google_model', 'google');
        $token = urldecode($token);

        $errorMsg = null;
        try{
            $result = $this->google->exchangeOneTimeToken($token);
        }catch(Exception $e){
            $errorMsg = $this->google->handleException($e);
        }

        if(!is_null($errorMsg))
        {
            $data['ga_token_status'] = -1;
            $flash = array(
            'status'   => 'error',
            'message'   => 'Unable to link your Google account. ' . $errorMsg
            );
        }
        else
        {
            $data['ga_token_status'] = 1;
            $data['ga_token'] = $result;
            $flash = array(
            'status'   => 'success',
            'message'   => 'Successfully linked your Google account. '
            );
        }

        $this->user->updateUser($this->user_id, $data);
        $this->session->set_flashdata($flash);
        redirect(base_url() . 'index.php/user_admin/edit');
    }


    public function edit($user_id = -1, $page=null,$page_id=null){
        //TODO: regular users cant access their settings page. redirects back to page_admin.
        //admins can do it just fine.        
        if(!$this->isAdmin() || $user_id == -1)
        {
            $user_id = $this->user_id;
        }

        $this->load->model('User_model', 'user');
        $this->load->model('Page_model', 'page');

        if ($_POST){ //post to the edit form, submit changes and such
            if ($page_id){
                //edit a users page
                $data['url'] = $this->input->post('editPage_url');
                $data['title'] = $this->input->post('editPage_title');
                $data['keywords'] = $this->input->post('editPage_keywords');
                $data['description'] = $this->input->post('editPage_description');

                $this->page->updatePage($page_id, $data);
            } else {
                //edit a users info                
                $password = $this->input->post('editUser_password');
                $password2 = $this->input->post('editUser_password2');

                if (md5($password) != md5($password2) || !$password || !$password2){
                    $errorMsg = "Passwords did not match.";
                    if (!$password) $errorMsg = "No password entered.";

                    $flash = array(
                    'status'   => 'error',
                    'message'   => $errorMsg
                    );
                    $this->session->set_flashdata($flash);
                    redirect(base_url() . 'index.php/user_admin/edit/' . $user_id);
                }

                $data['password'] = md5($password);
                $data['api_key'] = $this->input->post('editUser_api_key');
                $this->user->updateUser($user_id, $data);
            }

            $flash = array(
            'status'   => 'success',
            'message'   => 'User settings saved.'
            );
            $this->session->set_flashdata($flash);
            redirect(base_url() . 'index.php/user_admin/edit');
        }

        if($page){ //this is the actual edit page form
            if (!isset($page_id)) return;
            $userPage = $this->page->getSitePages($user_id, $page_id);
            $userPage[0]['formController'] = "user_admin"; //so we can re-use generic forms
            $userPage[0]['otherParams'] = "/page/$page_id";
            $userPage[0]['id'] = $user_id;
            var_dump($userPage);
            $this->load->view('page_edit', $userPage[0]);

        } else { //get user info and selected users pages
            $userData = $this->user->getUser($user_id);
            $userPages = $this->page->getSitePages($user_id);

            $viewData['id'] = $user_id;
            $viewData['username'] = $userData['username'];
            $viewData['usersPages'] = "";
            $viewData['api_key'] = $userData['api_key'];
            $viewData['ga_token'] = $userData['ga_token'];
            $viewData['ga_token_status'] = $userData['ga_token_status'];

            foreach ($userPages as $page){
                if ($userData['is_admin']){
                    $viewData['usersPages'] .= $page['id'] . " - url: " . $page['url'] . " - <a href=\"" . base_url() . "index.php/user_admin/edit/" . $user_id . "/page/" . $page['id'] . "\">edit</a><br>";
                } else {
                    $viewData['usersPages'] .= $page['id'] . " - url: " . $page['url'] . " - <a href=\"" . base_url() . "index.php/user_admin/edit/" . $user_id . "/page/" . $page['id'] . "\">edit</a> | <a href=\"" . base_url() . "index.php/user_admin/delete/" . $page['id'] . "\">delete</a><br>";
                }
            }

            $this->load->view('user_edit', $viewData);
        }
    }
}
